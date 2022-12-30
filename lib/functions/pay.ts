import { getItemDisplayName } from 'lib/functions/displayInventory'
import { logSaleParked } from 'lib/functions/log'
import { ClerkObject, CustomerObject } from 'lib/types'
import { getCartItemPrices } from 'lib/functions/sell'
import { SaleItemObject, SaleObject, SaleTransactionObject } from 'lib/types/sale'
import { StockItemObject, StockObject } from 'lib/types/stock'
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

export function writeItemList(inventory: StockItemObject[], items: SaleItemObject[]) {
  if (items && inventory) {
    return items
      .filter((item: SaleItemObject) => !item?.isDeleted)
      .map((item: SaleItemObject) => {
        let stockItem = inventory?.find((i) => i?.id === item?.itemId)
        if (item?.isGiftCard) {
          return `Gift Card [${stockItem?.giftCardCode}]`
        } else {
          let cartQuantity = item?.quantity || 1
          let str = ''
          if (cartQuantity > 1) str = `${cartQuantity} x `
          str = str + getItemDisplayName(stockItem)
          if (item?.isRefunded) str = str + ' [REFUNDED]'
          return str
        }
      })
      .join(', ')
  } else return ''
}

export function roundToTenCents(dollars) {
  return Math.round((dollars + Number.EPSILON) * 10) / 10
}

export async function useLoadSaleToCart(
  cart: SaleObject,
  setCart: Function,
  sale: SaleObject,
  clerk: ClerkObject,
  registerID: number,
  customers: CustomerObject[],
) {
  if (sale?.dateSaleOpened && (cart?.items || cart?.id !== sale?.id)) {
    // Cart is loaded with a different sale or
    // Cart has been started but not loaded into sale
    await useSaveSaleAndPark(cart, clerk, registerID, customers)
  }
  setCart(sale)
}

export async function useSaveSaleAndPark(
  cart: SaleObject,
  clerk: ClerkObject,
  registerID: number,
  customers: CustomerObject[],
  sales: SaleObject[],
  mutateSales: Function,
  inventory: StockObject[],
  mutateInventory: Function,
  giftCards: GiftCardObject[],
  mutateGiftCards: Function,
) {
  const saleId = await useSaveSaleItemsTransactionsToDatabase(
    { ...cart, state: SaleStateTypes.Parked },
    clerk,
    registerID,
    sales,
    mutateSales,
    inventory,
    mutateInventory,
    giftCards,
    mutateGiftCards,
  )
  logSaleParked(saleId, cart, customers, clerk)
  mutateInventory && mutateInventory()
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
