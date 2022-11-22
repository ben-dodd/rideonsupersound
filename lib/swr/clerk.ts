import useData from '.'

export function useClerk(sub: string) {
  return useData(`clerk`, 'clerk')
}
