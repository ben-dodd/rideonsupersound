import axios from 'axios'
import useSWR from 'swr'

export async function fetcher(url: string) {
  return axios(url)
    .then((response) => response.data)
    .catch((error) => console.log(error))
}

export function useSalesJoined() {
  const { data, error, mutate } = useSWR(`/api/get-sales-join`, fetcher)

  return {
    sales: data,
    isSalesLoading: !error && !data,
    isSalesError: error,
    mutateSales: mutate,
  }
}

// TODO gift cards and misc items should probably be in separate table to other stock
export function useInventory() {
  const { data, error, mutate } = useSWR(`/api/get-stock-inventory`, fetcher)
  return {
    inventory: data,
    isInventoryLoading: !error && !data,
    isInventoryError: error,
    mutateInventory: mutate,
  }
}
export function useStockByVendor(vendor_id: number) {
  const { data, error, mutate } = useSWR(
    `/api/get-stock-by-vendor?vendor_id=${vendor_id}`,
    fetcher
  )
  return {
    vendorStock: data,
    isVendorStockLoading: !error && !data,
    isVendorStockError: error,
    mutateVendorStock: mutate,
  }
}

export function useStockSaleVars() {
  // Gets all stock items for getSaleVars and for SaveSale
  const { data, error, mutate } = useSWR(`/api/get-stock-sale-vars`, fetcher)
  return {
    stockSaleVars: data,
    isStockSaleVarsLoading: !error && !data,
    isStockSaleVarsError: error,
    mutateStockSaleVars: mutate,
  }
}

export function useStockDisplay() {
  // Gets all stock items, including misc and gift cards but gets less information
  // Used for list items, dropdowns etc.
  // Use where price etc. still required
  const { data, error, mutate } = useSWR(`/api/get-stock-display`, fetcher)
  return {
    stockDisplay: data,
    isStockDisplayLoading: !error && !data,
    isStockDisplayError: error,
    mutateStockDisplay: mutate,
  }
}

export function useStockDisplayMin() {
  // Gets all stock items, including misc and gift cards but gets less information
  // Used for list items, dropdowns etc.
  // Used for bare minimum needs
  // No misc items or gift cards
  const { data, error, mutate } = useSWR(`/api/get-stock-display-min`, fetcher)
  return {
    stockDisplay: data,
    isStockDisplayLoading: !error && !data,
    isStockDisplayError: error,
    mutateStockDisplay: mutate,
  }
}

export function useStockItem(stock_id: number) {
  const { data, error, mutate } = useSWR(
    `/api/get-stock-item?stock_id=${stock_id}`,
    fetcher
  )
  return {
    stockItem: data?.[0],
    isStockItemLoading: !error && !data,
    isStockItemError: error,
    mutateStockItem: mutate,
  }
}

export function useSaleTransactionsForSale(sale_id: number) {
  const { data, error, mutate } = useSWR(
    `/api/get-sale-transactions-for-sale?sale_id=${sale_id}`,
    fetcher
    // {
    //   refreshInterval: 500,
    // }
  )
  return {
    transactions: data,
    isSaleTransactionsLoading: !error && !data,
    isSaleTransactionsError: error,
    mutateSaleTransactions: mutate,
  }
}

export function useVendorTotalSales(vendor_id: number) {
  const { data, error, mutate } = useSWR(
    `/api/get-vendor-total-sales?vendor_id=${vendor_id}`,
    fetcher
  )

  return {
    totalSales: data,
    isVendorTotalSalesLoading: !error && !data,
    isVendorTotalSalesError: error,
    mutateVendorTotalSales: mutate,
  }
}

export function useStocktakeTemplates() {
  const { data, error, mutate } = useSWR(
    `/api/get-stocktake-templates`,
    fetcher
  )

  return {
    stocktakeTemplates: data,
    isStocktakeTemplatesLoading: !error && !data,
    isStocktakeTemplatesError: error,
    mutateStocktakeTemplates: mutate,
  }
}
