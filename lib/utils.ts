import dayjs from 'dayjs'

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

export const parseJSON = (inputString, fallback) => {
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

export function priceCentsString(cents: number | string) {
  return isNaN(Number(cents))
    ? 'N/A'
    : centsToDollars(cents).toLocaleString('en-NZ', { style: 'currency', currency: 'NZD' })
}

export function priceDollarsString(amount: number | string) {
  const dollars = Number(amount)
  return isNaN(dollars) ? 'N/A' : dollars.toLocaleString('en-NZ', { style: 'currency', currency: 'NZD' })
}

export function eraseWhiteSpace(str) {
  return str.replace(/\s+/g, ' ').trim()
}

export function sumListField(list, field) {
  return list?.reduce?.((acc: number, obj: any) => acc + obj?.[field], 0)
}
