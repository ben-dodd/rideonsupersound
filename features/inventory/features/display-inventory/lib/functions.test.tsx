import {
  getHoldQuantity,
  getItemDisplayName,
  getItemSku,
  getLaybyQuantity,
} from './functions'

describe('Inventory Display', () => {
  test('Write item SKU from vendor and item ids', () => {
    expect(getItemSku({ id: 5, vendor_id: 666 })).toBe('666/00005')
  })

  test('Write display name', () => {
    expect(getItemDisplayName({ display_as: 'The Works of Shakespeare' })).toBe(
      'The Works of Shakespeare'
    )
  })

  test('Get hold quantity', () => {
    expect(getHoldQuantity({ quantity_hold: -1, quantity_unhold: null })).toBe(
      1
    )
    expect(getHoldQuantity({ quantity_hold: -4, quantity_unhold: 2 })).toBe(2)
  })

  test('Get layby quantity', () => {
    expect(
      getLaybyQuantity({ quantity_layby: null, quantity_unlayby: null })
    ).toBe(0 || -0)
  })
})
