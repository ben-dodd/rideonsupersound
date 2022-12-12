import useData from './'

export function useSetting(dbField) {
  return useData(`setting/${dbField}`, 'settings')
}

export function createSetting(dbField, setting) {
  return
}
