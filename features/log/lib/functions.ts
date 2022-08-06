import { createLogInDatabase } from '@/lib/database/create'
import dayjs from 'dayjs'
import { LogObject } from 'lib/types'

export async function saveSystemLog(
  log: LogObject,
  logs?: LogObject[],
  mutateLogs?: Function
) {
  saveLog({ ...log, table_id: 'system' }, logs, mutateLogs)
}

export async function saveLog(
  log: LogObject,
  logs?: LogObject[],
  mutateLogs?: Function
) {
  let logObj = { ...log, date_created: dayjs.utc().format() }
  const insertId = await createLogInDatabase(logObj)
  if (logs) mutateLogs?.([...logs, { ...logObj, id: insertId }], false)
}
