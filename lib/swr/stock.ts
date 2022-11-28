import useData from '.'

export function useStockList() {
  return useData(`stock`, 'stockList')
}

export function useRestockList() {
  return useData(`stock/restock`, 'restockList')
}
