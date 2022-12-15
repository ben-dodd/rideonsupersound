import { getItemDisplayName } from 'features/inventory/features/display-inventory/lib/functions'
import { addRestockTask } from 'features/job/lib/functions'
import { logSaleNuked, logSaleParked } from 'features/log/lib/functions'
import {
  createSaleInDatabase,
  createSaleItemInDatabase,
  createSaleTransactionInDatabase,
  createStockItemInDatabase,
  createStockMovementInDatabase,
  createVendorPaymentInDatabase,
} from 'lib/database/create'
import {
  deleteSaleFromDatabase,
  deleteSaleItemFromDatabase,
  deleteSaleTransactionFromDatabase,
  deleteVendorPaymentFromDatabase,
} from 'lib/database/delete'
import {
  updateItemInDatabase,
  updateSaleInDatabase,
  updateSaleItemInDatabase,
  updateStockItemInDatabase,
} from 'lib/database/update'
import {
  ClerkObject,
  CustomerObject,
  GiftCardObject,
  LogObject,
  PaymentMethodTypes,
  RoleTypes,
  SaleItemObject,
  SaleObject,
  SaleStateTypes,
  SaleTransactionObject,
  StockMovementTypes,
  StockObject,
  VendorPaymentObject,
  VendorPaymentTypes,
  VendorSaleItemObject,
} from 'lib/types'
import dayjs from 'dayjs'
import {
  getCartItemPrice,
  getItemQuantity,
} from 'features/sale/features/sell/lib/functions'

export function sumPrices(saleItems: any[], items: any[], field: string) {
  if (!saleItems) return 0
  return saleItems
    ?.filter((s) => !s?.isRefunded)
    ?.reduce((acc, saleItem) => {
      // Dont bother getting inventory item if not needed
      let item: StockObject =
        saleItem?.totalSell && saleItem?.vendorCut && saleItem?.storeCut
          ? null
          : items?.find((i: StockObject) => i?.id === saleItem?.itemId)
      const prices = getCartItemPrice(saleItem, item)
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

export function getGrossProfit(item: StockObject) {
  let sellNum = item?.totalSell / 100 || 0,
    costNum = item?.vendorCut / 100 || 0
  if (sellNum > 0) return `$${(sellNum - costNum)?.toFixed(2)}`
  else return ''
}

export function getProfitMargin(item: StockObject) {
  let sellNum = item?.totalSell || 0,
    costNum = item?.vendorCut || 0
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
        let stockItem: StockObject = inventory?.filter(
          (i) => i?.id === item?.itemId
        )[0]
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

export async function useLoadSaleToCart(
  cart: SaleObject,
  setCart: Function,
  sale: SaleObject,
  clerk: ClerkObject,
  registerID: number,
  customers: CustomerObject[],
  logs: LogObject[],
  mutateLogs: Function,
  sales: SaleObject[],
  mutateSales: Function,
  inventory: StockObject[],
  mutateInventory: Function,
  giftCards: GiftCardObject[],
  mutateGiftCards: Function
) {
  if (cart?.dateSaleOpened && (cart?.items || cart?.id !== sale?.id)) {
    // Cart is loaded with a different sale or
    // Cart has been started but not loaded into sale
    await useSaveSaleAndPark(
      cart,
      clerk,
      registerID,
      customers,
      sales,
      mutateSales,
      inventory,
      mutateInventory,
      giftCards,
      mutateGiftCards
    )
  }
  setCart(sale)
}

export async function nukeSaleInDatabase(
  sale: SaleObject,
  clerk: ClerkObject,
  registerID: number
) {
  logSaleNuked(sale, clerk)
  sale?.items?.forEach((saleItem) => {
    deleteSaleItemFromDatabase(saleItem?.id)
    if (!saleItem?.isRefunded)
      createStockMovementInDatabase({
        item: saleItem,
        clerk,
        registerID,
        act: StockMovementTypes.Unsold,
        note: 'Sale nuked.',
        sale_id: sale?.id,
      })
  })
  sale?.transactions?.forEach((saleTransaction) => {
    if (saleTransaction?.vendorPayment)
      deleteVendorPaymentFromDatabase(saleTransaction?.vendorPayment)
    deleteSaleTransactionFromDatabase(saleTransaction?.id)
  })
  // deleteStockMovementsFromDatabase(sale?.id);
  deleteSaleFromDatabase(sale?.id)
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
