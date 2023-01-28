import dayjs from 'dayjs'
import { axiosAuth } from 'lib/api'
import { mysql2js } from 'lib/database/utils/helpers'
import { useState, useEffect } from 'react'

export function useSalesForRange({ salesViewRange, salesViewClerks, salesViewLaybys }) {
  const { endDate, startDate } = salesViewRange || {}
  const [properties, setProperties]: [any, Function] = useState({ isLoading: true })
  const [sales, setSales]: [any, Function] = useState(null)
  console.log(sales)

  useEffect(() => {
    // Fetch the sales and registers for range
    setProperties({ isLoading: true })
    console.log('getting cart items...')
    axiosAuth
      .get(
        `/api/sale/range?startDate=${startDate}&endDate=${endDate}${
          salesViewClerks?.length > 0 && `&clerks=${salesViewClerks?.join(',')}`
        }${salesViewLaybys && `&laybysOnly=${salesViewLaybys}`}`,
      )
      .then((data) => {
        setSales(mysql2js(data))
      })
  }, [startDate, endDate, salesViewClerks, salesViewLaybys])

  useEffect(() => {
    if (sales) {
      let grandTotal = 0
      let saleMap = {}
      sales?.forEach?.((transaction) => {
        // if (salesViewClerks?.length === 0 || salesViewClerks?.includes(transaction?.clerkId)) {
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
        // }
      })
      // registers?.forEach?.((register) => {
      //   let openDay = dayjs(register?.open_date)?.format('YYYY-MM-DD')
      //   let closeDay = dayjs(register?.close_date)?.format('YYYY-MM-DD')
      //   if (saleMap?.[openDay] !== undefined) saleMap[openDay].registers.push({ ...register, type: 'open' })
      //   if (saleMap?.[closeDay] !== undefined) saleMap[closeDay].registers.push({ ...register, type: 'close' })
      // })

      let saleArray = Object.values(saleMap)?.map((saleDay: any) => {
        return { ...saleDay, sales: Object.values(saleDay.sales) }
      })
      setProperties({ grandTotal, saleArray })
    }
  }, [sales, salesViewClerks])
  return properties
}
