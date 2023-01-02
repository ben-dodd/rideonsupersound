import { getCashVars, getGiftCardLeftOver, getGiftCardUpdate, roundToTenCents } from '../pay'

describe('roundToTenCents', () => {
  it('should round to ten cents', () => {
    expect(roundToTenCents(5.15)).toBe(5.2)
    expect(roundToTenCents(0)).toBe(0)
    expect(roundToTenCents(5.14)).toBe(5.1)
    expect(roundToTenCents(5.2)).toBe(5.2)
    expect(roundToTenCents(0.12)).toBe(0.1)
    expect(roundToTenCents(0.04)).toBe(0)
  })
})

describe('getGiftCardLeftOver', () => {
  const giftCard = { giftCardRemaining: 1000 }
  it('should return the amount left on the giftcard after payment', () => {
    expect(getGiftCardLeftOver(giftCard, 800)).toBe(200)
  })
  it('should return zero if the payment is more than the gift card', () => {
    expect(getGiftCardLeftOver(giftCard, 1200)).toBe(0)
  })
})

describe('getGiftCardUpdate', () => {
  const giftCard = {
    id: 100,
    isGiftCard: true,
    giftCardCode: 'HOOPS',
    giftCardAmount: 5000,
    giftCardRemaining: 5000,
    giftCardIsValid: true,
  }
  it('should handle gift card payment where there is still leftover', () => {
    const giftCardUpdate = getGiftCardUpdate(2000, giftCard)
    expect(giftCardUpdate.giftCardRemaining).toBe(3000)
    expect(giftCardUpdate.giftCardIsValid).toBeTruthy()
  })
  it('should invalidate the card if there is less than $10 on it after payment', () => {
    const giftCardUpdate = getGiftCardUpdate(4001, giftCard)
    expect(giftCardUpdate.giftCardRemaining).toBe(0)
    expect(giftCardUpdate.giftCardIsValid).toBeFalsy()
  })
  it('should handle gift cards created as a refund', () => {
    const giftCardUpdate = getGiftCardUpdate(2500, null, 'HELLO', 4, true)
    expect(giftCardUpdate.isGiftCard).toBeTruthy()
    expect(giftCardUpdate.giftCardCode).toBe('HELLO')
    expect(giftCardUpdate.giftCardAmount).toBe(2500)
    expect(giftCardUpdate.giftCardRemaining).toBe(2500)
    expect(giftCardUpdate.note).toBe('Gift card created as refund payment for sale #4')
    expect(giftCardUpdate.giftCardIsValid).toBeTruthy()
  })
})

describe('getCashVars', () => {
  it('should handle cases where customer gives correct cash', () => {
    expect(getCashVars(2000, 20, false)).toStrictEqual({
      netAmount: 2000,
      cashFromCustomer: 2000,
      cashToCustomer: null,
    })
  })
  it('should handle cases where customer is given change', () => {
    expect(getCashVars(2000, 15, undefined)).toStrictEqual({
      netAmount: 1500,
      cashFromCustomer: 2000,
      cashToCustomer: 500,
    })
  })
  it('should handle cases where customer is refunded cash', () => {
    expect(getCashVars(2000, -50, true)).toStrictEqual({
      netAmount: -2000,
      cashFromCustomer: null,
      cashToCustomer: 2000,
    })
  })
})
