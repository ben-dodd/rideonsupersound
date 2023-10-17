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
  console.log('creating batch list', stockItems, stockMovements)
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

export function getPriceEdits(
  priceObj: any,
  editFieldName: string,
  newValue: string,
  lockedField: string = 'vendorCut',
) {
  const newPrice = {
    storeCut: priceObj?.storeCut || getStoreCut(priceObj),
    vendorCut: priceObj?.vendorCut || '0',
    totalSell: priceObj?.totalSell || '0',
    margin: priceObj?.margin || getProfitMargin(priceObj)?.toFixed(1),
  }
  if (isNaN(Number(newPrice?.margin))) newPrice.margin = '30.0'
  const numValue = parseFloat(newValue)
  const numVendorCut = parseFloat(priceObj?.vendorCut)
  const numTotalSell = parseFloat(priceObj?.totalSell)
  const numStoreCut = parseFloat(priceObj?.storeCut)
  let numMargin = parseFloat(priceObj?.margin || getProfitMargin(priceObj))
  if (isNaN(numMargin)) numMargin = 30
  newPrice[editFieldName] = newValue
  switch (editFieldName) {
    case 'totalSell':
      switch (lockedField) {
        case 'totalSell':
        case 'vendorCut':
          newPrice.storeCut = (numValue - numVendorCut)?.toFixed(2)
          newPrice.margin = getProfitMargin({ totalSell: numValue, vendorCut: numVendorCut })?.toFixed(1)
          break
        case 'storeCut':
          var newVendorCut = numValue - numStoreCut
          newPrice.vendorCut = newVendorCut?.toFixed(2)
          newPrice.margin = getProfitMargin({ totalSell: numValue, vendorCut: newVendorCut })?.toFixed(1)
          break
        case 'margin':
          var newVendorCut = Math.round(numValue * (1 - numMargin / 100))
          newPrice.storeCut = (numValue - newVendorCut)?.toFixed(2)
          newPrice.vendorCut = newVendorCut?.toFixed(2)
          break
      }
      break
    case 'vendorCut':
      switch (lockedField) {
        case 'totalSell':
        case 'vendorCut':
          newPrice.storeCut = (numTotalSell - numValue)?.toFixed(2)
          newPrice.margin = getProfitMargin({ totalSell: numTotalSell, vendorCut: numValue })?.toFixed(1)
          break
        case 'storeCut':
          var newTotalSell = numValue + numStoreCut
          newPrice.totalSell = newTotalSell?.toFixed(2)
          newPrice.margin = getProfitMargin({ totalSell: newTotalSell, vendorCut: numValue })?.toFixed(1)
          break
        case 'margin':
          var newTotalSell = Math.round(numValue / (1 - numMargin / 100))
          newPrice.storeCut = (newTotalSell - numValue)?.toFixed(2)
          newPrice.totalSell = newTotalSell?.toFixed(2)
          break
      }
      break
    case 'margin':
      switch (lockedField) {
        case 'totalSell':
          var newVendorCut = Math.round(numTotalSell * (1 - numValue / 100))
          newPrice.vendorCut = newVendorCut?.toFixed(2)
          newPrice.storeCut = (numTotalSell - newVendorCut)?.toFixed(2)
          break
        case 'margin':
        case 'vendorCut':
          var newTotalSell = Math.round(numVendorCut / (1 - numValue / 100))
          newPrice.totalSell = newTotalSell?.toFixed(2)
          newPrice.storeCut = (newTotalSell - numVendorCut)?.toFixed(2)
          break
        case 'storeCut':
          var newTotalSell = Math.round(numVendorCut / (1 - numValue / 100))
          newPrice.totalSell = newTotalSell?.toFixed(2)
          newPrice.vendorCut = (newTotalSell - numStoreCut)?.toFixed(2)
          break
      }
      break
    case 'storeCut':
      switch (lockedField) {
        case 'totalSell':
          var newVendorCut = numTotalSell - numValue
          newPrice.vendorCut = newVendorCut?.toFixed(2)
          newPrice.margin = getProfitMargin({ totalSell: numTotalSell, vendorCut: newVendorCut })?.toFixed(1)
          break
        case 'margin':
          var newTotalSell = Math.round((100 * numValue) / numMargin)
          newPrice.totalSell = newTotalSell?.toFixed(2)
          newPrice.vendorCut = (newTotalSell - numValue)?.toFixed(2)
          break
        case 'storeCut':
        case 'vendorCut':
          var newTotalSell = numVendorCut + numValue
          newPrice.totalSell = newTotalSell?.toFixed(2)
          newPrice.margin = getProfitMargin({ totalSell: newTotalSell, vendorCut: numVendorCut })?.toFixed(1)
          break
      }
      break
    default:
      // Handle unknown textboxId here
      break
  }
  Object.keys(newPrice)?.forEach((key) => {
    if (isNaN(newPrice[key])) newPrice[key] = ''
  })
  return newPrice
}
