import useData from '.'

export function useStockList() {
  return useData(`stock`, 'stockList')
}
