import axios from 'axios'

export function get(url, params = {}, callback = null) {
  return axios(url, params)
    .then((response) => (callback ? callback(response.data) : response.data))
    .catch((error) => {
      return error.message
      // throw Error(error.message)
    })
}

export async function getUSDExchangeRate() {
  return get(
    `https://api.apilayer.com/exchangerates_data/latest`,
    {
      params: { base: 'USD', symbols: 'NZD' },
      headers: {
        apikey: process.env.NEXT_PUBLIC_API_LAYER_API_KEY,
      },
    },
    (json) => json?.rates?.NZD ?? 1
  )
}
