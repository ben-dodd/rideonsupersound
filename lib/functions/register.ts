import { TillObject } from 'lib/types'

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
  return Math.round((closeAmount + Number.EPSILON) * 100) / 100
}
