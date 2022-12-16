import {
  logCloseRegister,
  logOpenRegister,
  logPettyCash,
} from 'features/log/lib/functions'
import {
  createPettyCashInDatabase,
  createRegisterInDatabase,
  createTillInDatabase,
} from 'lib/database/create'
import {
  updateItemInDatabase,
  updateRegisterInDatabase,
} from 'lib/database/update'
import { ClerkObject, LogObject, RegisterObject, TillObject } from 'lib/types'
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

export async function saveClosedRegisterToDatabase(
  register_id: number,
  register: RegisterObject,
  till: TillObject
) {
  const tillID = await createTillInDatabase(till)
  updateRegisterInDatabase({
    id: register_id,
    close_till_id: tillID,
    close_date: dayjs.utc().format(),
  })
  logCloseRegister(register)
  setRegister(register_id)
}

export async function saveAndOpenRegister(
  register: RegisterObject,
  till: TillObject,
  clerk: ClerkObject
) {
  const tillID = await createTillInDatabase(till)
  const registerId = await createRegisterInDatabase({
    ...register,
    open_till_id: tillID,
    open_date: dayjs.utc().format(),
  })
  logOpenRegister(clerk, null, registerId)
  setRegister(registerId)
  return [{ num: registerId }]
}

export async function savePettyCashToRegister(
  registerID: number,
  clerk: ClerkObject,
  isTake: boolean,
  amount: string,
  note: string
) {
  const pettyCash = {
    register_id: registerID,
    clerk_id: clerk?.id,
    amount: dollarsToCents(amount),
    is_take: isTake,
    note,
    date: dayjs.utc().format(),
  }
  const pettyCashId = await createPettyCashInDatabase(pettyCash)
  logPettyCash(clerk, amount, isTake, pettyCashId)
}

export async function setRegister(register_id: number) {
  updateItemInDatabase({ num: register_id, id: 'current_register' }, 'global')
}
