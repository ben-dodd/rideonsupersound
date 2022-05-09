import useSWR from "swr";
import { authoriseUrl } from "@/lib/data-functions";
import { VendorSaleItemObject } from "@/lib/types";
import dayjs from "dayjs";

async function fetcher(url: string) {
  return window.fetch(authoriseUrl(url)).then((res) => {
    return res.json();
  });
}

async function nakedFetcher(url: string) {
  return window.fetch(url).then((res) => {
    return res.json();
  });
}

export function useAccount(email: string) {
  // if (!email)
  //   return {
  //     account: null,
  //     isLoading: false,
  //     isError: "No email.",
  //   };
  const { data, error } = useSWR(
    `/api/get-account?email=${email}`,
    nakedFetcher
  );
  return {
    account: data?.[0],
    isAccountLoading: !error && !data,
    isAccountError: error,
  };
}

export function useAccountClerks(account_id: number) {
  const { data, error } = useSWR(
    `/api/get-account-clerks?account_id=${account_id}`,
    fetcher
  );
  return {
    clerks: data,
    isAccountClerksLoading: !error && !data,
    isAccountClerksError: error,
  };
}

export function useClerks() {
  const { data, error } = useSWR(`/api/get-clerks`, fetcher);
  return {
    clerks: data,
    isClerksLoading: !error && !data,
    isClerksError: error,
  };
}

export function useClerkImage(clerk_image_id: number) {
  const { data, error } = useSWR(
    `/api/get-clerk-image?clerk_image_id=${clerk_image_id}`,
    fetcher
  );
  return {
    image: data?.[0]?.image,
    isClerkImageLoading: !error && !data,
    isClerkImageError: error,
  };
}

// TODO gift cards and misc items should probably be in separate table to other stock
export function useInventory() {
  const { data, error, mutate } = useSWR(`/api/get-stock-inventory`, fetcher);
  return {
    inventory: data,
    isInventoryLoading: !error && !data,
    isInventoryError: error,
    mutateInventory: mutate,
  };
}

export function useStockItem(stock_id: number) {
  const { data, error, mutate } = useSWR(
    `/api/get-stock-item?stock_id=${stock_id}`,
    fetcher
  );
  return {
    stockItem: data?.[0],
    isStockItemLoading: !error && !data,
    isStockItemError: error,
    mutateStockItem: mutate,
  };
}

export function useSaleById(sale_id: number) {
  const { data, error, mutate } = useSWR(
    `/api/get-sale-by-id?sale_id=${sale_id}`,
    fetcher
    // {
    //   refreshInterval: 500,
    // }
  );
  return {
    sale: data,
    isSaleLoading: !error && !data,
    isSaleError: error,
    mutateSale: mutate,
  };
}

export function useSaleTransactionsForSale(sale_id: number) {
  const { data, error, mutate } = useSWR(
    `/api/get-sale-transactions-for-sale?sale_id=${sale_id}`,
    fetcher
    // {
    //   refreshInterval: 500,
    // }
  );
  return {
    transactions: data,
    isSaleTransactionsLoading: !error && !data,
    isSaleTransactionsError: error,
    mutateSaleTransactions: mutate,
  };
}

export function useSaleItemsForSale(sale_id: number) {
  const { data, error, mutate } = useSWR(
    `/api/get-sale-items-for-sale?sale_id=${sale_id}`,
    fetcher
  );

  // If any sold items have more than one "stock price" row, we need to only select the latest one
  // (If stock prices are changed after a sale, it won't be included in the returned data)
  // REVIEW: Make it so MYSQL only returns the latest one.

  let duplicates = {};

  data?.forEach((sale: VendorSaleItemObject) => {
    let key = `${sale?.sale_id}-${sale?.item_id}`;
    // console.log(duplicates);
    // console.log(sale);
    if (
      !duplicates[key] ||
      duplicates[key]?.date_price_valid_from < sale?.date_price_valid_from
    )
      duplicates[key] = sale;
  });

  const totalSalesReduced = Object.values(duplicates);
  return {
    items: totalSalesReduced,
    isSaleItemsLoading: !error && !data,
    isSaleItemsError: error,
    mutateSaleItems: mutate,
  };
}

