export async function saveSystemLog(log: string, clerkID: number) {
  let logObj = {
    date_created: dayjs.utc().format(),
    log: log,
    clerk_id: clerkID,
    table_id: 'system',
  }
  try {
    const res = await fetch(
      `/api/create-log?k=${process.env.NEXT_PUBLIC_SWR_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logObj),
      }
    )
    const json = await res.json()
    if (!res.ok) throw Error(json.message)
  } catch (e) {
    throw Error(e.message)
  }
}

export async function saveLog(
  log: LogObject,
  logs?: LogObject[],
  mutateLogs?: Function
) {
  let logObj = {
    date_created: dayjs.utc().format(),
    log: log?.log,
    table_id: log?.table_id || null,
    row_id: log?.row_id || null,
    clerk_id: log?.clerk_id || null,
  }
  const insertId = await createLogInDatabase(logObj)
  if (logs) mutateLogs?.([...logs, { ...logObj, id: insertId }], false)
}
