import axios from 'axios'
import { saveSystemLog } from 'features/log/lib/functions'
import {
  ClerkObject,
  SaleItemObject,
  StockObject,
  StocktakeTemplateObject,
} from 'lib/types'
import useData from './'

export function useStockList() {
  return useData(`stock`, 'stockList')
}

export function useStockItem(id: string) {
  return useData(`stock/${id}`, 'stockItem')
}

export function useSaleStockItems(items: SaleItemObject[]) {
  return useData(
    `stock/items?items=${items?.map((item) => item?.itemId)?.join('+')}`,
    'saleItems'
  )
}

export function useRestockList() {
  return useData(`stock/restock`, 'restockList')
}

export function useGiftCards() {
  return useData(`stock/giftcard`, 'giftCards')
}

export function createStockItem(stockItem: StockObject, clerk: ClerkObject) {
  return axios
    .post(`/api/stock`, {
      ...stockItem,
      createdByClerkId: clerk?.id,
    })
    .then((res) => {
      const id = res.data
      // saveSystemLog(`New stock (${id}) created.`, clerk?.id)
      return { ...stockItem, id }
    })
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
