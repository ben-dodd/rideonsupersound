import useSWR from 'swr'

async function nakedFetcher(url: string) {
  return window.fetch(url).then((res) => {
    return res.json()
  })
}

export function useVendorByUid(uid) {
  const { data, error } = useSWR(
    `/api/vendor/get/vendor?uid=${uid}`,
    nakedFetcher
  )
  return {
    vendor: data,
    isVendorLoading: !error && !data,
    isVendorError: error,
  }
}

export function useVendorPaymentsByUid(uid) {
  const { data, error } = useSWR(
    `/api/vendor/get/payments?uid=${uid}`,
    nakedFetcher
  )
  return {
    vendorPayments: data,
    isVendorPaymentsLoading: !error && !data,
    isVendorPaymentsError: error,
  }
}

export function useVendorStoreCreditsByUid(uid) {
  const { data, error } = useSWR(
    `/api/get/vendor/store-credit?uid=${uid}`,
    nakedFetcher
  )
  return {
    vendorStoreCredits: data,
    isVendorStoreCreditsLoading: !error && !data,
    isVendorStoreCreditsError: error,
  }
}

export function useVendorSalesByUid(uid) {
  const { data, error } = useSWR(
    `/api/get/vendor/sales?uid=${uid}`,
    nakedFetcher
  )
  return {
    vendorSales: data,
    isVendorSalesLoading: !error && !data,
    isVendorSalesError: error,
  }
}

export function useVendorStockByUid(uid) {
  const { data, error } = useSWR(
    `/api/get/vendor/stock?uid=${uid}`,
    nakedFetcher
  )
  return {
    vendorStock: data,
    isVendorStockLoading: !error && !data,
    isVendorStockError: error,
  }
}

export function useVendorStockMovementByUid(uid) {
  const { data, error } = useSWR(
    `/api/get/vendor/stock-movement?uid=${uid}`,
    nakedFetcher
  )
  return {
    vendorStockMovement: data,
    isVendorStockMovementLoading: !error && !data,
    isVendorStockMovementError: error,
  }
}

export function useVendorStockPriceByUid(uid) {
  const { data, error } = useSWR(
    `/api/get/vendor-stock-price?uid=${uid}`,
    nakedFetcher
  )
  return {
    vendorStockPrice: data,
    isVendorStockPriceLoading: !error && !data,
    isVendorStockPriceError: error,
  }
}