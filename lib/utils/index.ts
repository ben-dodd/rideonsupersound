import dayjs from 'dayjs'
import { snakeCase, transform, isObject, isArray, isBoolean, differenceWith, isEqual, toPairs } from 'lodash'

export function camelCase(str: string) {
  if (!str) return str
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
    if (+match === 0) return '' // or if (/\s+/.test(match)) for white spaces
    return index === 0 ? match.toLowerCase() : match.toUpperCase()
  })
}

export function pascalCase(str: string) {
  let camelCaseStr = camelCase(str)
  if (!camelCaseStr) return camelCaseStr
  return camelCaseStr[0].toUpperCase() + camelCaseStr.slice(1)
}

export function andList(list: string[]) {
  if (list === undefined || list.length === 0) return ''
  if (list.length === 1) return list[0]
  else
    return list
      .join('@')
      .replace(/@([^@]*)$/, ' and $1')
      .replace(/@/g, ', ')
}

export function convertDegToCardinal(deg: number) {
  const cardinalDirections = {
    N: [348.75, 360],
    NN: [0, 11.25],
    NNE: [11.25, 33.75],
    NE: [33.75, 56.25],
    ENE: [56.25, 78.75],
    E: [78.75, 101.25],
    ESE: [101.25, 123.75],
    SE: [123.75, 146.25],
    SSE: [146.25, 168.75],
    S: [168.75, 191.25],
    SSW: [191.25, 213.75],
    SW: [213.75, 236.25],
    WSW: [236.25, 258.75],
    W: [258.75, 281.25],
    WNW: [281.25, 303.75],
    NW: [303.75, 326.25],
    NNW: [326.25, 348.75],
  }

  let cardinal = null

  Object.entries(cardinalDirections).forEach(([k, v]) => {
    if (deg >= v[0] && deg < v[1]) cardinal = k
    if (cardinal == 'NN') cardinal = 'N'
  })
  return cardinal
}

export function convertMPStoKPH(mps: number) {
  return mps * 1.609
}

export const parseJSON = (inputString, fallback?) => {
  if (inputString) {
    try {
      return JSON.parse(inputString)
    } catch (e) {
      return fallback
    }
  } else return null
}

export function fFileDate(date?: Date | string) {
  return date ? dayjs(date).format('YYYY-MM-DD-HH-mm-ss') : 'Invalid Date'
}

export function latestDate(dates: Date[] | string[]) {
  return dates?.length > 0 ? dayjs.max(dates?.map((date: Date | string) => dayjs(date))) : null
}

export function isPreApp(date?: Date | string) {
  return !dayjs(date).isValid() || dayjs(date).isBefore(dayjs('2018-01-01'))
}

export function getLastValidElementByDate(list, dateField, targetDate) {
  return list
    ?.filter(
      (el) => dayjs(targetDate)?.isSame(dayjs(el?.[dateField])) || dayjs(targetDate)?.isAfter(dayjs(el?.[dateField])),
    )
    ?.sort(compareDates)
    ?.reverse()?.[0]
}

export function getArrayOfNumbersBetweenTwoNumbers(num1: number, num2: number) {
  const min = Math.min(num1, num2)
  const max = Math.max(num1, num2)
  const arr = Array.from({ length: max - min + 1 }, (v, k) => k + min)
  return arr
}

export function compareDates(a, b) {
  const dateA = dayjs(a.date)
  const dateB = dayjs(b.date)

  if (dateA.isBefore(dateB)) {
    return -1
  }
  if (dateA.isAfter(dateB)) {
    return 1
  }
  return 0
}

// export function authoriseUrl(url: string) {
//   let k = process.env.NEXT_PUBLIC_SWR_API_KEY
//   if (!url || !k) return null
//   if (url?.includes('?')) return `${url}&k=${k}`
//   else return `${url}?k=${k}`
// }

export function centsToDollars(amount: number | string) {
  const cents = Number(amount)
  return cents / 100
}

export function dollarsToCents(amount: number | string) {
  const dollars = Number(amount)
  return dollars * 100
}

export function priceCentsString(cents: number | string, roundToDollar: boolean = false) {
  return isNaN(Number(cents))
    ? 'N/A'
    : centsToDollars(cents).toLocaleString('en-NZ', {
        style: 'currency',
        currency: 'NZD',
        maximumFractionDigits: roundToDollar ? 0 : 2,
      })
}

