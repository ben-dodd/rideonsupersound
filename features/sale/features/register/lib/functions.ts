import {
  logCloseRegister,
  logOpenRegister,
  logPettyCash,
} from 'features/log/lib/functions'
import { ClerkObject, RegisterObject, TillObject } from 'lib/types'
import { dollarsToCents } from 'lib/utils'
import dayjs from 'dayjs'

export function getAmountFromCashMap(till: TillObject) {
  let closeAmount: number = 0
  if (till) {
    const amountMap = {
      one_hundred_dollar: 100,
      fifty_dollar: 50,
      twenty_dollar: 20,
      ten_dollar: 10,
      five_dollar: 5,
      two_dollar: 2,
      one_dollar: 1,
      fifty_cent: 0.5,
      twenty_cent: 0.2,
      ten_cent: 0.1,
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
