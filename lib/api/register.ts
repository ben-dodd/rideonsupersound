import useData from '.'

export function useRegister(register_id) {
  return useData(`register/${register_id}`, 'register')
}

export function useRegisters() {
  return useData(`register`, 'registers')
}

export function useCurrentRegister() {
  return useData(`register/current`, 'currentRegister')
}