export function priceDollarsString(amount: number | string, roundToDollar: boolean = false) {
  const dollars = Number(amount)
  return isNaN(dollars)
    ? 'N/A'
    : dollars.toLocaleString('en-NZ', {
        style: 'currency',
        currency: 'NZD',
        maximumFractionDigits: roundToDollar ? 0 : 2,
      })
}

export function eraseWhiteSpace(str) {
  return str.replace(/\s+/g, ' ').trim()
}

export function sumListField(list, field) {
  return list?.reduce?.((acc: number, obj: any) => acc + obj?.[field], 0)
}

export function getObjectDifference(obj1, obj2) {
  const diffArray = differenceWith(toPairs(obj1), toPairs(obj2), isEqual)
  let diffObj = {}
  diffArray?.forEach?.((el) => (diffObj[el[0]] = el[1]))
  return diffObj
}

export function getUniqueValues(field, array) {
  return Array.from(new Set(array?.map((item: any) => item[field])))?.sort() || []
}

export function arrayToReactSelect(array) {
  return array?.map((val) => ({ value: val || '', label: val || '' }))
}

// function convertToArray(dataFromDatabase) {
//   // Check if the data is a string
//   if (typeof dataFromDatabase === 'string') {
//     try {
//       // Try to parse the JSON string into an array
//       return JSON.parse(dataFromDatabase);
//     } catch (error) {
//       // If parsing fails, handle the error or return a default value
//       console.error('Error parsing JSON:', error);
//       return []; // You can return an empty array or handle the error differently
//     }
//   } else if (Array.isArray(dataFromDatabase)) {
//     // If it's already an array, return it as is
//     return dataFromDatabase;
//   } else {
//     // If it's neither a string nor an array, return a default value
//     return [];
//   }
// }

export const js2mysql = (obj: any) => (typeof obj === 'object' ? convertKeyCaseSingleLayer(obj, 'snakeCase') : obj)

export const checkValue = (value) => (value === -0 ? 0 : value)

export const mysql2js = (obj: any) =>
  obj == null ? obj : typeof obj === 'object' ? convertKeyCase(obj, 'camelCase') : checkValue(obj)

export const flattenObj = (obj, parentKey = '') => {
  let queryString = ''
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      let value = obj[key]
      let newKey = parentKey ? `${parentKey}.${key}` : key
      if (typeof value === 'object' && !Array.isArray(value)) {
        queryString += flattenObj(value, newKey)
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (typeof item === 'object') {
            queryString += flattenObj(item, `${newKey}.${index}`)
          } else {
            queryString += `${encodeURIComponent(`${newKey}.${index}`)}=${encodeURIComponent(item)}&`
          }
        })
      } else {
        queryString += `${encodeURIComponent(newKey)}=${encodeURIComponent(value)}&`
      }
    }
  }
  return queryString
}

export const obj2query = (obj) => {
  const queryString = flattenObj(obj)?.slice(0, -1)
  console.log('QUERY STRING')
  console.log(queryString)
  return queryString
}

export const query2obj = (queryString) => {
  const params = new URLSearchParams(queryString)
  const obj: any = {}

  params.forEach((value, key) => {
    const keys = key.split('.')
    let nestedObj = obj
    keys.forEach((nestedKey, index) => {
      // console.log('Nested: ', nestedKey, index)
      const nextKey = keys[index + 1]
      if (nextKey && /^\d+$/.test(nextKey)) {
        // Check if the next key is a number
        if (!nestedObj[nestedKey]) nestedObj[nestedKey] = []
        nestedObj = nestedObj[nestedKey]
      } else {
        if (!nestedObj[nestedKey]) {
          nestedObj[nestedKey] = index === keys.length - 1 ? parseValue(value) : {}
        }
        nestedObj = nestedObj[nestedKey]
      }
    })
  })

  return obj
}

const parseValue = (value) => {
  // Check if the value is an integer or a decimal
  const integerValueRegex = /^\d+$/
  const decimalValueRegex = /^\d+\.\d+$/

  if (integerValueRegex.test(value)) {
    return parseInt(value)
  } else if (decimalValueRegex.test(value)) {
    return parseFloat(value)
  } else {
    return decodeURIComponent(value)
  }
}

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
      : isObject(parseJSON(value))
      ? convertKeyCase(parseJSON(value), keyCase)
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
