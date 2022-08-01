import dayjs from 'dayjs'
import {
  ClerkObject,
  CustomerObject,
  GiftCardObject,
  HoldObject,
  LogObject,
  PaymentMethodTypes,
  RegisterObject,
  RoleTypes,
  SaleObject,
  SaleStateTypes,
  SaleTransactionObject,
  StockMovementTypes,
  StockObject,
  StocktakeItemObject,
  StocktakeObject,
  StocktakeReviewDecisions,
  StocktakeStatuses,
  StocktakeTemplateObject,
  TaskObject,
  TillObject,
  VendorPaymentTypes,
} from './types'
// Change to DayJS utc

import {
  getItemDisplayName,
  getItemQuantity,
  getItemSkuDisplayNameById,
  getSaleVars,
} from './data-functions'
import {
  createLogInDatabase,
  createPettyCashInDatabase,
  createRegisterInDatabase,
  createSaleInDatabase,
  createSaleItemInDatabase,
  createSaleTransactionInDatabase,
  createStockItemInDatabase,
  createStockMovementInDatabase,
  createStockPriceInDatabase,
  createTaskInDatabase,
  createTillInDatabase,
  createVendorPaymentInDatabase,
} from './database/create'
import {
  deleteSaleFromDatabase,
  deleteSaleItemFromDatabase,
  deleteSaleTransactionFromDatabase,
  deleteVendorPaymentFromDatabase,
} from './database/delete'
import {
  updateHoldInDatabase,
  updateSaleInDatabase,
  updateSaleItemInDatabase,
  updateStockItemInDatabase,
  updateStocktakeInDatabase,
  updateStocktakeTemplateInDatabase,
} from './database/update'

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

export async function saveClosedRegisterToDatabase(
  register_id: number,
  register: RegisterObject,
  till: TillObject,
  logs: LogObject[],
  mutateLogs: Function
) {
  try {
    const tillID = await createTillInDatabase(till)
    const res = await fetch(
      `/api/update-register?k=${process.env.NEXT_PUBLIC_SWR_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...register,
          id: register_id,
          close_till_id: tillID,
          close_date: dayjs.utc().format(),
        }),
      }
    )
    const json = await res.json()
    if (!res.ok) throw Error(json.message)
    saveLog(
      {
        log: `Register closed.`,
        table_id: 'register',
        row_id: json?.insertId,
        clerk_id: register?.closed_by_id,
      },
      logs,
      mutateLogs
    )
    setRegister(json?.insertId)
  } catch (e) {
    throw Error(e.message)
  }
}

export async function saveAndOpenRegister(
  register: RegisterObject,
  till: TillObject,
  clerk: ClerkObject,
  logs: LogObject[],
  mutateLogs: Function
) {
  const tillID = await createTillInDatabase(till)
  const registerId = await createRegisterInDatabase({
    ...register,
    open_till_id: tillID,
    open_date: dayjs.utc().format(),
  })
  saveLog(
    {
      log: `Register opened.`,
      table_id: 'register',
      row_id: registerId,
      clerk_id: clerk?.id,
    },
    logs,
    mutateLogs
  )
  setRegister(registerId)
  return [{ num: registerId }]
}

export async function savePettyCashToRegister(
  registerID: number,
  clerkID: number,
  isTake: boolean,
  amount: string,
  note: string,
  logs: LogObject[],
  mutateLogs: Function
) {
  const pettyCash = {
    register_id: registerID,
    clerk_id: clerkID,
    amount: parseFloat(amount) * 100,
    is_take: isTake,
    note,
    date: dayjs.utc().format(),
  }
  const insertId = await createPettyCashInDatabase(pettyCash)
  saveLog(
    {
      log: `$${parseFloat(amount)?.toFixed(2)} ${
        isTake ? 'taken from till.' : 'put in till.'
      }`,
      table_id: 'register_petty_cash',
      row_id: insertId,
      clerk_id: clerkID,
    },
    logs,
    mutateLogs
  )
}

export async function returnHoldToStock(
  hold: HoldObject,
  clerk: ClerkObject,
  holds: HoldObject[],
  mutateHolds: Function,
  mutateInventory: Function,
  registerID: number
) {
  updateHoldInDatabase({
    ...hold,
    date_removed_from_hold: dayjs.utc().format(),
    removed_from_hold_by: clerk?.id,
  })
  mutateHolds(
    holds?.filter((h) => h?.id !== hold?.id),
    false
  )
  createStockMovementInDatabase(
    { item_id: hold?.item_id, quantity: hold?.quantity?.toString() },
    clerk,
    registerID,
    StockMovementTypes.Unhold,
    hold?.note
  )
  mutateInventory()
}

export async function saveSystemLog(log: string, clerkID: number) {
  let logObj = {
    date_created: dayjs.utc().format(),
    log: log,
    clerk_id: clerkID,
    table_id: 'system',
  }
  try {
    const res = await fetch(
      `/api/create-log?k=${process.env.NEXT_PUBLIC_SWR_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logObj),
      }
    )
    const json = await res.json()
    if (!res.ok) throw Error(json.message)
  } catch (e) {
    throw Error(e.message)
  }
}

