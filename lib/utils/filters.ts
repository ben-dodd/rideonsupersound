import dayjs from 'dayjs'
import { centsToDollars } from '.'

export const tableFilterDateRange = (row, columnId, filterValue) => {
  const rowDate = row.getValue(columnId) ? dayjs(row.getValue(columnId)) : null
  const startDate = filterValue?.[0] ? dayjs(filterValue?.[0]) : null
  const endDate = filterValue?.[1] ? dayjs(filterValue?.[1]) : null
  if (!startDate && !endDate) {
    return true
  } else if (!rowDate) {
    return false
  } else if (startDate && !endDate) {
    return rowDate?.isSameOrAfter(startDate)
  } else if (endDate && !startDate) {
    return rowDate?.isSameOrBefore(endDate)
  } else {
    return rowDate?.isBetween(startDate, endDate, 'day', '[]')
  }
}

export const tableFilterCentsRange = (row, columnId, filterValue) => {
  const cents = row.getValue(columnId) ?? null
  const dollars = centsToDollars(cents)
  const minDollars = filterValue?.[0]
  const maxDollars = filterValue?.[1]
  return (
    (minDollars === null || minDollars === undefined || minDollars === '' || dollars >= Number(minDollars)) &&
    (maxDollars === null || maxDollars === undefined || maxDollars === '' || dollars <= Number(maxDollars))
  )
}

export const tableFilterStartsWith = (row, columnId, filterValue) => {
  return filterValue ? row.getValue(columnId)?.toString()?.startsWith(filterValue) : true
}
