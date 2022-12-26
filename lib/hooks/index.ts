import {
  getTotalPaid,
  roundToTenCents,
  sumPrices,
  writeItemList,
} from 'features/pay/lib/functions'
import { axiosAuth } from 'lib/api'
import { mysql2js } from 'lib/database/utils/helpers'
import { StockObject } from 'lib/types'
import { useState, useEffect } from 'react'

export function useSaleProperties(cart): any {
  const [properties, setProperties] = useState({})
  const [stockTable, setStockTable]: [StockObject[], Function] = useState([])
  const { items = [], sale = {}, transactions = [] } = cart || {}
  // console.log(items, sale)

  useEffect(() => {
    // Fetch the stock table from the database here
    // and set it using setStockTable()
    console.log('getting cart items...')
    if (items?.length === 0) setStockTable([])
    else
      axiosAuth
        .get(
          `api/stock/items?items=${items
            ?.map((item) => item?.itemId)
            ?.join('+')}`
        )
        .then((data) => {
          setStockTable(mysql2js(data))
        })
  }, [items])

  useEffect(() => {
    const totalPostage = parseFloat(`${sale?.postage}`) || 0 // Postage: currently in dollars
    const nonRefundedItems = items?.filter((item) => !item?.isRefunded)
    const totalStoreCut =
      sumPrices(nonRefundedItems, stockTable, 'storePrice') / 100 // Total Amount of Sale goes to Store in dollars
    const totalPriceUnrounded =
      sumPrices(nonRefundedItems, stockTable, 'totalPrice') / 100 // Total Amount of Sale in dollars
    const totalVendorCut = totalPriceUnrounded - totalStoreCut // Total Vendor Cut in dollars
    const totalItemPrice = roundToTenCents(totalPriceUnrounded)
    const totalPrice = totalItemPrice + totalPostage // TotalPrice + postage
    const totalPaid = roundToTenCents(getTotalPaid(transactions) / 100)
    const totalRemaining = roundToTenCents(totalPrice - totalPaid) // Amount remaining to pay
    setProperties({
      totalItemPrice,
      totalPrice,
      totalPostage,
      totalPaid,
      totalStoreCut,
      totalVendorCut,
      totalRemaining,
      numberOfItems: items
        ?.filter((item) => !item.isRefunded && !item?.isDeleted)
        ?.reduce((acc, item) => acc + parseInt(item?.quantity), 0), // Total number of items in sale
      itemList: writeItemList(stockTable, items), // List of items written in full
    })
  }, [items, sale, transactions, stockTable])
  console.log(properties)
  return properties
}
