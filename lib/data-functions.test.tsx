import { getItemSku } from './data-functions'

test('Write item SKU from vendor and item ids', () => {
  expect(getItemSku({ id: 5, vendor_id: 666 })).toBe('666/00005')
})
