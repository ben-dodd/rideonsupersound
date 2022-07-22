export async function getExchangeRate() {
  return fetch(`https://api.exchangeratesapi.io/latest?symbols=USD,NZD`).then(
    (results) =>
      results
        .json()
        .then((json) => (json.rates ? json.rates.NZD / json.rates.USD : 1))
  )
}
