import { saveSystemLog } from 'features/log/lib/functions'
import { ClerkObject, HoldObject, SaleItemObject, SaleObject } from 'lib/types'
import axios from 'axios'
import { axiosAuth, useData } from './'

export function useSaleItemsForSale(saleId) {
  return useData(`sale/items/${saleId}`, 'saleItems')
}

export async function saveSale(sale: SaleObject, prevState?: string) {
  return axiosAuth.post(`/api/sale/save`, { sale, prevState })
}

export function createSale(sale: SaleObject, clerk: ClerkObject) {
  return axiosAuth.post(`/api/sale`, {
    ...sale,
    saleOpenedBy: clerk?.id,
  })
}

export function createHold(hold: HoldObject) {
  return axiosAuth.post(`/api/sale/hold`, hold)
}

export function updateSale(id, update) {
  return axiosAuth.patch(`/api/sale/${id}`, { update })
}

export function createSaleItem(saleItem: SaleItemObject) {
  return axiosAuth.post(`/api/sale/item`, saleItem)
}

export function updateSaleItem(id, update) {
  return axiosAuth.patch(`/api/sale/item/${id}`, { update })
}

export function deleteSale(id, { clerk, registerId }) {
  return axiosAuth.patch(`/api/sale/delete/${id}`, { clerk, registerId })
}

export function deleteSaleItem(id) {
  return axiosAuth.patch(`/api/sale/item/delete/${id}`)
}
