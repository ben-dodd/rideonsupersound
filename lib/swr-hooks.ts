import useSWR from 'swr'

async function nakedFetcher(url: string) {
  return window.fetch(url).then((res) => {
    return res.json()
  })
}

export function useVendorByUid(uid) {
  const { data, error } = useSWR(
    `/api/get-vendor-by-uid?uid=${uid}`,
    nakedFetcher
  )
  return {
    vendor: data?.[0],
    isVendorLoading: !error && !data,
    isVendorError: error,
  }
}

export function useVendorPaymentsByUid(uid) {
  const { data, error } = useSWR(
    `/api/get-vendor-payments-by-uid?uid=${uid}`,
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
    `/api/get-vendor-store-credit-by-uid?uid=${uid}`,
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
    `/api/get-vendor-sales-by-uid?uid=${uid}`,
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
    `/api/get-vendor-stock-by-uid?uid=${uid}`,
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
    `/api/get-vendor-stock-movement-by-uid?uid=${uid}`,
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
    `/api/get-vendor-stock-price-by-uid?uid=${uid}`,
    nakedFetcher
  )
  return {
    vendorStockPrice: data,
    isVendorStockPriceLoading: !error && !data,
    isVendorStockPriceError: error,
  }
}
