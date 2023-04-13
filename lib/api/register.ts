import { axiosAuth, useData } from './'

export function useRegister(register_id) {
  return useData(`register/${register_id}`, 'register')
}

export function useRegisters() {
  return useData(`register`, 'registers')
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
