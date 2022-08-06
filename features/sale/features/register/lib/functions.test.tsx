import { getAmountFromCashMap } from './functions'

test('Count cash from cash map', () => {
  expect(
    getAmountFromCashMap({
      one_hundred_dollar: 1,
      fifty_dollar: 1,
      twenty_dollar: 2,
      ten_dollar: null,
      five_dollar: null,
      two_dollar: 1,
      one_dollar: 10,
      fifty_cent: 1,
      twenty_cent: null,
      ten_cent: null,
    })
  ).toBe(202.5)
})
