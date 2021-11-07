import useSWR from "swr";
import { getGeolocation } from "@/lib/data-functions";
import { VendorSaleItemObject } from "@/lib/types";

function fetcher(url: string) {
  return window.fetch(url).then((res) => {
    // console.log(res.json());
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
  const { data, error } = useSWR(`/api/get-account?email=${email}`, fetcher);
  return {
    account: data && data[0],
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
    image: data && data[0]?.image,
    isClerkImageLoading: !error && !data,
    isClerkImageError: error,
  };
}

export function useStockInventory() {
  const { data, error, mutate } = useSWR(`/api/get-stock-inventory`, fetcher);
  return {
    inventory: data,
    isInventoryLoading: !error && !data,
    isInventoryError: error,
    mutateInventory: mutate,
  };
}

export function useSaleInventory() {
  const { data, error, mutate } = useSWR(`/api/get-sale-inventory`, fetcher);
  return {
    saleInventory: data,
    isSaleInventoryLoading: !error && !data,
    isSaleInventoryError: error,
    mutateSaleInventory: mutate,
  };
}

export function useStockItem(stock_id: number) {
  const { data, error } = useSWR(
    `/api/get-stock-item?stock_id=${stock_id}`,
    fetcher
  );
  return {
    stockItem: data && data[0],
    isStockItemLoading: !error && !data,
    isStockItemError: error,
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
    items: totalSalesReduced,
    isSaleItemsLoading: !error && !data,
    isSaleItemsError: error,
    mutateSaleItems: mutate,
  };
}

export function useVendors() {
  const { data, error } = useSWR(`/api/get-vendors`, fetcher);
  return {
    vendors: data,
    isVendorsLoading: !error && !data,
    isVendorsError: error,
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

export function useVendorTotalPayments(contact_id: number) {
  const { data, error, mutate } = useSWR(
    `/api/get-vendor-total-payments?contact_id=${contact_id}`,
    fetcher
  );
  return {
    totalPayments: data,
    isVendorTotalPaymentsLoading: !error && !data,
    isVendorTotalPaymentsError: error,
    mutateVendorTotalPayments: mutate,
  };
}

export function useVendorTotalSales(contact_id: number) {
  const { data, error, mutate } = useSWR(
    `/api/get-vendor-total-sales?contact_id=${contact_id}`,
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
    isLoading: !error && !data,
    isError: error,
    mutateVendorTotalSales: mutate,
  };
}

export function useVendorFromVendorPayment(vendor_payment_id: number) {
  const { data, error } = useSWR(
    `/api/get-vendor-from-vendor-payment?vendor_payment_id=${vendor_payment_id}`,
    fetcher
  );
  return {
    vendor: data && data[0],
    isLoading: !error && !data,
    isError: error,
  };
}

export function useVendorFromContact(contact_id: number) {
  const { data, error } = useSWR(
    `/api/get-vendor-from-contact?contact_id=${contact_id}`,
    fetcher
  );
  return {
    vendor: data && data[0],
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

export function useGiftCard(gift_card_id: number) {
  const { data, error } = useSWR(
    `/api/get-gift-card?gift_card_id=${gift_card_id}`,
    fetcher
  );
  return {
    giftCard: data && data[0],
    isLoading: !error && !data,
    isError: error,
  };
}

export function useContacts() {
  const { data, error } = useSWR(
    `/api/get-contacts`,
    fetcher
    //   {
    //   refreshInterval: 5000,
    // }
  );
  return {
    contacts: data,
    isContactsLoading: !error && !data,
    isContactsError: error,
  };
}

export function useContact(contact_id: number) {
  const { data, error } = useSWR(
    `/api/get-contact?contact_id=${contact_id}`,
    fetcher
  );
  return {
    contact: data && data[0],
    isContactLoading: !error && !data,
    isContactError: error,
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

export function useLaybys() {
  const { data, error, mutate } = useSWR(`/api/get-laybys`, fetcher);
  return {
    laybys: data,
    isLaybysLoading: !error && !data,
    isLaybysError: error,
    mutateLaybys: mutate,
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

export function useHold(hold_id: number) {
  const { data, error } = useSWR(`/api/get-hold?hold_id=${hold_id}`, fetcher);
  return {
    hold: data && data[0],
    isHoldLoading: !error && !data,
    isHoldError: error,
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

export function useRegisterID() {
  const { data, error, mutate } = useSWR(`/api/get-register-id`, fetcher, {
    revalidateIfStale: false,
  });
  return {
    registerID: data && data[0] && data[0]?.num,
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
    register: data && data[0],
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

export function useWeather() {
  let loc = "id=2192362";
  // let geolocation = null;
  // if (navigator?.geolocation) {
  //   navigator?.geolocation?.getCurrentPosition((position) => {
  //     geolocation = {
  //       latitude: position.coords.latitude,
  //       longitude: position.coords.longitude,
  //     };
  //     loc = `lat=${position.coords.latitude}, lon=${position.coords.longitude}`;
  //     console.log(loc);
  //   });
  // }
  const { data, error } = useSWR(
    `https://api.openweathermap.org/data/2.5/weather?${loc}&appid=${process.env.NEXT_PUBLIC_OPEN_WEATHER_API}&units=metric`,
    fetcher
  );
  return {
    weather: data,
    // geo: geolocation,
    isLoading: !error && !data,
    isError: error,
  };
}
