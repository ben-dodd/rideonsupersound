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

export function getSaleVars(sale: any, inventory: StockObject[]) {
  // Sale - sale item
  // Inventory - used to look up item prices if not in sale, used for new sales
  const totalPostage = parseFloat(`${sale?.postage}`) || 0 // Postage: currently in dollars
  const totalStoreCut = sumPrices(sale?.items, inventory, 'storePrice') / 100 // Total Amount of Sale goes to Store in dollars
  // console.log(totalStoreCut);
  const totalPriceUnrounded =
    sumPrices(
      sale?.items?.filter((s) => !s?.isRefunded),
      inventory,
      'totalPrice'
    ) / 100 // Total Amount of Sale in dollars
  const totalVendorCut = totalPriceUnrounded - totalStoreCut // Total Vendor Cut in dollars
  const totalItemPrice =
    Math.round((totalPriceUnrounded + Number.EPSILON) * 10) / 10 // Total Amount rounded to 10c to avoid unpayable sales
  const totalPrice = totalItemPrice + totalPostage // TotalPrice + postage
  const totalPaid =
    Math.round((getTotalPaid(sale?.transactions) / 100 + Number.EPSILON) * 10) /
    10 // Total Paid to nearest 10c
  const totalRemaining =
    Math.round((totalPrice - totalPaid + Number.EPSILON) * 10) / 10 // Amount remaining to pay
  return {
    totalItemPrice,
    totalPrice,
    totalPostage,
    totalPaid,
    totalStoreCut,
    totalVendorCut,
    totalRemaining,
    numberOfItems: sale?.items
      ?.filter((item) => !item.isRefunded && !item?.isDeleted)
      ?.reduce((acc, item) => acc + parseInt(item?.quantity), 0), // Total number of items in sale
    itemList: writeItemList(inventory, sale?.items), // List of items written in full
  }
}

