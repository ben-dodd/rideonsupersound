import { getItemDisplayName } from 'features/inventory/features/display-inventory/lib/functions'
import { logSaleParked } from 'features/log/lib/functions'
import {
  ClerkObject,
  CustomerObject,
  GiftCardObject,
  SaleItemObject,
  SaleObject,
  SaleStateTypes,
  SaleTransactionObject,
  StockObject,
  VendorPaymentObject,
  VendorSaleItemObject,
} from 'lib/types'
import { getCartItemPrices } from 'features/sale/features/sell/lib/functions'

export function sumPrices(saleItems: any[], items: any[], field: string) {
  if (saleItems?.length === 0 || items?.length === 0) return 0
  return saleItems?.reduce((acc, saleItem) => {
    const stockItem: any = items?.find?.(
      (stockItem: any) => stockItem?.item?.id === saleItem?.itemId
    )
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

export function getTotalOwing(
  totalPayments: VendorPaymentObject[],
  totalSales: VendorSaleItemObject[]
) {
  const totalPaid = totalPayments?.reduce(
    (acc: number, payment: VendorPaymentObject) => acc + payment?.amount,
    0
  )

  const totalSell: any = totalSales?.reduce(
    (acc: number, sale: VendorSaleItemObject) =>
      acc +
      (sale?.quantity * sale?.vendorCut * (100 - sale?.vendorDiscount || 0)) /
        100,
    0
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
  if (sellNum > 0)
    return `${(((sellNum - costNum) / sellNum) * 100)?.toFixed(1)}%`
  else return ''
}

export function writeItemList(
  inventory: StockObject[],
  items: SaleItemObject[]
) {
  if (items && inventory) {
    return items
      .filter((item: SaleItemObject) => !item?.isDeleted)
      .map((item: SaleItemObject) => {
        let stockItem: StockObject = inventory?.find(
          (i) => i?.id === item?.itemId
        )
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
  customers: CustomerObject[]
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
  mutateGiftCards: Function
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
    mutateGiftCards
  )
  logSaleParked(saleId, cart, customers, clerk)
  mutateInventory && mutateInventory()
}
