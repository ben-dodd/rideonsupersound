import { ClerkObject } from 'lib/types'
import { CartObject, HoldObject, SaleItemObject } from 'lib/types/sale'
import { axiosAuth, useData } from './'
import { mysql2js } from 'lib/database/utils/helpers'

export function useSaleItemsForSale(saleId) {
  return useData(`sale/items/${saleId}`, 'saleItems')
}

export function useSale(saleId) {
  return useData(`sale/${saleId}`, 'sale')
}

export async function saveCart(cart: CartObject) {
  return axiosAuth
    .post(`/api/sale/save`, cart)
    .then((data) => mysql2js(data))
    .catch((error) => {
      throw error
    })
}

export function createSale(sale: any, clerk: ClerkObject) {
  return axiosAuth.post(`/api/sale`, {
    ...sale,
    saleOpenedBy: clerk?.id,
  })
}

export function createHold(hold: HoldObject) {
  return axiosAuth.post(`/api/sale/hold`, hold)
}

export function updateSale(update, id) {
  return axiosAuth.patch(`/api/sale/${id}`, update)
}

export function updateHold(update, id) {
  return axiosAuth.patch(`/api/sale/hold/${id}`, update)
}

export function cancelHold(hold, clerk, isAddedToCart = false) {
  return axiosAuth.patch(`/api/sale/hold/cancel/${hold?.id}`, { clerk, isAddedToCart })
}

export function createSaleItem(saleItem: SaleItemObject) {
  return axiosAuth.post(`/api/sale/item`, saleItem)
}

export function updateSaleItem(id, update) {
  return axiosAuth.patch(`/api/sale/item/${id}`, update)
}

export function deleteSale(id) {
  return axiosAuth.patch(`/api/sale/delete/${id}`)
}

export function deleteSaleItem(id) {
  return axiosAuth.patch(`/api/sale/item/delete/${id}`)
}

export function useSales() {
  return useData(`sale`, 'sales')
}

export function useParkedSales() {
  return useData(`sale/parked`, 'parkedSales')
}

export function useLaybys() {
  return useData(`sale/layby`, 'laybys')
}

export function useHolds() {
  return useData(`sale/hold`, 'holds')
}

export function useCurrentHolds() {
  return useData(`sale/hold/current`, 'currentHolds')
}

export function useHoldsForItem(itemId) {
  return useData(`sale/hold/item/${itemId}`, 'itemHolds')
}
