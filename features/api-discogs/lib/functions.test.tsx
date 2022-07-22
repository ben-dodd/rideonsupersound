import { StockObject } from '@/lib/types'
import { getPriceSuggestion } from './functions'
import { DiscogsConditionTypes } from './types'

test('get price suggestion from stock object', () => {
  let priceSuggestions = {
    [DiscogsConditionTypes.M]: { value: 10 },
    [DiscogsConditionTypes.VG]: { value: 8 },
    [DiscogsConditionTypes.G]: { value: 5 },
    [DiscogsConditionTypes.P]: { value: 1 },
  }
  let item: StockObject = {
    discogsItem: { priceSuggestions },
    is_new: 1,
  }
  expect(getPriceSuggestion(item)).toBe('$10.00 NZD (Mint (M) condition)')
  item.is_new = 0
  expect(getPriceSuggestion(item)).toBe('$5.00 NZD (Good (G) condition)')
  item.cond = DiscogsConditionTypes.P
  expect(getPriceSuggestion(item)).toBe('$1.00 NZD (Poor (P) condition)')
  item.discogsItem.priceSuggestions = {}
  expect(getPriceSuggestion(item)).toBe(null)
})
