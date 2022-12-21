import {
  getCartItemStoreCut,
  getCartItemTotal,
  getCartItemVendorCut,
  getDiscountedPrice,
  getStoreCut,
  makeGiftCardCode,
} from './functions'

describe('writeCartItemPriceBreakdown', () => {
  test.todo(
    'should write out a price breakdown based on a cart item and an item'
  )
})

describe('getDiscountedPrice', () => {
  it('should get a price from a base cost, discount and quantity', () => {
    expect(getDiscountedPrice(100, 50, 2)).toEqual(100)
    expect(getDiscountedPrice(0.5, 100, 5)).toEqual(0)
    expect(getDiscountedPrice(25, 1, 0)).toEqual(0)
    expect(getDiscountedPrice(25, 1, 1)).toEqual(24.75)
  })
  it('should handle arguments that are strings', () => {
    expect(getDiscountedPrice('100', 50, 2)).toEqual(100)
    expect(getDiscountedPrice(100, '50', 2)).toEqual(100)
    expect(getDiscountedPrice(100, 50, '2')).toEqual(100)
    expect(getDiscountedPrice('100', '50', '2')).toEqual(100)
  })
})

const cartItem = {
  vendorCut: 100,
  vendorDiscount: '50',
  storeDiscount: '25',
  quantity: '2',
}

const stockItem = { vendorCut: 100, isMiscItem: false, totalSell: 300 }

const cartItem2 = {
  quantity: '2',
}

const stockItem2 = { totalSell: 5500, vendorCut: 4300 }

describe('getCartItemVendorCut', () => {
  it('should return the vendor cut given a cart item and a stock item', () => {
    expect(getCartItemVendorCut(cartItem, stockItem)).toEqual(100)
    expect(getCartItemVendorCut(cartItem2, stockItem2)).toEqual(8600)
  })
})

describe('getCartItemStoreCut', () => {
  it('should return the store cut given a cart item and a stock item', () => {
    expect(getCartItemStoreCut(cartItem, stockItem)).toEqual(300)
    expect(getCartItemStoreCut(cartItem2, stockItem2)).toEqual(2400)
  })
})

describe('getCartItemTotal', () => {
  it('should return the total price for an item after discounts have been applied', () => {
    expect(getCartItemTotal(cartItem, stockItem)).toEqual(400)
    expect(getCartItemTotal(cartItem2, stockItem2)).toEqual(11000)
  })
})

describe('getStoreCut', () => {
  it('should return the store cut given the total sell and the vendor cut', () => {
    expect(getStoreCut(stockItem)).toEqual(200)
  })
})

describe('getItemQuantity', () => {
  it.todo(
    'should get the quantity after removing the cart items from the total stock'
  )
})

describe('filterInventory', () => {
  it.todo('should return a filtered list based on the search query')
})

describe('sortInventory', () => {
  it.todo('should sort the inventory by quantity')
})

describe('makeGiftCardCode', () => {
  it('should make a random 6-letter alphabetical code', () => {
    expect(makeGiftCardCode([{ giftCardCode: 'ABCDEF' }])).toHaveLength(6)
  })
  it('should not use codes that have already been used', () => {
    const giftCards = 'ABCDEFGHIJKLMNOPQRSTUVWXY'
      .split('')
      .map((letter) => ({ giftCardCode: letter }))
    expect(makeGiftCardCode(giftCards, 1)).toBe('Z')
  })
})
