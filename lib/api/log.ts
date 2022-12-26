import { LogObject } from 'lib/types'
import { axiosAuth, useData } from './'

export function useLogs() {
  return useData(`log`, 'logs')
}

export async function createLog(log: LogObject) {
  return axiosAuth
    .post(`/api/log`, log)
    .then((res) => res.data)
    .catch((e) => Error(e.message))
}
