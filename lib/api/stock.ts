import { saveSystemLog } from 'features/log/lib/functions'
import { request } from 'superagent'
import { ClerkObject, StockObject } from 'lib/types'
import useData from './'

export function useStockList() {
  return useData(`stock`, 'stockList')
}

export function useStockItem(id: string) {
  return useData(`stock/${id}`, 'stockItem')
}

export function useRestockList() {
  return useData(`stock/restock`, 'restockList')
}

export function useGiftCards() {
  return useData(`stock/giftcard`, 'giftCards')
}

export function createStockItem(stockItem: StockObject, clerk: ClerkObject) {
  return request
    .post(`/api/stock`)
    .send({
      ...stockItem,
      createdByClerkId: clerk?.id,
    })
    .then((res) => {
      const id = res.json()
      saveSystemLog(`New stock (${id}) created.`, clerk?.id)
      return { ...stockItem, id }
    })
}
