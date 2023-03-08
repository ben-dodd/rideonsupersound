import dayjs from 'dayjs'
import { axiosAuth } from 'lib/api'
import { mysql2js } from 'lib/database/utils/helpers'
import { useState, useEffect } from 'react'

export function useSalesForRange({ viewPeriod, rangeStartDate, rangeEndDate, clerkIds, viewLaybysOnly }) {
  const [properties, setProperties]: [any, Function] = useState({ isLoading: true })
  const [sales, setSales]: [any, Function] = useState(null)

  useEffect(() => {
    // Fetch the sales and registers for range
    setProperties({ isLoading: true })
    console.log('getting cart items...')
    axiosAuth
      .get(
        `/api/sale/range?startDate=${rangeStartDate}&endDate=${rangeEndDate}${
          clerkIds?.length > 0 && `&clerks=${clerkIds?.join(',')}`
        }${viewLaybysOnly && `&laybysOnly=${viewLaybysOnly}`}`,
      )
      .then((data) => {
        setSales(mysql2js(data))
      })
  }, [rangeStartDate, rangeEndDate, clerkIds, viewLaybysOnly])

  useEffect(() => {
    if (sales) {
      let grandTotal = 0
      let saleMap = {}
      sales?.forEach?.((transaction) => {
        let day = dayjs(transaction?.date)?.format('YYYY-MM-DD')
        if (saleMap?.[day] === undefined) saleMap[day] = { day, sales: {}, registers: [], total: 0 }
        if (saleMap?.[day]?.sales[transaction?.saleId] === undefined)
          saleMap[day].sales[transaction?.saleId] = {
            id: transaction?.saleId,
            itemList: transaction?.itemList,
            transactions: [],
          }
        saleMap[day].sales[transaction?.saleId].transactions.push(transaction)
        saleMap[day].total += transaction.amount
        grandTotal += transaction.amount
      })

      let saleArray = Object.values(saleMap)?.map((saleDay: any) => {
        return { ...saleDay, sales: Object.values(saleDay.sales) }
      })
      setProperties({ grandTotal, saleArray })
    }
  }, [sales, clerkIds])
  return properties
}