export function useVendors() {
  const { data, error, mutate } = useSWR(`/api/get-vendors`, fetcher);
  return {
    vendors: data,
    isVendorsLoading: !error && !data,
    isVendorsError: error,
    mutateVendors: mutate,
  };
}

export function useVendorByUid(uid) {
  const { data, error } = useSWR(
    `/api/get-vendor-by-uid?uid=${uid}`,
    nakedFetcher
  );
  return {
    vendor: data?.[0],
    isVendorLoading: !error && !data,
    isVendorError: error,
  };
}

export function useVendorPaymentsByUid(uid) {
  const { data, error } = useSWR(
    `/api/get-vendor-payments-by-uid?uid=${uid}`,
    nakedFetcher
  );
  return {
    vendorPayments: data,
    isVendorPaymentsLoading: !error && !data,
    isVendorPaymentsError: error,
  };
}

export function useVendorStoreCreditsByUid(uid) {
  const { data, error } = useSWR(
    `/api/get-vendor-store-credit-by-uid?uid=${uid}`,
    nakedFetcher
  );
  return {
    vendorStoreCredits: data,
    isVendorStoreCreditsLoading: !error && !data,
    isVendorStoreCreditsError: error,
  };
}

export function useVendorSalesByUid(uid) {
  const { data, error } = useSWR(
    `/api/get-vendor-sales-by-uid?uid=${uid}`,
    nakedFetcher
  );
  return {
    vendorSales: data,
    isVendorSalesLoading: !error && !data,
    isVendorSalesError: error,
  };
}

export function useVendorStockByUid(uid) {
  const { data, error } = useSWR(
    `/api/get-vendor-stock-by-uid?uid=${uid}`,
    nakedFetcher
  );
  return {
    vendorStock: data,
    isVendorStockLoading: !error && !data,
    isVendorStockError: error,
  };
}

export function useVendorStockMovementByUid(uid) {
  const { data, error } = useSWR(
    `/api/get-vendor-stock-movement-by-uid?uid=${uid}`,
    nakedFetcher
  );
  return {
    vendorStockMovement: data,
    isVendorStockMovementLoading: !error && !data,
    isVendorStockMovementError: error,
  };
}

export function useVendorStockPriceByUid(uid) {
  const { data, error } = useSWR(
    `/api/get-vendor-stock-price-by-uid?uid=${uid}`,
    nakedFetcher
  );
  return {
    vendorStockPrice: data,
    isVendorStockPriceLoading: !error && !data,
    isVendorStockPriceError: error,
  };
}

export function useVendorPayments() {
  const { data, error, mutate } = useSWR(`/api/get-vendor-payments`, fetcher);
  return {
    vendorPayments: data,
    isVendorPaymentsLoading: !error && !data,
    isVendorPaymentsError: error,
    mutateVendorPayments: mutate,
  };
}

export function useVendorTotalPayments(vendor_id: number) {
  const { data, error, mutate } = useSWR(
    `/api/get-vendor-total-payments?vendor_id=${vendor_id}`,
    fetcher
  );
  return {
    totalPayments: data,
    isVendorTotalPaymentsLoading: !error && !data,
    isVendorTotalPaymentsError: error,
    mutateVendorTotalPayments: mutate,
  };
}

export function useVendorTotalSales(vendor_id: number) {
  const { data, error, mutate } = useSWR(
    `/api/get-vendor-total-sales?vendor_id=${vendor_id}`,
    fetcher
  );

  // If any sold items have more than one "stock price" row, we need to only select the latest one
  // (If stock prices are changed after a sale, it won't be included in the returned data)
  // REVIEW: Make it so MYSQL only returns the latest one.

  let duplicates = {};

  data &&
    data.forEach((sale: VendorSaleItemObject) => {
      let key = `${sale?.sale_id}-${sale?.item_id}`;
      if (
        !duplicates[key] ||
        duplicates[key]?.date_valid_from < sale?.date_price_valid_from
      )
        duplicates[key] = sale;
    });

  const totalSalesReduced = Object.values(duplicates);

  return {
    totalSales: totalSalesReduced,
    isVendorTotalSalesLoading: !error && !data,
    isVendorTotalSalesError: error,
    mutateVendorTotalSales: mutate,
  };
}

