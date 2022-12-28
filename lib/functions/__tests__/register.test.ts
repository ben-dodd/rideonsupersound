import { getAmountFromCashMap } from '../register'

test('Count cash from cash map', () => {
  expect(
    getAmountFromCashMap({
      oneHundredDollar: 1,
      fiftyDollar: 1,
      twentyDollar: 2,
      tenDollar: null,
      fiveDollar: null,
      twoDollar: 1,
      oneDollar: 10,
      fiftyCent: 1,
      twentyCent: null,
      tenCent: null,
    })
  ).toBe(202.5)
})
