import useData from './'

export function useHelps() {
  return useData(`help`, 'helps')
}
