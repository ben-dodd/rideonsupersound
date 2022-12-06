import { snakeCase, transform, camelCase, isObject, isArray } from 'lodash'

export const js2mysql = (obj: any) => convertKeyCase(obj, 'snakeCase')

export const mysql2js = (obj: any) => convertKeyCase(obj, 'camelCase')

export const convertKeyCase = (obj: any, keyCase: 'camelCase' | 'snakeCase') =>
  transform(obj, (acc, value, key, target) => {
    const convertedKey = isArray(target)
      ? key
      : keyCase === 'camelCase'
      ? camelCase(String(key))
      : keyCase === 'snakeCase'
      ? snakeCase(String(key))
      : key
    acc[convertedKey] = isObject(value) ? convertKeyCase(value, keyCase) : value
  })
