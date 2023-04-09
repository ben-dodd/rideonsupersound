import { axiosAuth } from 'lib/api'
import { mysql2js } from 'lib/database/utils/helpers'
import { getSaleObjectProps } from 'lib/functions/pay'
import { useAppStore } from 'lib/store'
import { BasicStockObject } from 'lib/types/stock'
import { dollarsToCents } from 'lib/utils'
import { useState, useEffect } from 'react'

export function useSaleProperties(cart): any {
  const [properties, setProperties]: [any, Function] = useState({ isLoading: true })
  const { setCartSale } = useAppStore()
  const [stockTable, setStockTable]: [BasicStockObject[], Function] = useState(null)
  const { items = [], sale = {}, transactions = [] } = cart || {}
  console.log(cart)
  // console.log(items, sale)

  useEffect(() => {
    // Fetch the stock table from the database here
    // and set it using setStockTable()
    setProperties({ isLoading: true })
    console.log('getting cart items...')
    if (items?.length === 0) setStockTable([])
    else
      axiosAuth.get(`/api/stock/items?items=${items?.map((item) => item?.itemId)?.join('+')}`).then((data) => {
        setStockTable(mysql2js(data))
      })
  }, [items])

  useEffect(() => {
    if (stockTable?.length > 0) {
      const props = getSaleObjectProps({ ...cart, stock: stockTable })

      setProperties({
        isLoading: false,
        ...props,
      })
      const { totalStoreCut, totalPrice, numberOfItems, itemList } = props || {}
      setCartSale({
        storeCut: dollarsToCents(totalStoreCut),
        totalPrice: dollarsToCents(totalPrice),
        numberOfItems,
        itemList,
      })
    }
  }, [items, sale, transactions, stockTable])
  return properties
}
