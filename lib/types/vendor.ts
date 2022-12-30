/* eslint-disable unused-imports/no-unused-vars */

export enum VendorPaymentTypes {
  Sale = 'sale', // vendor bought something with account
  SaleRefund = 'sale refund', // vendor refunded something onto their account
  Cash = 'cash', // vendor was given cash in store
  DC = 'direct credit', // vendor paid with internet banking
  Batch = 'batch', // vendor paid with batch kiwibank payment
  TransferTo = 'transfer to', // vendor has been paid with a store credit transfer
  TransferFrom = 'transfer from', // vendor has transferred their store credit to another
}

export interface VendorSaleItemObject {
  id?: number
  saleId?: number
  itemId?: number
  quantity?: number
  storeDiscount?: number
  vendorDiscount?: number
  vendorId?: number
  format: string
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
  vendorPayId?: number
  vendorReceiveId?: number
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