export async function saveLog(
  log: LogObject,
  logs?: LogObject[],
  mutateLogs?: Function
) {
  let logObj = {
    date_created: dayjs.utc().format(),
    log: log?.log,
    table_id: log?.table_id || null,
    row_id: log?.row_id || null,
    clerk_id: log?.clerk_id || null,
  }
  const insertId = await createLogInDatabase(logObj)
  if (logs) mutateLogs?.([...logs, { ...logObj, id: insertId }], false)
}

export async function addRestockTask(id: number) {
  try {
    const res = await fetch(
      `/api/restock-task?k=${process.env.NEXT_PUBLIC_SWR_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, needs_restock: true }),
      }
    )
    const json = await res.json()
    if (!res.ok) throw Error(json.message)
  } catch (e) {
    throw Error(e.message)
  }
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

export async function completeTask(task: TaskObject) {
  try {
    const res = await fetch(
      `/api/complete-task?k=${process.env.NEXT_PUBLIC_SWR_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      }
    )
    const json = await res.json()
    if (!res.ok) throw Error(json.message)
  } catch (e) {
    throw Error(e.message)
  }
}

export async function completeRestockTask(id: number) {
  try {
    const res = await fetch(
      `/api/restock-task?k=${process.env.NEXT_PUBLIC_SWR_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, needs_restock: false }),
      }
    )
    const json = await res.json()
    if (!res.ok) throw Error(json.message)
  } catch (e) {
    throw Error(e.message)
  }
}

export async function setRegister(register_id: number) {
  try {
    const res = await fetch(
      `/api/set-register?k=${process.env.NEXT_PUBLIC_SWR_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          register_id: register_id,
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

export async function receiveStock(
  basket: any,
  clerk: ClerkObject,
  registerID: number
) {
  const receivedStock = []
  await Promise.all(
    basket?.items?.map(async (receiveItem: any) => {
      if (receiveItem?.item?.id) {
        createStockMovementInDatabase(
          {
            item_id: receiveItem?.item?.id,
            quantity: receiveItem?.quantity,
          },
          clerk,
          registerID,
          StockMovementTypes?.Received,
          'Existing stock received.'
        )
        receivedStock.push({
          item: receiveItem?.item,
          quantity: receiveItem?.quantity,
        })
      } else {
        const newStockID = await createStockItemInDatabase(
          { ...receiveItem?.item, vendor_id: basket?.vendor_id },
          clerk
        )
        createStockPriceInDatabase(
          newStockID,
          clerk,
          parseFloat(receiveItem?.total_sell) * 100,
          parseFloat(receiveItem?.vendor_cut) * 100,
          'New stock priced.'
        )
        createStockMovementInDatabase(
          {
            item_id: newStockID,
            quantity: receiveItem?.quantity,
          },
          clerk,
          registerID,
          StockMovementTypes?.Received,
          'New stock received.'
        )
        receivedStock.push({
          item: {
            ...receiveItem?.item,
            vendor_id: basket?.vendor_id,
            total_sell: parseFloat(receiveItem?.total_sell) * 100,
            id: newStockID,
          },
          quantity: receiveItem?.quantity,
        })
      }
    })
  )
  return receivedStock
}

export function returnStock(
  vendorId: number,
  returnItems: any,
  notes: string,
  clerk: ClerkObject,
  registerID: number,
  inventory: StockObject[],
  mutateInventory: Function,
  logs: LogObject[],
  mutateLogs: Function
) {
  if (vendorId && returnItems?.length > 0) {
    const itemIds = returnItems?.map((returnItem) => parseInt(returnItem?.id))
    const otherInventoryItems = inventory?.filter(
      (i: StockObject) => !itemIds?.includes(i?.id)
    )
    let updatedInventoryItems = []
    returnItems
      .filter((returnItem: any) => parseInt(`${returnItem?.quantity}`) > 0)
      .forEach((returnItem: any) => {
        const stockItem = inventory?.filter(
          (i: StockObject) => i?.id === parseInt(returnItem?.id)
        )[0]
        updatedInventoryItems.push({
          ...stockItem,
          quantity_returned:
            (stockItem?.quantity_returned || 0) +
            parseInt(returnItem?.quantity),
          quantity: (stockItem?.quantity || 0) - parseInt(returnItem?.quantity),
        })
        createStockMovementInDatabase(
          {
            item_id: parseInt(returnItem?.id),
            quantity: `${returnItem?.quantity}`,
          },
          clerk,
          registerID,
          StockMovementTypes?.Returned,
          notes || 'Stock returned to vendor.'
        )
        saveLog(
          {
            log: `${getItemDisplayName(stockItem)} (x${
              returnItem?.quantity
            }) returned to vendor.`,
            clerk_id: clerk?.id,
            table_id: 'stock_movement',
            row_id: null,
          },
          logs,
          mutateLogs
        )
      })
    mutateInventory([...otherInventoryItems, ...updatedInventoryItems], false)
  }
}

export function processStocktake(
  stocktake: StocktakeObject,
  stocktakeTemplate: StocktakeTemplateObject,
  stocktakeItems: StocktakeItemObject[],
  inventory: StockObject[],
  clerk: ClerkObject
) {
  let tasks = []
  stocktakeItems?.forEach(async (item: StocktakeItemObject) => {
    if (item?.quantity_counted === item?.quantity_recorded) {
      // Do nothing
    } else if (item?.review_decision === StocktakeReviewDecisions?.keep) {
      saveLog({
        log: `Stock take: ${getItemSkuDisplayNameById(
          item?.stock_id,
          inventory
        )}. ${item?.quantity_counted} counted, ${
          item?.quantity_recorded
        } in the system. System quantity kept.`,
        clerk_id: clerk?.id,
      })
    } else if (
      item?.review_decision === StocktakeReviewDecisions?.review ||
      !item?.review_decision
    ) {
      let newTask: TaskObject = {
        description: `Review stock take. ${getItemSkuDisplayNameById(
          item?.stock_id,
          inventory
        )}. ${item?.quantity_counted} counted, ${
          item?.quantity_recorded
        } in the system.`,
        created_by_clerk_id: clerk?.id,
        date_created: dayjs.utc().format(),
      }
      const id = await createTaskInDatabase(newTask)
      tasks?.push({ ...newTask, id })
    } else {
      let act = StockMovementTypes?.Adjustment
      if (item?.review_decision === StocktakeReviewDecisions?.discard)
        act = StockMovementTypes?.Discarded
      else if (item?.review_decision === StocktakeReviewDecisions?.found)
        act = StockMovementTypes?.Found
      else if (item?.review_decision === StocktakeReviewDecisions?.lost)
        act = StockMovementTypes?.Lost
      else if (item?.review_decision === StocktakeReviewDecisions?.return)
        act = StockMovementTypes?.Returned
      createStockMovementInDatabase(
        { item_id: item?.stock_id, quantity: `${item?.quantity_difference}` },
        clerk,
        null,
        act,
        'Stock take adjustment.',
        null,
        stocktake?.id
      )
      saveLog({
        log: `Stock take: ${getItemSkuDisplayNameById(
          item?.stock_id,
          inventory
        )}. ${item?.quantity_counted} counted, ${
          item?.quantity_recorded
        } in the system. Difference marked as ${act}.`,
        clerk_id: clerk?.id,
      })
    }
  })
  updateStocktakeInDatabase({
    ...stocktake,
    date_closed: dayjs.utc().format(),
    closed_by: clerk?.id,
  })
  updateStocktakeTemplateInDatabase({
    ...stocktakeTemplate,
    last_completed: dayjs.utc().format(),
    status: StocktakeStatuses?.completed,
  })
}

export function uploadFiles(files) {
  // const body = new FormData();
  // body.append("file", files);
  try {
    fetch(`/api/upload-file?k=${process.env.NEXT_PUBLIC_SWR_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: files,
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
  } catch (e) {
    throw Error(e.message)
  }
}
