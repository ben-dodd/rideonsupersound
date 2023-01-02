import dayjs from 'dayjs'
import { getItemDisplayName } from 'lib/functions/displayInventory'
import { getCartItemPrices } from 'lib/functions/sell'
import { PaymentMethodTypes, SaleItemObject, SaleTransactionObject } from 'lib/types/sale'
import { BasicStockObject, StockItemObject } from 'lib/types/stock'
import { VendorPaymentObject, VendorSaleItemObject } from 'lib/types/vendor'

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
      acc + (sale?.quantity * sale?.vendorCut * (100 - sale?.vendorDiscount || 0)) / 100,
    0,
  )
  return totalSell - totalPaid
}

export function getGrossProfit(price: any) {
  let sellNum = price?.totalSell / 100 || 0,
    costNum = price?.vendorCut / 100 || 0
  if (sellNum > 0) return `$${(sellNum - costNum)?.toFixed(2)}`
  else return ''
}

export function getProfitMargin(price: any) {
  let sellNum = price?.totalSell || 0,
    costNum = price?.vendorCut || 0
  if (sellNum > 0) return `${(((sellNum - costNum) / sellNum) * 100)?.toFixed(1)}%`
  else return ''
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
          return `Gift Card [${item?.giftCardCode}]`
        } else {
          let cartQuantity = cartItem?.quantity || 1
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

export function getCashVars(cashReceived, totalRemaining, isRefund) {
  return {
    netAmount: isRefund
      ? parseFloat(cashReceived) * -100
      : parseFloat(cashReceived) >= totalRemaining
      ? totalRemaining * 100
      : parseFloat(cashReceived) * 100,
    cashFromCustomer: isRefund ? null : parseFloat(cashReceived) * 100,
    cashToCustomer: isRefund
      ? parseFloat(cashReceived) * 100
      : parseFloat(cashReceived) > totalRemaining
      ? (parseFloat(cashReceived) - totalRemaining) * 100
      : null,
  }
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
  let transaction: SaleTransactionObject = {
    date: dayjs.utc().format(),
    saleId,
    clerkId,
    registerId,
    isRefund,
    paymentMethod,
  }
  if (paymentMethod === PaymentMethodTypes.Card)
    transaction.amount = isRefund ? parseFloat(enteredAmount) * -100 : parseFloat(enteredAmount) * 100
  else if (paymentMethod === PaymentMethodTypes.Cash) {
    const { netAmount, cashFromCustomer, cashToCustomer } = getCashVars(enteredAmount, totalRemaining, isRefund)
    transaction.amount = netAmount
    ;(transaction.cashReceived = cashFromCustomer), (transaction.changeGiven = cashToCustomer)
  } else if (paymentMethod === PaymentMethodTypes.GiftCard) {
    let giftCardUpdate: StockItemObject = {}
    const remainingOnGiftCard = giftCard?.giftCardRemaining / 100
    const leftOver: number = remainingOnGiftCard - parseFloat(enteredAmount)
    if (isRefund) {
      giftCardUpdate = {
        isGiftCard: true,
        giftCardCode: newGiftCardCode,
        giftCardAmount: parseFloat(enteredAmount) * 100,
        giftCardRemaining: parseFloat(enteredAmount) * 100,
        note: `Gift card created as refund payment for sale #${saleId}`,
        giftCardIsValid: true,
      }
    } else {
      giftCardUpdate = { ...giftCard }
      giftCardUpdate.giftCardRemaining = leftOver * 100
      if (leftOver < 10) {
        giftCardUpdate.giftCardIsValid = false
        giftCardUpdate.giftCardRemaining = 0
      }
    }
    transaction.amount = isRefund ? parseFloat(enteredAmount) * -100 : parseFloat(enteredAmount) * 100
    transaction.giftCardUpdate = giftCardUpdate
    if (!isRefund) {
      transaction = {
        ...transaction,
        giftCardId: giftCardUpdate?.id,
        giftCardTaken: giftCardUpdate?.giftCardIsValid,
        giftCardRemaining: giftCardUpdate?.giftCardRemaining,
        giftCardChange: leftOver < 10 ? leftOver * 100 : 0,
      }
    }
  } else if (paymentMethod === PaymentMethodTypes.Account) {
    transaction.amount = isRefund ? parseFloat(enteredAmount) * -100 : parseFloat(enteredAmount) * 100
    transaction.vendor = vendor
  }
  return transaction
}
