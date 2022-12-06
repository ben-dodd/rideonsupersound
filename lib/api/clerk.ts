import useData from './'

export function useClerk() {
  return useData(`clerk`, 'clerk')
}

export function useClerks() {
  return useData(`clerks`, 'clerks')
}
