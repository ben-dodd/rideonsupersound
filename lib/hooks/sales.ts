import { axiosAuth } from 'lib/api'
import { mysql2js } from 'lib/database/utils/helpers'
import { useState, useEffect } from 'react'

export function useSalesForRange({ startDate, endDate }) {
  const [properties, setProperties]: [any, Function] = useState({ isLoading: true })
  const [sales, setSales]: [any, Function] = useState(null)

  useEffect(() => {
    // Fetch the sales and registers for range
    setProperties({ isLoading: true })
    console.log('getting cart items...')
    axiosAuth.get(`/api/sale/range?startDate=${startDate}&endDate=${endDate}`).then((data) => {
      setSales(mysql2js(data))
    })
  }, [startDate, endDate])

  useEffect(() => {
    if (sales) {
      setProperties({ sales })
    }
  }, [sales, startDate, endDate])
  return properties
}
