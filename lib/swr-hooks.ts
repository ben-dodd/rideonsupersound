import useSWR from "swr";
import { getGeolocation } from "@/lib/data-functions";
import { VendorSaleItemObject } from "@/lib/types";

function fetcher(url: string) {
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

export function useInventory() {
  const { data, error, mutate } = useSWR(`/api/get-inventory`, fetcher);
  return {
    inventory: data,
    isInventoryLoading: !error && !data,
    isInventoryError: error,
    mutateInventory: mutate,
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

export function useSaleTransactions(sale_id: number) {
  const { data, error, mutate } = useSWR(
    `/api/get-sale-transactions?sale_id=${sale_id}`,
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

export function useSaleItems(sale_id: number) {
  const { data, error, mutate } = useSWR(
    `/api/get-sale-items?sale_id=${sale_id}`,
    fetcher
  );

  // If any sold items have more than one "stock price" row, we need to only select the latest one
  // (If stock prices are changed after a sale, it won't be included in the returned data)
  // TODO: Make it so MYSQL only returns the latest one.

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
    isLoading: !error && !data,
    isError: error,
    mutateTotalSales: mutate,
  };
}

export function useVendors() {
  const { data, error } = useSWR(`/api/get-vendors`, fetcher);
  return {
    vendors: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useVendorTotalPayments(contact_id: number) {
  const { data, error, mutate } = useSWR(
    `/api/get-vendor-total-payments?contact_id=${contact_id}`,
    fetcher
  );
  return {
    totalPayments: data,
    isLoading: !error && !data,
    isError: error,
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
  // TODO: Make it so MYSQL only returns the latest one.

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
  const { data, error } = useSWR(`/api/get-gift-cards`, fetcher);
  return {
    giftCards: data,
    isLoading: !error && !data,
    isError: error,
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
    isLoading: !error && !data,
    isError: error,
  };
}

export function useContact(contact_id: number) {
  const { data, error } = useSWR(
    `/api/get-contact?contact_id=${contact_id}`,
    fetcher
  );
  return {
    contact: data && data[0],
    isLoading: !error && !data,
    isError: error,
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
    `http://api.openweathermap.org/data/2.5/weather?${loc}&appid=${process.env.NEXT_PUBLIC_OPEN_WEATHER_API}&units=metric`,
    fetcher
  );
  return {
    weather: data,
    // geo: geolocation,
    isLoading: !error && !data,
    isError: error,
  };
}
