/* eslint-disable unused-imports/no-unused-vars */
import { CustomerObject } from '.'
import { GiftCardObject } from './stock'
import { VendorObject } from './vendor'

export enum SaleStateTypes {
  InProgress = 'in progress', // sale in cart
  Layby = 'layby', // sale held on layby
  Parked = 'parked', // sale parked
  Completed = 'completed', // sale completed
}

export enum PaymentMethodTypes {
  Cash = 'cash', // paid with cash
  Card = 'card', // paid with card, eftpos or credit
  Account = 'acct', // paid with vendor store credit
  GiftCard = 'gift', // paid with gift card
}

export interface SaleObject {
  id?: number
  customerId?: number
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
}

export interface CartObject {
  sale?: SaleObject
  customer?: CustomerObject
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
