import {
  SaleTransactionObject,
  StockObject,
  VendorPaymentObject,
  VendorSaleItemObject,
} from 'lib/types'

export function getSaleVars(sale: any, inventory: StockObject[]) {
  // Sale - sale item
  // Inventory - used to look up item prices if not in sale, used for new sales
  const totalPostage = parseFloat(`${sale?.postage}`) || 0 // Postage: currently in dollars
  const totalStoreCut = sumPrices(sale?.items, inventory, 'storePrice') / 100 // Total Amount of Sale goes to Store in dollars
  // console.log(totalStoreCut);
  const totalPriceUnrounded =
    sumPrices(
      sale?.items?.filter((s) => !s?.is_refunded),
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
      ?.filter((item) => !item.is_refunded && !item?.is_deleted)
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
    ?.filter((s) => !s?.is_refunded)
    ?.reduce((acc, saleItem) => {
      // Dont bother getting inventory item if not needed
      let item: StockObject =
        saleItem?.total_sell && saleItem?.vendor_cut && saleItem?.store_cut
          ? null
          : inventory?.filter(
              (i: StockObject) => i?.id === saleItem?.item_id
            )?.[0]
      const prices = getCartItemPrice(saleItem, item)
      return (acc += prices?.[field])
    }, 0)
}

export function getTotalPaid(saleTransactions: SaleTransactionObject[]) {
  if (!saleTransactions) return 0
  return saleTransactions
    ?.filter((transaction) => !transaction.is_deleted)
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
      (sale?.quantity * sale?.vendor_cut * (100 - sale?.vendor_discount || 0)) /
        100,
    0
  )
  return totalSell - totalPaid
}

export function getGrossProfit(item: StockObject) {
  let sellNum = item?.total_sell / 100 || 0,
    costNum = item?.vendor_cut / 100 || 0
  if (sellNum > 0) return `$${(sellNum - costNum)?.toFixed(2)}`
  else return ''
}

