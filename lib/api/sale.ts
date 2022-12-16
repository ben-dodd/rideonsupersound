import { saveSystemLog } from 'features/log/lib/functions'
import { ClerkObject, SaleItemObject, SaleObject } from 'lib/types'
import axios from 'axios'
import useData from './'

export function useSaleItemsForSale(saleId) {
  return useData(`sale/items/${saleId}`, 'saleItems')
}

export async function saveSale(sale: SaleObject, prevState?: string) {
  return axios
    .post(`/api/sale/save`, { sale, prevState })
    .then((res) => {
      const id = res.data
      // saveSystemLog(`New sale (${id}) created.`, clerk?.id)
      return id
    })
    .catch((e) => Error(e.message))
}

export function createSale(sale: SaleObject, clerk: ClerkObject) {
  return axios
    .post(`/api/sale`, {
      ...sale,
      saleOpenedBy: clerk?.id,
    })
    .then((res) => {
      const id = res.data
      saveSystemLog(`New sale (${id}) created.`, clerk?.id)
      return id
    })
    .catch((e) => Error(e.message))
}

export function updateSale(id, update) {
  return axios
    .patch(`/api/sale/${id}`, { update })
    .then((res) => res.data)
    .catch((e) => Error(e.message))
}

export function createSaleItem(saleItem: SaleItemObject) {
  return axios
    .post(`/api/sale/item`, saleItem)
    .then((res) => res.data)
    .catch((e) => Error(e.message))
}

export function updateSaleItem(id, update) {
  return axios
    .patch(`/api/sale/item/${id}`, { update })
    .then((res) => res.data)
    .catch((e) => Error(e.message))
}

export function nukeSale(id, { clerk, registerId }) {
  return axios
    .patch(`/api/sale/delete/${id}`, { clerk, registerId })
    .then((res) => res.data)
    .catch((e) => Error(e.message))
}
