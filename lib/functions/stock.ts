import { StockReceiveObject } from 'lib/types/stock'
import { getItemSku } from './displayInventory'
import { getLastValidElementByDate } from 'lib/utils'
import { getProfitMargin, getStoreCut } from './pay'

export function getLaybyHoldQuantity(item) {
  return (item?.quantityLayby + item?.quantityHold + item?.quantityUnlayby + item?.quantityUnhold) * -1 || 0
}

export function getReturnedQuantity(item) {
  return Math.abs(item?.quantityReturned || 0)
}

export function getSoldQuantity(item) {
  return Math.abs(item?.quantitySold || 0)
}

export function getReceivedQuantity(item) {
  return item?.quantityReceived || 0
}

export function getDiscardedLostQuantity(item) {
  return (item?.quantityDiscarded + item?.quantityLost + item?.quantityFound) * -1 || 0
}

export function getRefundedQuantity(item) {
  return Math.abs(item?.quantityUnsold) || 0
}

export function getAdjustmentQuantity(item) {
  return item?.quantityAdjustment || 0
}

export function getInStockQuantity(item) {
  return item?.quantity || 0
}

export function createBatchList(stockItems, stockMovements) {
  let batchList = []
  stockItems?.forEach((item) => {
    let receiveObject: StockReceiveObject = {}
    receiveObject.key = getItemSku({ id: item?.item?.id, vendorId: item?.item?.vendor_id })
    receiveObject.item = item?.item
    let stockMovement = stockMovements?.find((sm) => sm?.stockId === item?.id)
    let receivePrice = getLastValidElementByDate(item?.stockPrices, 'date_valid_from', stockMovement?.date_moved)
    let slicedPrice = { totalSell: receivePrice?.total_sell, vendorCut: receivePrice?.vendor_cut }
    let receivePriceObject = {
      totalSell: receivePrice?.total_sell,
      vendorCut: receivePrice?.vendor_cut,
      storeCut: getStoreCut(slicedPrice),
      margin: getProfitMargin(slicedPrice),
    }
    receiveObject.price = receivePriceObject
    receiveObject.quantity = stockMovement?.quantity
    batchList.push(receiveObject)
  })
  return batchList
}
