import useSWR from "swr";
import { getGeolocation } from "@/lib/data-functions";

function fetcher(url: string) {
  return window.fetch(url).then((res) => {
    return res.json();
  });
}

export function useAccount(email: string) {
  const { data, error } = useSWR(`/api/get-account?email=${email}`, fetcher);
  return {
    account: data && data[0],
    isLoading: !error && !data,
    isError: error,
  };
}

export function useAccountClerks(account_id: number) {
  const { data, error } = useSWR(
    `/api/get-account-clerks?account_id=${account_id}`,
    fetcher
  );
  return {
    clerks: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useClerkImage(clerk_image_id: number) {
  const { data, error } = useSWR(
    `/api/get-clerk-image?clerk_image_id=${clerk_image_id}`,
    fetcher
  );
  return {
    image: data && data[0]?.image,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useInventory() {
  const { data, error } = useSWR(`/api/get-inventory`, fetcher);
  return {
    inventory: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useTransactions(sale_id: number) {
  const { data, error } = useSWR(
    `/api/get-transactions?sale_id=${sale_id}`,
    fetcher
  );
  return {
    transactions: data,
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

export function useContacts() {
  const { data, error } = useSWR(`/api/get-contacts`, fetcher, {
    refreshInterval: 5000,
  });
  return {
    contacts: data,
    isLoading: !error && !data,
    isError: error,
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
