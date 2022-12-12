import useData from './'

export function useSetting(dbField) {
  return useData(`setting/${dbField}`, 'selects')
}

export function createSetting(dbField, setting) {
  return
}
