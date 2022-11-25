import { snakeCase } from 'lodash'

export function prepareItemForDatabase(item: any) {
  let insertData = null
  if (Array.isArray(item))
    insertData = item.map((entry) => convertKeysToSnakeCase(entry))
  else insertData = convertKeysToSnakeCase(item)
  return insertData
}

export function convertKeysToSnakeCase(map: any) {
  if (typeof map === 'object') {
    let newMap = {}
    Object.entries(map).map(([key, value]) => (newMap[snakeCase(key)] = value))
  } else {
    return map
  }
}
