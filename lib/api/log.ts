import useData from './'

export function useLogs() {
  return useData(`log`, 'logs')
}
