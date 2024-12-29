import { StockObject } from 'lib/types/stock'

export function getVendorQuantityInStock(inventory: StockObject[], vendorId: number) {
  return getVendorItemsInStock(inventory, vendorId)?.reduce((sum, item) => (item?.quantities?.inStock || 0) + sum, 0)
}

export function getVendorItemsInStock(inventory: StockObject[], vendorId: number) {
  return inventory?.filter((i: StockObject) => i?.item?.vendorId === vendorId)
}