export function getProfitMargin(item: StockObject) {
  let sellNum = item?.total_sell || 0,
    costNum = item?.vendor_cut || 0
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
      .filter((item: SaleItemObject) => !item?.is_deleted)
      .map((item: SaleItemObject) => {
        let stockItem: StockObject = inventory?.filter(
          (i) => i?.id === item?.item_id
        )[0]
        if (item?.is_gift_card) {
          return `Gift Card [${stockItem?.gift_card_code}]`
        } else {
          let cartQuantity = item?.quantity || 1
          let str = ''
          if (cartQuantity > 1) str = `${cartQuantity} x `
          str = str + getItemDisplayName(stockItem)
          if (item?.is_refunded) str = str + ' [REFUNDED]'
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
  if (cart?.date_sale_opened && (cart?.items || cart?.id !== sale?.id)) {
    // Cart is loaded with a different sale or
    // Cart has been started but not loaded into sale
    await saveSaleAndPark(
      cart,
      clerk,
      registerID,
      customers,
      logs,
      mutateLogs,
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
  registerID: number,
  logs: LogObject[],
  mutateLogs: Function
) {
  saveLog(
    {
      log: `Sale #${sale?.id} nuked.`,
      clerk_id: clerk?.id,
      table_id: 'sale',
      row_id: sale?.id,
    },
    logs,
    mutateLogs
  )
  sale?.items?.forEach((saleItem) => {
    deleteSaleItemFromDatabase(saleItem?.id)
    if (!saleItem?.is_refunded)
      createStockMovementInDatabase(
        saleItem,
        clerk,
        registerID,
        StockMovementTypes.Unsold,
        'Sale nuked.',
        sale?.id
      )
  })
  sale?.transactions?.forEach((saleTransaction) => {
    if (saleTransaction?.vendor_payment_id)
      deleteVendorPaymentFromDatabase(saleTransaction?.vendor_payment_id)
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
  logs: LogObject[],
  mutateLogs: Function,
  sales: SaleObject[],
  mutateSales: Function,
  inventory: StockObject[],
  mutateInventory: Function,
  giftCards: GiftCardObject[],
  mutateGiftCards: Function
) {
  const id = await saveSaleItemsTransactionsToDatabase(
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
  saveLog(
    {
      log: `Sale #${id} parked (${cart?.items?.length} item${
        cart?.items?.length === 1 ? '' : 's'
      }${
        cart?.customer_id
          ? ` for ${
              customers?.filter(
                (c: CustomerObject) => c?.id === cart?.customer_id
              )[0]?.name
            }.`
          : ''
      }).`,
      clerk_id: clerk?.id,
      table_id: 'sale',
      row_id: id,
    },
    logs,
    mutateLogs
  )
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
    store_cut: totalStoreCut * 100,
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

  if (newSale?.is_mail_order && cart?.state === SaleStateTypes.Completed) {
    addNewMailOrderTask(newSale, customer)
  }

  //
  // HANDLE ITEMS
  //
  for (const item of cart?.items) {
    let invItem = inventory?.filter(
      (i: StockObject) => i?.id === item?.item_id
    )?.[0]
    // Check whether inventory item needs restocking
    const quantity = getItemQuantity(invItem, cart?.items)
    let quantity_layby = invItem?.quantity_layby || 0
    // let quantity_sold = invItem?.quantity_sold || 0;
    if (quantity > 0) {
      invItem.needs_restock = true
      addRestockTask(invItem?.id)
    }

    // If sale is complete, validate gift card
    if (cart?.state === SaleStateTypes.Completed && item?.is_gift_card) {
      // Add to collection
      invItem.gift_card_is_valid = true
      mutateGiftCards(
        giftCards?.map((gc) => (gc?.id === invItem?.id ? invItem : gc)),
        false
      )
      validateGiftCard(item?.item_id)
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
    if (!item?.is_gift_card && !item?.is_misc_item) {
      if (cart?.state === SaleStateTypes.Completed) {
        // If it was a layby, unlayby it before marking as sold
        if (prevState === SaleStateTypes.Layby && !item?.is_gift_card) {
          createStockMovementInDatabase(
            item,
            clerk,
            registerID,
            StockMovementTypes.Unlayby,
            null,
            newSaleId
          )
          quantity_layby -= 1
        }
        if (item?.is_refunded) {
          // Refund item if refunded
          createStockMovementInDatabase(
            item,
            clerk,
            registerID,
            StockMovementTypes.Unsold,
            null,
            newSaleId
          )
        } else {
          // Mark stock as sold
          createStockMovementInDatabase(
            item,
            clerk,
            registerID,
            StockMovementTypes.Sold,
            null,
            newSaleId
          )
        }

        // Add layby stock movement if it's a new layby
      } else if (
        cart?.state === SaleStateTypes.Layby &&
        prevState !== SaleStateTypes.Layby
      ) {
        createStockMovementInDatabase(
          item,
          clerk,
          registerID,
          StockMovementTypes.Layby,
          null,
          newSaleId
        )
        quantity_layby += 1
      }

      // Update inventory item if it's a regular stock item
      mutateInventory &&
        mutateInventory(
          inventory?.map((i) =>
            i?.id === invItem?.id ? { ...invItem, quantity, quantity_layby } : i
          ),
          false
        )
    }
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
  if (transaction?.payment_method === PaymentMethodTypes.Account) {
    // Add account payment as a store payment to the vendor
    let vendorPaymentId = null
    const vendorPayment = {
      amount: transaction?.amount,
      clerk_id: transaction?.clerk_id,
      vendor_id: transaction?.vendor?.id,
      type: transaction?.is_refund
        ? VendorPaymentTypes.SaleRefund
        : VendorPaymentTypes.Sale,
      date: dayjs.utc().format(),
      register_id: transaction?.register_id,
    }
    vendorPaymentId = await createVendorPaymentInDatabase(vendorPayment)
    transaction = { ...transaction, vendor_payment_id: vendorPaymentId }
  }
  let giftCardId = null
  if (transaction?.payment_method === PaymentMethodTypes.GiftCard) {
    if (transaction?.is_refund) {
      // Gift card is new, create new one
      giftCardId = await createStockItemInDatabase(
        transaction?.gift_card_update,
        clerk
      )
    } else {
      // Update gift card
      updateStockItemInDatabase(transaction?.gift_card_update)
    }
    const otherGiftCards = giftCards?.filter(
      (g: GiftCardObject) => g?.id !== transaction?.gift_card_update?.id
    )
    mutateGiftCards([...otherGiftCards, transaction?.gift_card_update], false)
  }
  if (giftCardId) transaction = { ...transaction, gift_card_id: giftCardId }
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
          description: `Post Sale ${sale?.id} (${sale?.item_list}) to ${
            `${customer}\n` || ''
          }${sale?.postal_address}`,
          created_by_clerk_id: sale?.sale_opened_by,
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

export async function validateGiftCard(id: number) {
  try {
    const res = await fetch(
      `/api/validate-gift-card?k=${process.env.NEXT_PUBLIC_SWR_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      }
    )
    const json = await res.json()
    if (!res.ok) throw Error(json.message)
  } catch (e) {
    throw Error(e.message)
  }
}
