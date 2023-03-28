import { useData } from './'

export function useMe() {
  return useData(`auth/me`, 'me')
}

export function useClerk() {
  return useData(`clerk`, 'clerk')
}

export function useClerks() {
  return useData(`clerks`, 'clerks')
}
