import { axiosAuth, useData } from './'

export function useSetting(dbField) {
  return useData(`setting/${dbField}`, 'selects')
}

export function createSetting(setting) {
  return axiosAuth
    .post(`/api/setting`, setting)
    .then((res) => {
      return res.data
    })
    .catch((e) => Error(e.message))
}
