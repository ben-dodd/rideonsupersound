import useSWR from "swr";

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

export function useGiftCards() {
  const { data, error } = useSWR(`/api/get-gift-cards`, fetcher);
  return {
    giftCards: data,
    isLoading: !error && !data,
    isError: error,
  };
}
