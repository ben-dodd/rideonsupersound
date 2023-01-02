import { PaymentMethodTypes } from 'lib/types/sale'
import { formSaleTransaction, getCashVars, getGiftCardLeftOver, getGiftCardUpdate, roundToTenCents } from '../pay'

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

describe('formSaleTransaction', () => {
  let params: any = {
    saleId: 10,
    clerkId: 11,
    registerId: 12,
  }
  it('should apply basic properties', () => {
    const trans = formSaleTransaction({ ...params, paymentMethod: PaymentMethodTypes.Card, enteredAmount: '25' })
    expect(trans.date).toBeDefined()
    expect(trans.saleId).toBe(10)
    expect(trans.clerkId).toBe(11)
    expect(trans.registerId).toBe(12)
  })
  it('should handle card payments', () => {
    const trans = formSaleTransaction({ ...params, paymentMethod: PaymentMethodTypes.Card, enteredAmount: '25' })
    expect(trans.amount).toBe(2500)
    expect(trans.isRefund).toBeFalsy()
  })
  it('should handle card refunds', () => {
    const trans = formSaleTransaction({
      ...params,
      paymentMethod: PaymentMethodTypes.Card,
      enteredAmount: '25',
      isRefund: true,
    })
    expect(trans.amount).toBe(-2500)
    expect(trans.isRefund).toBeTruthy()
  })
  it('should handle cash payments', () => {
    const trans = formSaleTransaction({
      ...params,
      paymentMethod: PaymentMethodTypes.Cash,
      enteredAmount: '20',
      totalRemaining: 15,
    })
    expect(trans.amount).toBe(1500)
    expect(trans.cashReceived).toBe(2000)
    expect(trans.changeGiven).toBe(500)
    expect(trans.isRefund).toBeFalsy()
  })
  it('should handle cash refunds', () => {
    const trans = formSaleTransaction({
      ...params,
      paymentMethod: PaymentMethodTypes.Cash,
      enteredAmount: '15',
      totalRemaining: 15,
      isRefund: true,
    })
    expect(trans.amount).toBe(-1500)
    expect(trans.cashReceived).toBe(null)
    expect(trans.changeGiven).toBe(1500)
    expect(trans.isRefund).toBeTruthy()
  })
  const giftCard = {
    id: 100,
    isGiftCard: true,
    giftCardCode: 'HOOPS',
    giftCardAmount: 5000,
    giftCardRemaining: 4000,
    giftCardIsValid: true,
  }
  it('should handle gift card payments where gift card is not used up', () => {
    const trans = formSaleTransaction({
      ...params,
      paymentMethod: PaymentMethodTypes.GiftCard,
      enteredAmount: '15',
      giftCard,
    })
    const giftCardUpdate = trans?.giftCardUpdate
    expect(trans.amount).toBe(1500)
    expect(trans.giftCardId).toBe(100)
    expect(trans.giftCardTaken).toBeFalsy()
    expect(trans.giftCardRemaining).toBe(2500)
    expect(trans.giftCardChange).toBe(0)
    expect(giftCardUpdate.giftCardCode).toBe('HOOPS')
    expect(giftCardUpdate.giftCardAmount).toBe(5000)
    expect(giftCardUpdate.giftCardRemaining).toBe(2500)
  })
  it('should handle gift card payments where gift card has less than $10 remaining', () => {
    const trans = formSaleTransaction({
      ...params,
      paymentMethod: PaymentMethodTypes.GiftCard,
      enteredAmount: '30.50',
      giftCard,
    })
    const giftCardUpdate = trans?.giftCardUpdate
    expect(trans.amount).toBe(3050)
    expect(trans.giftCardId).toBe(100)
    expect(trans.giftCardTaken).toBeTruthy()
    expect(trans.giftCardRemaining).toBe(0)
    expect(trans.giftCardChange).toBe(950)
    expect(giftCardUpdate.giftCardCode).toBe('HOOPS')
    expect(giftCardUpdate.giftCardAmount).toBe(5000)
    expect(giftCardUpdate.giftCardRemaining).toBe(0)
    expect(giftCardUpdate.giftCardIsValid).toBeFalsy()
  })
  it('should handle gift card payments where gift card is all used up', () => {
    const trans = formSaleTransaction({
      ...params,
      paymentMethod: PaymentMethodTypes.GiftCard,
      enteredAmount: '40.00',
      giftCard,
    })
    const giftCardUpdate = trans?.giftCardUpdate
    expect(trans.amount).toBe(4000)
    expect(trans.giftCardId).toBe(100)
    expect(trans.giftCardTaken).toBeTruthy()
    expect(trans.giftCardRemaining).toBe(0)
    expect(trans.giftCardChange).toBe(0)
    expect(giftCardUpdate.giftCardCode).toBe('HOOPS')
    expect(giftCardUpdate.giftCardAmount).toBe(5000)
    expect(giftCardUpdate.giftCardRemaining).toBe(0)
  })
  it('should handle gift card refunds', () => {
    const trans = formSaleTransaction({
      ...params,
      paymentMethod: PaymentMethodTypes.GiftCard,
      enteredAmount: '40.00',
      isRefund: true,
      newGiftCardCode: 'PARTY',
    })
    expect(trans.amount).toBe(-4000)
    expect(trans.giftCardUpdate?.giftCardCode).toBe('PARTY')
    expect(trans.giftCardUpdate?.giftCardAmount).toBe(4000)
  })
  it('should handle account payments', () => {
    const trans = formSaleTransaction({
      ...params,
      paymentMethod: PaymentMethodTypes.Account,
      enteredAmount: '30.50',
      vendor: 666,
    })
    expect(trans.amount).toBe(3050)
    expect(trans.vendor).toBe(666)
  })
  it('should handle account refunds', () => {
    const trans = formSaleTransaction({
      ...params,
      paymentMethod: PaymentMethodTypes.Account,
      enteredAmount: '30.50',
      vendor: 666,
      isRefund: true,
    })
    expect(trans.amount).toBe(-3050)
    expect(trans.vendor).toBe(666)
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
