import { saveLog } from '@/features/log/lib/functions'
import {
  createPettyCashInDatabase,
  createRegisterInDatabase,
  createTillInDatabase,
} from '@/lib/database/create'
import {
  updateItemInDatabase,
  updateRegisterInDatabase,
} from '@/lib/database/update'
import dayjs from 'dayjs'
import { ClerkObject, LogObject, RegisterObject, TillObject } from 'lib/types'

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
  till: TillObject,
  logs: LogObject[],
  mutateLogs: Function
) {
  const tillID = await createTillInDatabase(till)
  updateRegisterInDatabase({
    id: register_id,
    close_till_id: tillID,
    close_date: dayjs.utc().format(),
  })
  saveLog(
    {
      log: `Register closed.`,
      table_id: 'register',
      row_id: register_id,
      clerk_id: register?.closed_by_id,
    },
    logs,
    mutateLogs
  )
  setRegister(register_id)
}

export async function saveAndOpenRegister(
  register: RegisterObject,
  till: TillObject,
  clerk: ClerkObject,
  logs: LogObject[],
  mutateLogs: Function
) {
  const tillID = await createTillInDatabase(till)
  const registerId = await createRegisterInDatabase({
    ...register,
    open_till_id: tillID,
    open_date: dayjs.utc().format(),
  })
  saveLog(
    {
      log: `Register opened.`,
      table_id: 'register',
      row_id: registerId,
      clerk_id: clerk?.id,
    },
    logs,
    mutateLogs
  )
  setRegister(registerId)
  return [{ num: registerId }]
}

export async function savePettyCashToRegister(
  registerID: number,
  clerkID: number,
  isTake: boolean,
  amount: string,
  note: string,
  logs: LogObject[],
  mutateLogs: Function
) {
  const pettyCash = {
    register_id: registerID,
    clerk_id: clerkID,
    amount: parseFloat(amount) * 100,
    is_take: isTake,
    note,
    date: dayjs.utc().format(),
  }
  const insertId = await createPettyCashInDatabase(pettyCash)
  saveLog(
    {
      log: `$${parseFloat(amount)?.toFixed(2)} ${
        isTake ? 'taken from till.' : 'put in till.'
      }`,
      table_id: 'register_petty_cash',
      row_id: insertId,
      clerk_id: clerkID,
    },
    logs,
    mutateLogs
  )
}

export async function setRegister(register_id: number) {
  updateItemInDatabase({ num: register_id, id: 'current_register' }, 'global')
}
