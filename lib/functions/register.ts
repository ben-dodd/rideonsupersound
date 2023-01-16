import { TillObject } from 'lib/types/register'
import { centsToDollars, sumListField } from 'lib/utils'

export function getAmountFromCashMap(till: TillObject) {
  let closeAmount: number = 0
  if (till) {
    const amountMap: TillObject = {
      oneHundredDollar: 100,
      fiftyDollar: 50,
      twentyDollar: 20,
      tenDollar: 10,
      fiveDollar: 5,
      twoDollar: 2,
      oneDollar: 1,
      fiftyCent: 0.5,
      twentyCent: 0.2,
      tenCent: 0.1,
    }
    Object.entries(till).forEach(([denom, amount]: [string, string]) => {
      if (!amount) amount = '0'
      closeAmount += parseInt(amount) * amountMap[denom]
    })
  }
  // return rounded to 2 d.p.
  if (isNaN(closeAmount)) return 0
  return centsToDollars(Math.round((closeAmount + Number.EPSILON) * 100))
}

export function getRegisterValues(register: any, closeAmount) {
  const openAmount = centsToDollars(register?.openAmount)
  const closePettyBalance = centsToDollars(sumListField(register?.pettyCash, 'amount'))
  const closeCashGiven = centsToDollars(sumListField(register?.cashGiven, 'changeGiven'))
  const closeCashReceived = centsToDollars(sumListField(register?.cashReceived, 'cashReceived'))
  const closeManualPayments = centsToDollars(sumListField(register?.manualPayments, 'amount'))
  const closeExpectedAmount = openAmount + closePettyBalance + closeCashReceived - closeCashGiven - closeManualPayments
  const invalidCloseAmount = isNaN(parseFloat(closeAmount))
  const closeDiscrepancy = invalidCloseAmount ? 0 : closeExpectedAmount - parseFloat(closeAmount)
  const hasCashList =
    register?.cashReceived?.length > 0 ||
    register?.cashGiven?.length > 0 ||
    register?.manualPayments?.length > 0 ||
    register?.pettyCash?.length > 0
  return {
    openAmount,
    closePettyBalance,
    closeCashGiven,
    closeCashReceived,
    closeManualPayments,
    closeExpectedAmount,
    invalidCloseAmount,
    closeDiscrepancy,
    hasCashList,
  }
}