export function useVendorFromVendorPayment(vendor_payment_id: number) {
  const { data, error } = useSWR(
    `/api/get-vendor-from-vendor-payment?vendor_payment_id=${vendor_payment_id}`,
    fetcher
  );
  return {
    vendor: data?.[0],
    isLoading: !error && !data,
    isError: error,
  };
}

export function useVendorFromCustomer(customer_id: number) {
  const { data, error } = useSWR(
    `/api/get-vendor-from-customer?customer_id=${customer_id}`,
    fetcher
  );
  return {
    vendor: data?.[0],
    isLoading: !error && !data,
    isError: error,
  };
}

export function useGiftCards() {
  const { data, error, mutate } = useSWR(`/api/get-gift-cards`, fetcher);
  return {
    giftCards: data,
    isGiftCardsLoading: !error && !data,
    isGiftCardsError: error,
    mutateGiftCards: mutate,
  };
}

export function useCustomers() {
  const { data, error, mutate } = useSWR(
    `/api/get-customers`,
    fetcher
    //   {
    //   refreshInterval: 5000,
    // }
  );
  return {
    customers: data,
    isCustomersLoading: !error && !data,
    isCustomersError: error,
    mutateCustomers: mutate,
  };
}

export function useCustomer(customer_id: number) {
  const { data, error } = useSWR(
    `/api/get-customer?customer_id=${customer_id}`,
    fetcher
  );
  return {
    customer: data?.[0],
    isCustomerLoading: !error && !data,
    isCustomerError: error,
  };
}

export function useSales() {
  const { data, error, mutate } = useSWR(`/api/get-sales`, fetcher);
  return {
    sales: data,
    isSalesLoading: !error && !data,
    isSalesError: error,
    mutateSales: mutate,
  };
}

export function useSalesJoined() {
  const { data, error, mutate } = useSWR(`/api/get-sales-join`, fetcher);

  // If any sold items have more than one "stock price" row, we need to only select the latest one
  // (If stock prices are changed after a sale, it won't be included in the returned data)
  // REVIEW: Make it so MYSQL only returns the latest one.

  let duplicates = {};

  data?.forEach?.((sale: VendorSaleItemObject) => {
    let key = `${sale?.sale_id}-${sale?.item_id}`;
    if (
      !duplicates[key] ||
      dayjs(duplicates[key]?.date_price_valid_from)?.isBefore(
        dayjs(sale?.date_price_valid_from)
      )
    )
      duplicates[key] = sale;
  });

  const totalSalesReduced = Object.values(duplicates);

  return {
    sales: totalSalesReduced,
    isSalesLoading: !error && !data,
    isSalesError: error,
    mutateSales: mutate,
  };
}

export function useSaleItems() {
  const { data, error, mutate } = useSWR(`/api/get-sale-items`, fetcher);
  return {
    saleItems: data,
    isSaleItemsLoading: !error && !data,
    isSaleItemsError: error,
    mutateSaleItems: mutate,
  };
}

export function useHelps() {
  const { data, error, mutate } = useSWR(`/api/get-helps`, fetcher);
  return {
    helps: data,
    isHelpsLoading: !error && !data,
    isHelpsError: error,
    mutateHelps: mutate,
  };
}

export function useHolds() {
  const { data, error, mutate } = useSWR(`/api/get-holds`, fetcher);
  return {
    holds: data,
    isHoldsLoading: !error && !data,
    isHoldsError: error,
    mutateHolds: mutate,
  };
}

export function useLogs() {
  const { data, error, mutate } = useSWR(`/api/get-logs`, fetcher);
  return {
    logs: data,
    isLogsLoading: !error && !data,
    isLogsError: error,
    mutateLogs: mutate,
  };
}

export function useStockMovements(limit) {
  const { data, error, mutate } = useSWR(
    `/api/get-stock-movements?limit=${limit}`,
    fetcher
  );
  return {
    stockMovements: data,
    isStockMovementsLoading: !error && !data,
    isStockMovementsError: error,
    mutateStockMovements: mutate,
  };
}

