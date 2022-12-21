import axios from 'axios'
import { saveSystemLog } from 'features/log/lib/functions'
import {
  ClerkObject,
  SaleItemObject,
  StockObject,
  StockPriceObject,
  StocktakeTemplateObject,
} from 'lib/types'
import { apiAuth, useData } from './'

export function useStockList() {
  return useData(`stock`, 'stockList')
}

export function useStockItem(id: string) {
  return useData(`stock/${id}`, 'stockItem')
}

export function useSimpleStockItem(id: string) {
  return useData(`stock/${id}?simple=true`, 'stockItem')
}

export function useSaleStockItems(items: SaleItemObject[]) {
  return useData(
    `stock/items${
      items?.length > 0
        ? `?items=${items?.map((item) => item?.itemId)?.join('+')}`
        : ''
    }`,
    'saleItems'
  )
}

export function useRestockList() {
  return useData(`stock/restock`, 'restockList')
}

export function useGiftCards() {
  return useData(`stock/giftcard`, 'giftCards')
}

export function deleteStockItem(id) {
  return axios
    .post(`/api/stock/delete/${id}`)
    .then((res) => res.data)
    .catch((e) => Error(e.message))
}

export function createStockItem(stockItem: StockObject, clerk: ClerkObject) {
  return apiAuth().then((accessToken) =>
    axios
      .post(
        `/api/stock`,
        {
          ...stockItem,
          createdByClerkId: clerk?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((res) => {
        const id = res.data[0]
        // saveSystemLog(`New stock (${id}) created.`, clerk?.id)
        return { ...stockItem, createdByClerkId: clerk?.id, id }
      })
  )
}

export function createStockPrice(stockPrice: StockPriceObject) {
  return axios.post(`/api/stock/price`, stockPrice).then((res) => {
    const id = res.data
    // saveSystemLog(`New stock (${id}) created.`, clerk?.id)
    return { ...stockPrice, id }
  })
}

export function receiveStock(receiveStock: any) {
  return axios
    .patch(`/api/stock/receive`, receiveStock)
    .then((res) => res.data)
    .catch((e) => Error(e.message))
}

export function returnStock(returnStock: any) {
  return axios
    .patch(`/api/stock/return`, returnStock)
    .then((res) => res.data)
    .catch((e) => Error(e.message))
}

export function changeStockQuantity(update: any, id) {
  return axios
    .patch(`/api/stock/${id}/quantity`, update)
    .then((res) => res.data)
    .catch((e) => Error(e.message))
}

export function updateStockItem(update: any, id) {
  return axios
    .patch(`/api/stock/${id}`)
    .then((res) => res.data)
    .catch((e) => Error(e.message))
}

export function createStocktakeTemplate(
  stocktakeTemplate: StocktakeTemplateObject,
  clerk: ClerkObject
) {
  return axios
    .post(`/api/stocktake/template`, {
      ...stocktakeTemplate,
      createdByClerkId: clerk?.id,
    })
    .then((res) => {
      const id = res.data
      // saveSystemLog(`New stock (${id}) created.`, clerk?.id)
      return { ...stocktakeTemplate, id }
    })
}

export function useStocktakeTemplates() {
  return useData(`stocktake/template`, 'stocktakeTemplates')
}