export function sumPrices(
  saleItems: any[],
  inventory: StockObject[],
  field: string
) {
  if (!saleItems) return 0
  return saleItems
    ?.filter((s) => !s?.isRefunded)
    ?.reduce((acc, saleItem) => {
      // Dont bother getting inventory item if not needed
      let item: StockObject =
        saleItem?.totalSell && saleItem?.vendorCut && saleItem?.storeCut
          ? null
          : inventory?.filter(
              (i: StockObject) => i?.id === saleItem?.itemId
            )?.[0]
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

export async function loadSaleToCart(
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
    await saveSaleAndPark(
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

export async function saveSaleAndPark(
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
  const saleId = await saveSaleItemsTransactionsToDatabase(
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

export async function saveSaleItemsTransactionsToDatabase(
  cart: SaleObject,
  clerk: ClerkObject,
  registerID: number,
  sales: SaleObject[],
  mutateSales: Function,
  inventory: StockObject[],
  mutateInventory: Function,
  giftCards: GiftCardObject[],
  mutateGiftCards: Function,
  prevState?: string,
  customer?: string
) {
  let { totalStoreCut, totalItemPrice, numberOfItems, itemList } = getSaleVars(
    cart,
    inventory
  )
  let newSale = {
    ...cart,
    storeCut: totalStoreCut * 100,
    total_price: totalItemPrice * 100,
    number_of_items: numberOfItems,
    item_list: itemList,
  }
  let newSaleId = newSale?.id
  //
  // HANDLE SALE OBJECT
  //
  if (!newSaleId) {
    // Sale is new, save to database and add id to sales
    newSale.state = newSale?.state || SaleStateTypes.InProgress
    newSaleId = await createSaleInDatabase(newSale, clerk)
    newSale = { ...newSale, id: newSaleId }
    mutateSales([...sales, newSale], false)
  } else {
    // Sale already has id, update
    updateSaleInDatabase(newSale)
    mutateSales(
      sales?.map((s) => (s?.id === newSaleId ? newSale : s)),
      false
    )
  }

  if (newSale?.isMailOrder && cart?.state === SaleStateTypes.Completed) {
    addNewMailOrderTask(newSale, customer)
  }

  //
  // HANDLE ITEMS
  //
  for (const item of cart?.items) {
    let invItem = inventory?.filter(
      (i: StockObject) => i?.id === item?.itemId
    )?.[0]
    // Check whether inventory item needs restocking
    const quantity = getItemQuantity(invItem, cart?.items)
    let quantityLayby = invItem?.quantityLayby || 0
    // let quantity_sold = invItem?.quantity_sold || 0;
    if (quantity > 0) {
      invItem.needsRestock = true
      addRestockTask(invItem?.id)
    }

    // If sale is complete, validate gift card
    if (cart?.state === SaleStateTypes.Completed && item?.isGiftCard) {
      // Add to collection
      invItem.giftCardIsValid = true
      mutateGiftCards(
        giftCards?.map((gc) => (gc?.id === invItem?.id ? invItem : gc)),
        false
      )
      validateGiftCard(item?.itemId)
    }

    // Add or update Sale Item
    if (!item?.id) {
      // Item is new to sale
      let newSaleItem = { ...item, sale_id: newSaleId }
      createSaleItemInDatabase(newSaleItem)
    } else {
      // Item was already in sale, update in case discount, quantity has changed or item has been deleted
      updateSaleItemInDatabase(item)
    }

    // Add stock movement if it's a regular stock item
    if (!item?.isGiftCard && !item?.isMiscItem) {
      let act = StockMovementTypes.Sold
      if (cart?.state === SaleStateTypes.Completed) {
        // If it was a layby, unlayby it before marking as sold
        let act = ''
        if (prevState === SaleStateTypes.Layby && !item?.isGiftCard) {
          act = StockMovementTypes.Unlayby
          quantityLayby -= 1
        }
        if (item?.isRefunded) {
          // Refund item if refunded
          act = StockMovementTypes.Unsold
        }
        // Add layby stock movement if it's a new layby
      } else if (
        cart?.state === SaleStateTypes.Layby &&
        prevState !== SaleStateTypes.Layby
      ) {
        act = StockMovementTypes.Layby
        quantityLayby += 1
      }
      createStockMovementInDatabase({
        item,
        clerk,
        registerID,
        act,
        sale_id: newSaleId,
      })
    }

    // Update inventory item if it's a regular stock item
    mutateInventory &&
      mutateInventory(
        inventory?.map((i) =>
          i?.id === invItem?.id ? { ...invItem, quantity, quantityLayby } : i
        ),
        false
      )
  }

  //
  // HANDLE TRANSACTIONS
  //
  for await (const trans of cart?.transactions) {
    if (!trans?.id) {
      // Transaction is new to sale
      let newSaleTransaction = { ...trans, sale_id: newSaleId }
      saveSaleTransaction(newSaleTransaction, clerk, giftCards, mutateGiftCards)
    }
  }
  // // TODO does this need a return
  // return { ...newSale, items: cartItems, transactions: cartTransactions };
  return newSaleId
}

export async function saveSaleTransaction(
  transaction: SaleTransactionObject,
  clerk: ClerkObject,
  giftCards: GiftCardObject[],
  mutateGiftCards: Function
) {
  if (transaction?.paymentMethod === PaymentMethodTypes.Account) {
    // Add account payment as a store payment to the vendor
    let vendorPaymentId = null
    const vendorPayment = {
      amount: transaction?.amount,
      clerkId: transaction?.clerkId,
      vendorId: transaction?.vendor?.id,
      type: transaction?.isRefund
        ? VendorPaymentTypes.SaleRefund
        : VendorPaymentTypes.Sale,
      date: dayjs.utc().format(),
      registerId: transaction?.registerId,
    }
    vendorPaymentId = await createVendorPaymentInDatabase(vendorPayment)
    transaction = { ...transaction, vendorPayment: vendorPaymentId }
  }
  let giftCardId = null
  if (transaction?.paymentMethod === PaymentMethodTypes.GiftCard) {
    if (transaction?.isRefund) {
      // Gift card is new, create new one
      giftCardId = await createStockItemInDatabase(
        transaction?.giftCardUpdate,
        clerk
      )
    } else {
      // Update gift card
      updateStockItemInDatabase(transaction?.giftCardUpdate)
    }
    const otherGiftCards = giftCards?.filter(
      (g: GiftCardObject) => g?.id !== transaction?.giftCardUpdate?.id
    )
    mutateGiftCards([...otherGiftCards, transaction?.giftCardUpdate], false)
  }
  if (giftCardId) transaction = { ...transaction, giftCardId }
  createSaleTransactionInDatabase(transaction)
}

export async function addNewMailOrderTask(sale: SaleObject, customer: string) {
  try {
    const res = await fetch(
      `/api/create-task?k=${process.env.NEXT_PUBLIC_SWR_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: `Post Sale ${sale?.id} (${sale?.itemList}) to ${
            `${customer}\n` || ''
          }${sale?.postalAddress}`,
          created_by_clerkId: sale?.saleOpenedBy,
          assigned_to: RoleTypes?.MC,
          date_created: dayjs.utc().format(),
          is_post_mail_order: 1,
        }),
      }
    )
    const json = await res.json()
    if (!res.ok) throw Error(json.message)
  } catch (e) {
    throw Error(e.message)
  }
}

export function validateGiftCard(id: number) {
  updateItemInDatabase({ giftCardIsValid: 1, id }, 'stock')
}
