import { axiosAuth, useData } from './'

export function useSetting(dbField) {
  return useData(`setting/${dbField}`, 'selects')
}

export function createSetting(setting) {
  return axiosAuth
    .post(`/api/setting`, setting)
    .then((res) => {
      const id = res.data
      // saveSystemLog(`New sale (${id}) created.`, clerk?.id)
      return id
    })
    .catch((e) => Error(e.message))
}
