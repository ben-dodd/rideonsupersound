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
  stockMovements?.forEach((sm) => {
    let item = {}
  })
}