export function useStockMovementByStockId(id) {
  const { data, error, mutate } = useSWR(
    `/api/get-stock-movements-by-stock-id?id=${id}`,
    fetcher
  );
  return {
    stockMovements: data,
    isStockMovementsLoading: !error && !data,
    isStockMovementsError: error,
    mutateStockMovements: mutate,
  };
}

export function useJobs() {
  const { data, error, mutate } = useSWR(`/api/get-jobs`, fetcher);
  return {
    jobs: data,
    isJobsLoading: !error && !data,
    isJobsError: error,
    mutateJobs: mutate,
  };
}

export function useStocktakes() {
  const { data, error, mutate } = useSWR(`/api/get-stocktakes`, fetcher);
  return {
    stocktakes: data,
    isStocktakesLoading: !error && !data,
    isStocktakesError: error,
    mutateStocktakes: mutate,
  };
}

export function useRegisterID() {
  const { data, error, mutate } = useSWR(`/api/get-register-id`, nakedFetcher, {
    revalidateIfStale: false,
  });
  return {
    registerID: data?.[0] && data[0]?.num,
    isRegisterIDLoading: !error && !data,
    isRegisterIDError: error,
    mutateRegisterID: mutate,
  };
}

export function useRegister(register_id: number) {
  const { data, error, mutate } = useSWR(
    `/api/get-register?register_id=${register_id}`,
    fetcher
  );
  return {
    register: data?.[0],
    isRegisterLoading: !error && !data,
    isRegisterError: error,
    mutateRegister: mutate,
  };
}

export function usePettyCash(register_id: number) {
  const { data, error, mutate } = useSWR(
    `/api/get-petty-cash?register_id=${register_id}`,
    fetcher
  );
  return {
    pettyCash: data,
    isPettyCashLoading: !error && !data,
    isPettyCashError: error,
    mutatePettyCash: mutate,
  };
}

export function useCashGiven(register_id: number) {
  const { data, error, mutate } = useSWR(
    `/api/get-cash-given?register_id=${register_id}`,
    fetcher
  );
  return {
    cashGiven: data,
    isCashGivenLoading: !error && !data,
    isCashGivenError: error,
    mutateCashGiven: mutate,
  };
}

export function useCashReceived(register_id: number) {
  const { data, error, mutate } = useSWR(
    `/api/get-cash-received?register_id=${register_id}`,
    fetcher
  );
  return {
    cashReceived: data,
    isCashReceivedLoading: !error && !data,
    isCashReceivedError: error,
    mutateCashReceived: mutate,
  };
}

export function useManualPayments(register_id: number) {
  const { data, error, mutate } = useSWR(
    `/api/get-manual-payments?register_id=${register_id}`,
    fetcher
  );
  return {
    manualPayments: data,
    isManualPaymentsLoading: !error && !data,
    isManualPaymentsError: error,
    mutateManualPayments: mutate,
  };
}

export function useSelect(setting_select: string) {
  const { data, error, mutate } = useSWR(
    `/api/get-selects?setting_select=${setting_select}`,
    fetcher
  );
  return {
    selects: data,
    isSelectsLoading: !error && !data,
    isSelectsError: error,
    mutateSelects: mutate,
  };
}

export function useAllSelects() {
  const { data, error, mutate } = useSWR(`/api/get-all-selects`, fetcher);
  return {
    selects: data,
    isSelectsLoading: !error && !data,
    isSelectsError: error,
    mutateSelects: mutate,
  };
}

export function useWeather() {
  let loc = "id=2192362";
  if (navigator?.geolocation) {
    navigator?.geolocation?.getCurrentPosition((position) => {
      loc = `lat=${position.coords.latitude}, lon=${position.coords.longitude}`;
    });
  }
  const { data, error } = useSWR(
    `https://api.openweathermap.org/data/2.5/weather?${loc}&appid=${process.env.NEXT_PUBLIC_OPEN_WEATHER_API}&units=metric`,
    fetcher
  );
  return {
    weather: data,
    isLoading: !error && !data,
    isError: error,
  };
}
