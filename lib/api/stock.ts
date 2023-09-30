import { ClerkObject } from 'lib/types'
import { SaleItemObject } from 'lib/types/sale'
import { StockItemObject, StockPriceObject, StocktakeTemplateObject } from 'lib/types/stock'
import { axiosAuth, useData } from './'
import { mysql2js } from 'lib/database/utils/helpers'

export function useStockList() {
  return useData(`stock`, 'stockList')
}

export function usePrintLabelStockList() {
  return useData(`stock/label`, 'printLabelStockList')
}

export function useStockForVendor(vendorId: string | number) {
  return useData(`stock/vendor/${vendorId}`, 'vendorStockList')
}

export function useBasicStockItem(id: string | number, wait?: boolean) {
  return useData(wait || !id ? null : `stock/${id}?basic=true`, 'stockItem')
}

export function useStockItem(id: string | number) {
  return useData(`stock/${id}`, 'stockItem')
}

export function useSaleStockItems(items: SaleItemObject[]) {
  return useData(
    `stock/items${items?.length > 0 ? `?items=${items?.map((item) => item?.itemId)?.join('+')}` : ''}`,
    'saleItems',
  )
}

export function useRestockList() {
  return useData(`stock/restock`, 'restockList')
}

export function useGiftCards() {
  return useData(`stock/giftcard`, 'giftCards')
}

export function useGiftCard(id) {
  return useData(id ? `stock/giftcard/${id}` : null, 'giftCard')
}

export function useStockMovements(limit = 50) {
  return useData(`stock/movement/${limit}`, 'stockMovements')
}

export function deleteStockItem(id) {
  return axiosAuth
    .patch(`/api/stock/delete/${id}`)
    .then((res) => res.data)
    .catch((e) => Error(e.message))
}

export function deleteStockPrice(id) {
  return axiosAuth
    .patch(`/api/stock/price/delete/${id}`)
    .then((res) => res.data)
    .catch((e) => Error(e.message))
}

export function createStockItem(stockItem: StockItemObject, clerk: ClerkObject) {
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
  // TODO does this need to be its own thing
  return axiosAuth.patch(`/api/stock/${id}/quantity`, update)
}

export function updateStockItem(update: any, id) {
  return id ? axiosAuth.patch(`/api/stock/${id}`, update) : null
}

export function createStocktakeTemplate(stocktakeTemplate: StocktakeTemplateObject, clerk: ClerkObject) {
  return axiosAuth
    .post(`/api/stocktake/template`, {
      ...stocktakeTemplate,
      createdByClerkId: clerk?.id,
    })
    .then((id) => {
      return { ...stocktakeTemplate, id }
    })
}

export function useStocktakeTemplates() {
  return useData(`stocktake/template`, 'stocktakeTemplates')
}

export function useReceiveBatches() {
  return useData(`stock/receive`, 'receiveBatches')
}

export function useReceiveBatch(id) {
  return useData(id ? `stock/receive/${id}` : null, 'receiveBatch')
}

export function saveReceiveBatch(receiveBatch, doComplete = false) {
  return axiosAuth
    .post(`/api/stock/receive/batch`, { receiveBatch, doComplete })
    .then((res) => {
      // Returns saved batch payment session
      return mysql2js(res)
    })
    .catch((e) => Error(e.message))
}

export function deleteReceiveBatch(batchId) {
  return axiosAuth
    .delete(`/api/stock/receive/batch/${batchId}`)
    .then((res) => res.data)
    .catch((e) => Error(e.message))
}

export function useCurrentReceiveBatchId() {
  return useData(`stock/receive/batch/current`, 'currentReceiveBatchId')
}
