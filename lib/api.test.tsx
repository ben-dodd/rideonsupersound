import { getUSDExchangeRate } from './api'

jest.setTimeout(10000)

test('get USD exchange rate', () => {
  return getUSDExchangeRate().then((data) => expect(data).toBeGreaterThan(1))
})
