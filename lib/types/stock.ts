import { VendorObject } from './vendor'

/* eslint-disable unused-imports/no-unused-vars */
export enum StockMovementTypes {
  Received = 'received', // received from vendor
  Returned = 'returned', // returned to vendor
  Lost = 'lost', // unknown/lost
  Found = 'found', // unknown/found, back into stock
  Discarded = 'discarded', // damaged/ruined/thrown out
  Layby = 'layby', // held on layby
  Unlayby = 'unlayby', // removed from layby back into stock
  Hold = 'hold', // held for customer
  Unhold = 'unhold', // removed from hold back into stock
  Sold = 'sold', // sold to customer
  Unsold = 'unsold', // customer returned, back into stock
  Adjustment = 'adjustment', // stock level adjustment from stocktake
}

export enum StocktakeStatuses {
  inProgress = 'In Progress',
  completed = 'Completed',
  overdue = 'Overdue',
}

export enum StocktakeReviewDecisions {
  review = "Review Later, Don't Adjust",
  adjust = 'Adjust Quantity',
  keep = 'Keep Recorded Quantity',
  lost = 'Mark Difference Lost',
  discard = 'Mark Difference Discarded',
  return = 'Mark Difference Returned to Vendor',
  found = 'Mark Difference Found',
}

// Base stock item used for all
export interface StockItemBaseObject {
  id?: number
  vendorId?: number
  artist?: string
  title?: string
  displayAs?: string
  isDeleted?: boolean
}

// Adds properties that are useful for searching through entire list
// This is returned by useStockList
export interface StockItemSearchObject extends StockItemBaseObject {
  media?: string
  section?: string
  format?: string
  genre?: string[] | string
  isNew?: boolean
  cond?: string
  tags?: string[]
  quantity?: number
  vendorName?: string
  needsRestock?: boolean
}

// Adds properties for displaying rich list item of object
export interface BasicStockItemObject extends StockItemBaseObject {
  media?: string
  section?: string
  format?: string
  isNew?: boolean
  cond?: string
  country?: string
  imageUrl?: string
  needsRestock?: boolean
  isGiftCard?: boolean
  giftCardCode?: string
  giftCardAmount?: number
  isMiscItem?: boolean
  miscItemDescription?: string
  miscItemAmount?: number
}

// Add all other properties in stock table in database
export interface StockItemObject extends BasicStockItemObject {
  country?: string
  releaseYear?: string
  barcode?: string
  publisher?: string
  colour?: string
  size?: string
  description?: string
  note?: string
  imageId?: string // do we need all these images?
  thumbUrl?: string
  googleBooksItemId?: number // delete?
  discogsItemId?: number // delete?
  doReorder?: boolean // Reorder from vendor when stock runs out
  doListOnWebsite?: boolean
  hasNoQuantity?: boolean
  dateCreated?: string
  dateLastStocktake?: string
  dateModified?: string
  googleBooksItem?: any
  discogsItem?: any
  giftCardRemaining?: number
  giftCardIsValid?: boolean
}

// export const stockItemObjectFields = {
//   artist: string,
//   title: string,
//   displayAs: string,
//   media: string,
//   section: string,
//   format: string,
//   isNew: boolean,
//   cond: string,
//   imageUrl: string,
//   country: { type: string },
//   releaseYear: {string},
//   barcode: {string},
//   publisher: {string},
//   colour: {string},
//   size: {string},
//   description: {string},
//   note: {string},
//   imageId: {string},
//   thumbUrl: {string},
//   doReorder: {boolean}, // Reorder from vendor when stock runs out
//   doListOnWebsite: {boolean},
//   hasNoQuantity: {boolean}
// }

export interface BasicStockPriceObject {
  totalSell?: number
  vendorCut?: number
  storeCut?: number
}

export interface BasicStockQuantitiesObject {
  inStock?: number
  layby?: number
  hold?: number
  received?: number
  sold?: number
}

export interface StockQuantitiesObject extends BasicStockQuantitiesObject {
  returned?: number
  laybyHold?: number
  discarded?: number
  lost?: number
  discardedLost?: number
  refunded?: number
  adjustment?: number
  receiving?: number
}

export interface BasicStockObject {
  item?: BasicStockItemObject
  quantities?: BasicStockQuantitiesObject
  price?: BasicStockPriceObject
  vendorName?: string
}

export interface StockObject extends BasicStockObject {
  item?: StockItemObject
  quantities?: StockQuantitiesObject
  sales?: any[]
  stockMovements?: StockMovementObject[]
  stockPrices?: StockPriceObject[]
}

export interface StockPriceObject {
  id?: number
  stockId?: number
  clerkId?: number
  vendorCut?: number
  totalSell?: number
  dateValidFrom?: string
  note?: string
}

export interface GiftCardObject extends BasicStockItemObject {
  isGiftCard?: boolean
  giftCardCode?: string
  giftCardAmount?: number
  giftCardRemaining?: number
  giftCardIsValid?: boolean
}

export interface MiscItemObject extends BasicStockItemObject {
  isMiscItem?: boolean
  miscItemDescription?: string
  miscItemAmount?: number
}

export interface StockMovementObject {
  id?: number
  stockId?: number
  clerkId?: number
  clerkName?: string
  quantity?: number
  saleId?: number
  registerId?: number
  stocktakeId?: number
  act?: string
  note?: string
  dateMoved?: string
  itemDisplayName?: string
}

export interface StocktakeObject {
  id?: number
  stocktakeTemplateId?: number
  dateStarted?: string
  startedBy?: number
  dateClosed?: string
  closedBy?: number
  dateCancelled?: string
  cancelledBy?: number
  totalCounted?: number
  totalUniqueCounted?: number
  totalEstimated?: number
  totalUniqueEstimated?: number
  isDeleted?: boolean
}

export interface StocktakeItemObject {
  id?: string
  stockId?: number
  stocktakeId?: number
  quantityCounted?: number
  quantityRecorded?: number
  quantityDifference?: number
  reviewDecision?: string
  dateCounted?: string
  countedBy?: number
  doCheckDetails?: boolean
  isDeleted?: boolean
}

export interface StocktakeTemplateObject {
  id?: number
  name?: string
  filterDescription?: string
  image?: number
  vendorEnabled?: boolean
  vendorList?: [any] | any
  sectionEnabled?: boolean
  sectionList?: [string] | any
  mediaEnabled?: boolean
  mediaList?: [string] | any
  formatEnabled?: boolean
  formatList?: [string] | any
  lastCompleted?: string
  status?: string
  isDeleted?: boolean
  totalEstimated?: number
  totalUniqueEstimated?: number
}

export interface BatchReceiveObject {
  batchList?: any[] | StockReceiveObject[]
  id?: number
  vendorId?: number
  vendorName?: string
  vendor?: VendorObject
  itemCount?: number
  itemList?: string
  registerId?: number
  startedByClerkId?: number
  startedByClerkName?: string
  dateStarted?: string
  completedByClerkId?: number
  completedByClerkName?: string
  dateCompleted?: string
  doListOnWebsite?: boolean
  doReorder?: boolean
  note?: string
  media?: string
  format?: string
  isNew?: boolean
  cond?: string
  genre?: string[]
  section?: string
  country?: string
  totalSell?: string
  vendorCut?: string
  defaultMargin?: string
}

export interface StockReceiveObject {
  key?: string
  item?: StockItemObject
  price?: StockPriceObject
  quantity?: number
}
