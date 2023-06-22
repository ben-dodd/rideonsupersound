/* eslint-disable unused-imports/no-unused-vars */

import { StockItemObject } from './stock'

export enum VendorPaymentTypes {
  Sale = 'sale', // vendor bought something with account
  SaleRefund = 'sale refund', // vendor refunded something onto their account
  Cash = 'cash', // vendor was given cash in store
  DC = 'direct credit', // vendor paid with internet banking
  Batch = 'batch', // vendor paid with batch kiwibank payment
  TransferTo = 'transfer to', // vendor has been paid with a store credit transfer
  TransferFrom = 'transfer from', // vendor has transferred their store credit to another
}

export interface BatchPaymentObject {
  id?: number
  batchNumber?: string
  sequenceNumber?: string
  note?: string
  dateStarted?: string
  startedByClerkId?: number
  startedByClerkName?: string
  dateCompleted?: string
  completedByClerkId?: number
  completedByClerkName?: string
  isDeleted?: boolean
  lastUpdated?: string
  totalPay?: number
  totalNumVendors?: number
  clerkId?: number
  registerId?: number
  kbbFile?: string
  emailCsvFile?: string
  paymentList?: AccountPayment[]
}

export interface VendorSaleItemObject {
  id?: number
  artist?: string
  displayAs?: string
  saleId?: number
  itemId?: number
  quantity?: number
  storeDiscount?: number
  vendorDiscount?: number
  vendorId?: number
  format: string
  itemVendorCut?: number
  itemTotalSell?: number
  datePriceValidFrom?: string
  dateSaleOpened?: string
  dateSaleClosed?: string
  isRefunded?: boolean
  itemList?: string
  saleStoreCut?: number
  saleTotalPrice?: number
}

export interface VendorPaymentObject {
  id?: number
  amount?: number
  date?: string
  clerkId?: number
  vendorId?: number
  registerId?: number
  saleId?: number
  batchId?: number
  bankAccountNumber?: string
  bankReference?: string
  type?: string
  note?: String
  isValidated?: boolean
  isDeleted?: boolean
  vendorPayId?: number
  vendorReceiveId?: number
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
  items?: StockItemObject[]
  sales?: VendorSaleItemObject[]
  payments?: VendorPaymentObject[]
}
export interface AccountPayment {
  id?: number
  isChecked?: boolean
  payAmount?: string
  totalVendorCut?: number
  totalOwing?: number
  lastSold?: string
  lastPaid?: string
  lastContacted?: string
  storeCreditOnly?: boolean
  invalidBankAccountNumber?: boolean
  hasNegativeQuantityItems?: boolean
  name?: string
  vendorId?: number
  bankAccountNumber?: string
  bankReference?: string
  batchId?: number
  clerkId?: number
  date?: string
  amount?: number
  isValidated?: boolean
  isDeleted?: boolean
}
