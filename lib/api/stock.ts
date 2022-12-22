import axios from 'axios'
import { saveSystemLog } from 'features/log/lib/functions'
import {
  ClerkObject,
  SaleItemObject,
  StockObject,
  StockPriceObject,
  StocktakeTemplateObject,
} from 'lib/types'
import { axiosAuth, useData } from './'

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
  return axiosAuth
    .post(`/api/stock`, {
      ...stockItem,
      createdByClerkId: clerk?.id,
    })
    .then((ids) => {
      return { ...stockItem, createdByClerkId: clerk?.id, id: ids[0] }
    })
}

export function createStockPrice(stockPrice: StockPriceObject) {
  return axiosAuth.post(`/api/stock/price`, stockPrice).then((res) => {
    const id = res.data
    // saveSystemLog(`New stock (${id}) created.`, clerk?.id)
    return { ...stockPrice, id }
  })
}

export function receiveStock(receiveStock: any) {
  return axiosAuth.patch(`/api/stock/receive`, receiveStock)
}

export function returnStock(returnStock: any) {
  return axiosAuth.patch(`/api/stock/return`, returnStock)
}

export function changeStockQuantity(update: any, id) {
  return axiosAuth.patch(`/api/stock/${id}/quantity`, update)
}

export function updateStockItem(update: any, id) {
  return axiosAuth.patch(`/api/stock/${id}`)
}

export function createStocktakeTemplate(
  stocktakeTemplate: StocktakeTemplateObject,
  clerk: ClerkObject
) {
  return axiosAuth
    .post(`/api/stocktake/template`, {
      ...stocktakeTemplate,
      createdByClerkId: clerk?.id,
    })
    .then((id) => {
      // saveSystemLog(`New stock (${id}) created.`, clerk?.id)
      return { ...stocktakeTemplate, id }
    })
}

export function useStocktakeTemplates() {
  return useData(`stocktake/template`, 'stocktakeTemplates')
}
