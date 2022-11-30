export enum SaleStateTypes {
  InProgress = 'in progress', // sale in cart
  Layby = 'layby', // sale held on layby
  Parked = 'parked', // sale parked
  Completed = 'completed', // sale completed
}

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

export enum PaymentMethodTypes {
  Cash = 'cash', // paid with cash
  Card = 'card', // paid with card, eftpos or credit
  Account = 'acct', // paid with vendor store credit
  GiftCard = 'gift', // paid with gift card
}

export enum VendorPaymentTypes {
  Sale = 'sale', // vendor bought something with account
  SaleRefund = 'sale refund', // vendor refunded something onto their account
  Cash = 'cash', // vendor was given cash in store
  DC = 'direct credit', // vendor paid with internet banking
  Batch = 'batch', // vendor paid with batch kiwibank payment
  TransferTo = 'transfer to', // vendor has been paid with a store credit transfer
  TransferFrom = 'transfer from', // vendor has transferred their store credit to another
}

export enum ButtonTypes {
  Ok = 'ok',
  Cancel = 'cancel',
}

export enum RoleTypes {
  CO = 'Communication Officer',
  RC = 'Record Chief',
  PMC = 'Printed Matter Captain',
  VLG = 'Vendor Liaison General',
  MC = 'Mailorder Czar',
  CL = 'Cash Lord',
  PM = 'Pay Master',
  DW = 'Data Wrangler',
  RS = 'Retail Samurai',
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

export interface ClerkObject {
  id: number
  name?: string
  colour?: number
  password?: string
  fullName?: string
  email?: string
  phone?: string
  imageId?: number
  note?: string
  isAdmin?: number
  isCurrent?: number
  dateCreated?: string
  dateModified?: string
  isDeleted?: number
}
export interface CustomerObject {
  id?: number
  name?: string
  email?: string
  phone?: string
  postalAddress?: string
  note?: string
  createdByClerkId?: number
  isDeleted?: boolean
}

export interface ConfirmModal {
  open: boolean
  onClose?: Function
  title?: string
  message?: string
  styledMessage?: any
  action?: Function
  altAction?: Function
  yesText?: string
  altText?: string
  noText?: string
}

export interface SaleObject {
  id?: number
  customerId?: number
  customer?: CustomerObject
  state?: SaleStateTypes
  dateSaleOpened?: any
  saleOpenedBy?: number
  dateSaleClosed?: any
  saleClosedBy?: number
  dateLaybyStarted?: any
  laybyStartedBy?: number
  storeCut?: number
  totalPrice?: number
  numberOfItems?: number
  itemList?: string
  isMailOrder?: boolean
  postage?: number
  postalAddress?: string
  cashNote?: string
  note?: string
  weather?: any
  geoLatitude?: number
  geoLongitude?: number
  isDeleted?: boolean
  items?: SaleItemObject[]
  transactions?: SaleTransactionObject[]
}

export interface SaleItemObject {
  id?: number
  saleId?: number
  itemId?: number
  quantity?: string
  vendorDiscount?: string
  storeDiscount?: string
  isGiftCard?: boolean
  isMiscItem?: boolean
  note?: string
  isRefunded?: boolean
  refundNote?: string
  dateRefunded?: string
  isDeleted?: boolean
  totalSell?: number
  vendorCut?: number
  storeCut?: number
}

export interface SaleTransactionObject {
  id?: number
  saleId: number
  clerkId: number
  date?: string
  paymentMethod: PaymentMethodTypes
  amount: number
  cashReceived?: number
  changeGiven?: number
  vendorPayment?: number
  giftCardId?: number
  giftCardRemaining?: number
  giftCardTaken?: boolean
  giftCardChange?: number
  registerId?: number
  isRefund?: boolean
  isDeleted?: boolean
  vendor?: VendorObject
  giftCardUpdate?: GiftCardObject
}

export interface HoldObject {
  id?: number
  customerId?: number
  itemId?: number
  quantity?: number
  vendorDiscount?: number
  storeDiscount?: number
  holdPeriod?: number
  dateFrom?: string
  startedBy?: number
  dateRemovedFromHold?: string
  removedFromHoldBy?: number
  isSold?: boolean
  note?: string
  dateCreated?: string
  dateModified?: string
  isDeleted?: boolean
  overdue?: boolean
}

export interface VendorSaleItemObject {
  id?: number
  saleId?: number
  itemId?: number
  quantity?: number
  vendorDiscount?: number
  storeDiscount?: number
  vendorCut?: number
  totalSell?: number
  datePriceValidFrom?: string
  dateSaleOpened?: string
  dateSaleClosed?: string
  isRefunded?: boolean
}

export interface VendorPaymentObject {
  id?: number
  amount?: number
  bankAccountNumber?: string
  bankReference?: string
  batchNumber?: string
  date?: string
  sequenceNumber?: string
  clerkId?: number
  vendorId?: number
  registerId?: number
  type?: string
  note?: string
  isDeleted?: boolean
}

export interface VendorObject {
  id?: number
  name?: string
  vendorCategory?: string
  clerkId?: number
  bankAccountNumber?: string
  contactName?: string
  email?: string
  phone?: string
  postalAddress?: string
  uid?: string
  note?: string
  lastContacted?: string
  storeCreditOnly?: boolean
  emailVendor?: boolean
  dateCreated?: string
  dateModified?: string
  isDeleted?: boolean
  totalSell?: number
  totalPaid?: number
  totalOwing?: number
  totalItemsInStock?: number
  lastPaid?: string
  lastSold?: string
}

export interface StockObject {
  id?: number
  sku?: string
  vendorId?: number
  vendorName?: string
  artist?: string
  title?: string
  displayAs?: string
  media?: string
  format?: string
  section?: string
  genre?: string[] | string
  isNew?: number
  cond?: string
  country?: string
  releaseYear?: string
  barcode?: string
  publisher?: string
  colour?: string
  size?: string
  description?: string
  note?: string
  imageId?: string
  imageUrl?: string
  thumbUrl?: string
  googleBooksItemId?: number
  discogsItemId?: number
  doListOnWebsite?: number
  hasNoQuantity?: number
  dateCreated?: string
  dateLastStocktake?: string
  dateModified?: string
  isDeleted?: number
  vendorCut?: number
  totalSell?: number
  quantity?: number
  quantityReceived?: number
  quantityReturned?: number
  quantityLost?: number
  quantityFound?: number
  quantityDiscarded?: number
  quantityLayby?: number
  quantityUnlayby?: number
  quantityHold?: number
  quantityUnhold?: number
  quantitySold?: number
  quantityUnsold?: number
  quantityAdjustment?: number
  tags?: string[]
  isGiftCard?: boolean
  giftCardCode?: string
  giftCardAmount?: number
  giftCardRemaining?: number
  giftCardIsValid?: boolean
  isMiscItem?: boolean
  miscItemDescription?: string
  miscItemAmount?: number
  googleBooksItem?: any
  discogsItem?: any
  needsRestock?: boolean
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

export interface GiftCardObject {
  id?: number
  isGiftCard?: boolean
  giftCardCode?: string
  giftCardAmount?: number
  giftCardRemaining?: number
  note?: string
  giftCardIsValid?: boolean
  dateCreated?: string
  dateModified?: string
  isDeleted?: boolean
}

export interface LogObject {
  id?: number
  log: string
  clerkId?: number
  tableId?: string
  rowId?: number
  dateCreated?: string
  isDeleted?: boolean
}

export interface StockMovementObject {
  id?: number
  stockId?: number
  clerkId?: number
  quantity?: number
  saleId?: number
  registerId?: number
  stocktakeId?: number
  act?: string
  note?: string
  dateMoved?: string
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

export interface TaskObject {
  id?: number
  description?: string
  dateCreated?: string
  createdByClerkId?: number
  assignedTo?: string
  assignedToClerkId?: number
  isCompleted?: boolean
  isPriority?: boolean
  dateCompleted?: string
  completedByClerkId?: number
  isPostMailOrder?: boolean
  isDeleted?: boolean
}

export interface RegisterObject {
  id?: number
  openedById?: number
  openDate?: string
  openAmount?: number
  openNote?: string
  openTillId?: number
  closedById?: number
  closeDate?: string
  closeTillId?: number
  closeAmount?: number
  closePettyBalance?: number
  closeCashGiven?: number
  closeManualPayments?: number
  closeExpectedAmount?: number
  closeDiscrepancy?: number
  closeNote?: string
}

export interface TillObject {
  id?: number
  oneHundredDollar?: number
  fiftyDollar?: number
  twentyDollar?: number
  tenDollar?: number
  fiveDollar?: number
  twoDollar?: number
  oneDollar?: number
  fiftyCent?: number
  twentyCent?: number
  tenCent?: number
}

export interface ModalButton {
  type?: string
  onClick?: Function
  text?: string
  disabled?: boolean
  loading?: boolean
  hidden?: boolean
  data?: any[]
  headers?: string[]
  fileName?: string
}

export interface OpenWeatherObject {
  base?: string
  clouds?: {
    all?: number
  }
  cod?: number
  coord?: {
    lon?: number
    lat?: number
  }
  dt?: number
  id?: number
  main?: {
    feels_like?: number
    humidity?: number
    pressure?: number
    temp?: number
    temp_max?: number
    temp_min?: number
  }
  name?: string
  sys?: {
    country?: string
    id?: number
    sunrise?: number
    sunset?: number
    type?: number
  }
  timezone?: number
  visibility?: number
  weather?: WeatherObject[]
  wind?: {
    deg?: number
    gust?: number
    speed?: number
  }
}

interface WeatherObject {
  id?: number
  main?: string
  description?: string
  icon?: string
}
export interface AlertProps {
  open: boolean
  type?: 'error' | 'info' | 'success' | 'warning'
  message?: string
  undo?: Function
}

export const bgDark = [
  'bg-col1-dark',
  'bg-col2-dark',
  'bg-col3-dark',
  'bg-col4-dark',
  'bg-col5-dark',
  'bg-col6-dark',
  'bg-col7-dark',
  'bg-col8-dark',
  'bg-col9-dark',
  'bg-col10-dark',
]

export const bg = [
  'bg-col1',
  'bg-col2',
  'bg-col3',
  'bg-col4',
  'bg-col5',
  'bg-col6',
  'bg-col7',
  'bg-col8',
  'bg-col9',
  'bg-col10',
]

export const bgLight = [
  'bg-col1-light',
  'bg-col2-light',
  'bg-col3-light',
  'bg-col4-light',
  'bg-col5-light',
  'bg-col6-light',
  'bg-col7-light',
  'bg-col8-light',
  'bg-col9-light',
  'bg-col10-light',
]
