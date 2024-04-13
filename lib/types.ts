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

export enum VendorPaymentTypes {
  Sale = 'sale', // vendor bought something with account
  SaleRefund = 'sale refund', // vendor refunded something onto their account
  Cash = 'cash', // vendor was given cash in store
  DC = 'direct credit', // vendor paid with internet banking
  Batch = 'batch', // vendor paid with batch kiwibank payment
  TransferTo = 'transfer to', // vendor has been paid with a store credit transfer
  TransferFrom = 'transfer from', // vendor has transferred their store credit to another
}
export interface StockObject {
  id?: number
  sku?: string
  vendor_id?: number
  vendor_name?: string
  artist?: string
  title?: string
  display_as?: string
  media?: string
  format?: string
  section?: string
  genre?: string[] | string
  is_new?: number
  cond?: string
  country?: string
  release_year?: string
  barcode?: string
  publisher?: string
  colour?: string
  size?: string
  description?: string
  note?: string
  image_id?: string
  image_url?: string
  thumb_url?: string
  google_books_item_id?: number
  discogs_item_id?: number
  do_list_on_website?: number
  has_no_quantity?: number
  date_created?: string
  date_last_stocktake?: string
  date_modified?: string
  is_deleted?: number
  vendor_cut?: number
  total_sell?: number
  quantity?: number
  quantity_received?: number
  quantity_returned?: number
  quantity_lost?: number
  quantity_found?: number
  quantity_discarded?: number
  quantity_layby?: number
  quantity_unlayby?: number
  quantity_hold?: number
  quantity_unhold?: number
  quantity_sold?: number
  quantity_unsold?: number
  quantity_adjustment?: number
  tags?: string[]
  is_gift_card?: boolean
  gift_card_code?: string
  gift_card_amount?: number
  gift_card_remaining?: number
  gift_card_is_valid?: boolean
  is_misc_item?: boolean
  misc_item_description?: string
  misc_item_amount?: number
  googleBooksItem?: any
  discogsItem?: any
  needs_restock?: boolean
}
