import useData from '.'

export function useStockList() {
  return useData(`stock`, 'stockList')
}

export function useStockItem(id: string) {
  return useData(`stock/${id}`, 'stockItem')
}

export function useRestockList() {
  return useData(`stock/restock`, 'restockList')
}
