import { snakeCase, transform, camelCase, isObject, isArray, isBoolean } from 'lodash'

export const js2mysql = (obj: any) => (typeof obj === 'object' ? convertKeyCaseSingleLayer(obj, 'snakeCase') : obj)

export const checkValue = (value) => (value === -0 ? 0 : value)

export const mysql2js = (obj: any) =>
  obj == null ? obj : typeof obj === 'object' ? convertKeyCase(obj, 'camelCase') : checkValue(obj)

export const convertKeyCase = (obj: any, keyCase: 'camelCase' | 'snakeCase') =>
  transform(obj, (acc, value, key, target) => {
    const convertedKey = isArray(target)
      ? key
      : keyCase === 'camelCase'
      ? camelCase(String(key))
      : keyCase === 'snakeCase'
      ? snakeCase(String(key))
      : key
    acc[convertedKey] = isObject(value)
      ? convertKeyCase(value, keyCase)
      : isObject(JSON.parse(value))
      ? convertKeyCase(JSON.parse(value), keyCase)
      : checkValue(value)
  })

export const convertKeyCaseSingleLayer = (obj: any, keyCase: 'camelCase' | 'snakeCase') =>
  transform(obj, (acc, value, key, target) => {
    const convertedKey = isArray(target)
      ? key
      : keyCase === 'camelCase'
      ? camelCase(String(key))
      : keyCase === 'snakeCase'
      ? snakeCase(String(key))
      : key
    acc[convertedKey] = isObject(value) ? JSON.stringify(value) : isBoolean(value) ? (value ? 1 : 0) : checkValue(value)
  })
