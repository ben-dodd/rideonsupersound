import axios from 'axios'
import {
  getTotalPaid,
  sumPrices,
  writeItemList,
} from 'features/pay/lib/functions'
import { StockObject } from 'lib/types'
import { useState, useEffect } from 'react'

export function useSaleProperties(cart) {
  const [properties, setProperties] = useState({})
  const [stockTable, setStockTable]: [StockObject[], Function] = useState([])

  useEffect(() => {
    // Fetch the stock table from the database here
    // and set it using setStockTable()
    axios(
      `stock/items?items=${cart?.items?.map((item) => item?.itemId)?.join('+')}`
    ).then((items) => setStockTable(items))
  }, [cart?.items])

  useEffect(() => {
    // Calculate the properties for the sale here
    // using the items and stockTable
    // and set them using setProperties()
    const cartItems = cart?.items
    const totalPostage = parseFloat(`${cart?.postage}`) || 0 // Postage: currently in dollars
    const totalStoreCut = sumPrices(cartItems, stockTable, 'storePrice') / 100 // Total Amount of Sale goes to Store in dollars
    const totalPriceUnrounded =
      sumPrices(
        cartItems.filter((s) => !s?.isRefunded),
        stockTable,
        'totalPrice'
      ) / 100 // Total Amount of Sale in dollars
    const totalVendorCut = totalPriceUnrounded - totalStoreCut // Total Vendor Cut in dollars
    const totalItemPrice =
      Math.round((totalPriceUnrounded + Number.EPSILON) * 10) / 10 // Total Amount rounded to 10c to avoid unpayable sales
    const totalPrice = totalItemPrice + totalPostage // TotalPrice + postage
    const totalPaid =
      Math.round(
        (getTotalPaid(cart?.transactions) / 100 + Number.EPSILON) * 10
      ) / 10 // Total Paid to nearest 10c
    const totalRemaining =
      Math.round((totalPrice - totalPaid + Number.EPSILON) * 10) / 10 // Amount remaining to pay
    setProperties({
      totalItemPrice,
      totalPrice,
      totalPostage,
      totalPaid,
      totalStoreCut,
      totalVendorCut,
      totalRemaining,
      numberOfItems: cart?.items
        ?.filter((item) => !item.isRefunded && !item?.isDeleted)
        ?.reduce((acc, item) => acc + parseInt(item?.quantity), 0), // Total number of items in sale
      itemList: writeItemList(stockTable, cartItems), // List of items written in full
    })
  }, [cart, stockTable])

  return properties
}
