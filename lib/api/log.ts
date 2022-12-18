import axios from 'axios'
import { LogObject } from 'lib/types'
import { useData } from './'

export function useLogs() {
  return useData(`log`, 'logs')
}

export async function createLog(log: LogObject) {
  return axios
    .post(`/api/log`, log)
    .then((res) => res.data)
    .catch((e) => Error(e.message))
}
