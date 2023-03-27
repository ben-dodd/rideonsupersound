import { axiosAuth, useData } from './'

export function useRegister(register_id) {
  return useData(`register/${register_id}`, 'register')
}

export function useRegisters() {
  return useData(`register`, 'registers')
}

export function useCurrentRegisterId() {
  console.log('calling current register id')
  return useData(`register/id`, 'registerId')
}

export function useSetRegisterId(setCart) {
  return axiosAuth.get('/api/register/id').then((registerId) => {
    console.log('Setting register id', registerId)
    setCart({ registerId })
  })
}

export function useCurrentRegister() {
  return useData(`register/current`, 'currentRegister')
}

export function savePettyCash(pettyCash) {
  return axiosAuth
    .post(`/api/register/pettycash`, pettyCash)
    .then((res) => {
      return res.data
    })
    .catch((e) => Error(e.message))
}

export function openRegister(register, till) {
  return axiosAuth.post(`/api/register/open`, { register, till }).catch((e) => Error(e.message))
}

export function closeRegister(id, register, till) {
  return axiosAuth.patch(`/api/register/close`, { id, register, till }).catch((e) => Error(e.message))
}
