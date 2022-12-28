import {
  getHoldQuantity,
  getItemDisplayName,
  getItemSku,
  getLaybyQuantity,
} from '../displayInventory'

describe('Inventory Display', () => {
  test('Write item SKU from vendor and item ids', () => {
    expect(getItemSku({ id: 5, vendorId: 666 })).toBe('666/00005')
  })

  test('Write display name', () => {
    expect(getItemDisplayName({ displayAs: 'The Works of Shakespeare' })).toBe(
      'The Works of Shakespeare'
    )
  })

  test('Get hold quantity', () => {
    expect(getHoldQuantity({ quantityHold: -1, quantityUnhold: null })).toBe(1)
    expect(getHoldQuantity({ quantityHold: -4, quantityUnhold: 2 })).toBe(2)
  })

  test('Get layby quantity', () => {
    expect(
      getLaybyQuantity({ quantityLayby: null, quantityUnlayby: null })
    ).toBe(0 || -0)
  })
})
