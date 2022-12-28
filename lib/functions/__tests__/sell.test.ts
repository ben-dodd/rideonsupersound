import {
  getCartItemStoreCut,
  getCartItemTotal,
  getCartItemVendorCut,
  getDiscountedPrice,
  makeGiftCardCode,
  writeCartItemPriceBreakdown,
} from '../sell'

const cartItem = {
  vendorCut: 100,
  vendorDiscount: '50',
  storeDiscount: '25',
  quantity: '2',
}

const cartItem3 = {
  vendorDiscount: '50',
  quantity: '1',
}

const cartItem4 = {
  storeDiscount: '25',
  quantity: '1',
}

const stockItem = { isMiscItem: false }

const stockItemPrice = { vendorCut: 100, totalSell: 300, storeCut: 200 }

const cartItem2 = {
  quantity: '2',
}

const stockItem2 = {}

const stockItemPrice2 = { totalSell: 5500, vendorCut: 4300, storeCut: 1200 }

const miscItem = {
  isMiscItem: true,
  miscItemAmount: 400,
  miscItemDescription: 'Beer',
}

const giftCardItem = {
  isGiftCard: true,
  giftCardAmount: 3000,
  giftCardCode: 'ABCDEF',
}

const stockItemPrice3 = {}

describe('writeCartItemPriceBreakdown', () => {
  test.todo(
    'should write out a price breakdown based on a cart item and an item'
  )
  it('should handle gift cards', () => {
    expect(
      writeCartItemPriceBreakdown(cartItem, giftCardItem, stockItemPrice3)
    ).toBe('$30.00 GIFT CARD')
  })
  it('should handle misc items', () => {
    expect(
      writeCartItemPriceBreakdown(cartItem, miscItem, stockItemPrice3)
    ).toBe('2 × $4.00')
  })
  it('should handle normal items', () => {
    expect(
      writeCartItemPriceBreakdown(cartItem2, stockItem2, stockItemPrice2)
    ).toBe('2 × $55.00')
  })
  it('should handle discounts', () => {
    expect(
      writeCartItemPriceBreakdown(cartItem, stockItem, stockItemPrice)
    ).toBe('2 × V50% × S25% × $3.00')
    expect(
      writeCartItemPriceBreakdown(cartItem3, stockItem, stockItemPrice)
    ).toBe('1 × V50% × $3.00')
    expect(
      writeCartItemPriceBreakdown(cartItem4, stockItem, stockItemPrice)
    ).toBe('1 × S25% × $3.00')
  })
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

describe('getCartItemVendorCut', () => {
  it('should return the vendor cut given a cart item and a price item', () => {
    expect(getCartItemVendorCut(cartItem, stockItemPrice)).toEqual(100)
    expect(getCartItemVendorCut(cartItem2, stockItemPrice2)).toEqual(8600)
  })
})

describe('getCartItemStoreCut', () => {
  it('should return the store cut given a cart item and a stock item', () => {
    expect(getCartItemStoreCut(cartItem, stockItemPrice)).toEqual(300)
    expect(getCartItemStoreCut(cartItem2, stockItemPrice2)).toEqual(2400)
  })
})

describe('getCartItemTotal', () => {
  it('should return the total price for an item after discounts have been applied', () => {
    expect(getCartItemTotal(cartItem, stockItem, stockItemPrice)).toEqual(400)
    expect(getCartItemTotal(cartItem2, stockItem2, stockItemPrice2)).toEqual(
      11000
    )
  })
  it('should return the gift card amount, where the item is a gift card', () => {
    expect(getCartItemTotal(cartItem, giftCardItem, stockItemPrice3)).toEqual(
      3000
    )
  })
  it('should return the misc item amount where the item is misc', () => {
    expect(getCartItemTotal(cartItem, miscItem, stockItemPrice3)).toEqual(400)
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
