import { getItemDisplayName, getItemSku } from '../displayInventory'

describe('getItemSku', () => {
  it('should write a SKU from vendor and item ids', () => {
    expect(getItemSku({ id: 5, vendorId: 666 })).toBe('666/00005')
  })
  it('should handle cases where the vendor id or item id is undefined or null', () => {
    expect(getItemSku({ id: undefined, vendorId: 666 })).toBe('666/*****')
    expect(getItemSku({ id: null, vendorId: null })).toBe('***/*****')
    expect(getItemSku({ id: 5, vendorId: undefined })).toBe('***/00005')
  })
})

describe('getItemDisplayName', () => {
  test('Write display name', () => {
    expect(getItemDisplayName({ displayAs: 'The Works of Shakespeare' })).toBe('The Works of Shakespeare')
  })
})
