import dayjs, { extend } from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { getItemDisplayName } from 'lib/functions/displayInventory'
import { getCartItemPrices } from 'lib/functions/sell'
import { PaymentMethodTypes, SaleItemObject, SaleTransactionObject } from 'lib/types/sale'
import { BasicStockObject, StockItemObject } from 'lib/types/stock'
import { VendorPaymentObject, VendorSaleItemObject } from 'lib/types/vendor'
import { dollarsToCents, priceDollarsString } from 'lib/utils'

export function sumPrices(saleItems: any[], items: any[], field: string) {
  if (saleItems?.length === 0 || items?.length === 0) return 0
  return saleItems?.reduce((acc, saleItem) => {
    const stockItem: any = items?.find?.((stockItem: any) => stockItem?.item?.id === saleItem?.itemId)
    const { item = {}, price = {} } = stockItem || {}
    const prices = getCartItemPrices(saleItem, item, price)
    return (acc += prices?.[field])
  }, 0)
}

export function getTotalPaid(saleTransactions: SaleTransactionObject[]) {
  if (!saleTransactions) return 0
  return saleTransactions
    ?.filter((transaction) => !transaction.isDeleted)
    ?.reduce((acc, transaction) => acc + transaction?.amount, 0)
}

export function getTotalOwing(totalPayments: VendorPaymentObject[], totalSales: VendorSaleItemObject[]) {
  const totalPaid = totalPayments?.reduce((acc: number, payment: VendorPaymentObject) => acc + payment?.amount, 0)

  const totalSell: any = totalSales?.reduce(
    (acc: number, sale: VendorSaleItemObject) =>
      acc + (sale?.quantity * sale?.itemVendorCut * (100 - sale?.vendorDiscount || 0)) / 100,
    0,
  )
  return totalSell - totalPaid
}

export function getGrossProfit(price: any) {
  let sellNum = price?.totalSell / 100 || 0,
    costNum = price?.vendorCut / 100 || 0
  if (sellNum > 0) return priceDollarsString(sellNum - costNum)
}

export function getProfitMargin(price: any) {
  let sellNum = price?.totalSell || 0,
    costNum = price?.vendorCut || 0
  if (sellNum > 0) return ((sellNum - costNum) / sellNum) * 100
  else return 0
}

export function getProfitMarginString(price: any) {
  return `${getProfitMargin(price)?.toFixed(1)}%`
}

export function getStoreCut(price: any) {
  let sellNum = price?.totalSell || 0,
    costNum = price?.vendorCut || 0
  return sellNum - costNum
}

export function writeItemList(stockList: BasicStockObject[], cartItems: SaleItemObject[]) {
  if (cartItems && stockList) {
    return cartItems
      .filter((cartItem: SaleItemObject) => !cartItem?.isDeleted)
      .map((cartItem: SaleItemObject) => {
        let stockObject = stockList?.find((obj) => obj?.item?.id === cartItem?.itemId)
        const { item = {} } = stockObject || {}
        if (item?.isGiftCard) {
          return `Gift Voucher [${item?.giftCardCode}]`
        } else {
          let cartQuantity = Number(cartItem?.quantity || 1)
          let str = ''
          if (cartQuantity > 1) str = `${cartQuantity} x `
          str = str + getItemDisplayName(item)
          if (cartItem?.isRefunded) str = str + ' [REFUNDED]'
          return str
        }
      })
      .join(', ')
  } else return ''
}

export function roundToTenCents(dollars) {
  return Math.round((dollars + Number.EPSILON) * 10) / 10
}

export function formSaleTransaction({
  enteredAmount = '0',
  paymentMethod,
  isRefund = false,
  registerId,
  saleId,
  clerkId,
  totalRemaining = 0,
  giftCard = null,
  newGiftCardCode = '',
  vendor = null,
}) {
  extend(utc)
  let transaction: SaleTransactionObject = {
    date: dayjs().utc().format(),
    saleId,
    clerkId,
    registerId,
    isRefund,
    paymentMethod,
  }
  let amountInCents = dollarsToCents(enteredAmount)
  if (paymentMethod === PaymentMethodTypes.Card) transaction.amount = isRefund ? amountInCents * -1 : amountInCents
  else if (paymentMethod === PaymentMethodTypes.Cash) {
    const { netAmount, cashFromCustomer, cashToCustomer } = getCashVars(amountInCents, totalRemaining, isRefund)
    transaction.amount = netAmount
    transaction.cashReceived = cashFromCustomer
    transaction.changeGiven = cashToCustomer
  } else if (paymentMethod === PaymentMethodTypes.GiftCard) {
    let giftCardUpdate: StockItemObject = getGiftCardUpdate(amountInCents, giftCard, newGiftCardCode, saleId, isRefund)
    transaction.amount = isRefund ? amountInCents * -1 : amountInCents
    transaction.giftCardUpdate = giftCardUpdate
    if (!isRefund) {
      const leftOver = getGiftCardLeftOver(giftCard, amountInCents)
      transaction = {
        ...transaction,
        giftCardId: giftCardUpdate?.id,
        giftCardTaken: !giftCardUpdate?.giftCardIsValid,
        giftCardRemaining: giftCardUpdate?.giftCardRemaining,
        changeGiven: leftOver < 1000 ? leftOver : 0,
      }
    }
  } else if (paymentMethod === PaymentMethodTypes.Account) {
    transaction.amount = isRefund ? amountInCents * -1 : amountInCents
    transaction.vendor = vendor
  }
  return transaction
}

export function getGiftCardLeftOver(giftCard, amountInCents) {
  const leftOver: number = giftCard?.giftCardRemaining - amountInCents
  return leftOver < 0 ? 0 : leftOver
}

export function getGiftCardUpdate(amountInCents, giftCard?, newGiftCardCode?, saleId?, isRefund?) {
  let giftCardUpdate: StockItemObject = {}
  const leftOver = getGiftCardLeftOver(giftCard, amountInCents)
  if (isRefund) {
    giftCardUpdate = {
      isGiftCard: true,
      giftCardCode: newGiftCardCode,
      giftCardAmount: amountInCents,
      giftCardRemaining: amountInCents,
      note: `Gift card created as refund payment for sale #${saleId}`,
      giftCardIsValid: true,
    }
  } else {
    giftCardUpdate = { ...giftCard }
    giftCardUpdate.giftCardRemaining = leftOver
    if (leftOver < 1000) {
      giftCardUpdate.giftCardIsValid = false
      giftCardUpdate.giftCardRemaining = 0
    }
  }
  return giftCardUpdate
}

export function getCashVars(centsReceived, totalRemaining, isRefund) {
  const centsRemaining = dollarsToCents(totalRemaining)
  return {
    netAmount: isRefund ? centsReceived * -1 : centsReceived >= centsRemaining ? centsRemaining : centsReceived,
    cashFromCustomer: isRefund ? null : centsReceived,
    cashToCustomer: isRefund ? centsReceived : centsReceived > centsRemaining ? centsReceived - centsRemaining : null,
  }
}

export function areAnyDiscountsInvalid(cartItems) {
  return (
    cartItems.filter((cartItem) => {
      return (
        !cartItem?.isDeleted &&
        !cartItem?.isRefunded &&
        (!isDiscountValid(cartItem?.storeDiscount) || !isDiscountValid(cartItem?.vendorDiscount))
      )
    })?.length > 0
  )
}

export function isDiscountValid(discount) {
  return !discount || (Number(discount) >= 0 && Number(discount) <= 100)
}
