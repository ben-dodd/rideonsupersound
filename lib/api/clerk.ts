import { useUser } from '@auth0/nextjs-auth0/client'
import { useData } from './'

// export function useMe() {
//   return useData(`auth/me`, 'me')
// }

export function useMe() {
  const { user, isLoading, error } = useUser()
  return {
    me: user,
    isMeLoading: isLoading,
    isMeError: !!error
  }
}

export function useClerk() {
  return useData(`clerk`, 'clerk')
}

export function useClerks() {
  return useData(`clerks`, 'clerks')
}
