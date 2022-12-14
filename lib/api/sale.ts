import { saveSystemLog } from 'features/log/lib/functions'
import { request } from 'superagent'
import {
  ClerkObject,
  SaleItemObject,
  SaleObject,
  SaleStateTypes,
  StockMovementTypes,
  StockObject,
} from 'lib/types'
import useData from '.'
import { useClerk } from './clerk'
import { useSaleVars } from 'features/pay/lib/functions'
import axios from 'axios'
import { createMailOrderTask } from './jobs'

export async function useSaveSaleItemsTransactionsToDatabase(
  cart: SaleObject,
  registerID: number,
  prevState?: string,
  customer?: string
) {
  const { clerk } = await useClerk()
  let { totalStoreCut, totalItemPrice, numberOfItems, itemList } =
    await useSaleVars(cart)
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
    newSaleId = await createSale(newSale, clerk)
  } else {
    // Sale already has id, update
    updateSale(newSale?.id, newSale)
  }

  if (newSale?.isMailOrder && cart?.state === SaleStateTypes.Completed) {
    createMailOrderTask(newSale, customer)
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
      validateGiftCard(item?.itemId)
    }

    // Add or update Sale Item
    if (!item?.id) {
      // Item is new to sale
      let newSaleItem = { ...item, sale_id: newSaleId }
      createSaleItem(newSaleItem)
    } else {
      // Item was already in sale, update in case discount, quantity has changed or item has been deleted
      updateSaleItem(item?.id, item)
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

export function createSale(sale: SaleObject, clerk: ClerkObject) {
  return axios
    .post(`/api/sale`, {
      ...sale,
      saleOpenedBy: clerk?.id,
    })
    .then((res) => {
      const id = res.data
      saveSystemLog(`New sale (${id}) created.`, clerk?.id)
      return id
    })
    .catch((e) => Error(e.message))
}

export function updateSale(id, update) {
  return axios
    .patch(`/api/sale/${id}`, { update })
    .then((res) => res.data)
    .catch((e) => Error(e.message))
}

export function createSaleItem(saleItem: SaleItemObject) {
  return axios
    .post(`/api/sale/item`, saleItem)
    .then((res) => res.data)
    .catch((e) => Error(e.message))
}

export function updateSaleItem(id, update) {
  return axios
    .patch(`/api/sale/item/${id}`, { update })
    .then((res) => res.data)
    .catch((e) => Error(e.message))
}
