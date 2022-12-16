import axios from 'axios'
import useData from './'

export function useRegister(register_id) {
  return useData(`register/${register_id}`, 'register')
}

export function useRegisters() {
  return useData(`register`, 'registers')
}

export function useCurrentRegisterId() {
  return useData(`register/id`, 'registerId')
}

export function useCurrentRegister() {
  return useData(`register/current`, 'currentRegister')
}

export function savePettyCash(pettyCash) {
  return axios
    .post(`/api/register/pettycash`, pettyCash)
    .then((res) => {
      const id = res.data
      // saveSystemLog(`New sale (${id}) created.`, clerk?.id)
      return id
    })
    .catch((e) => Error(e.message))
}
