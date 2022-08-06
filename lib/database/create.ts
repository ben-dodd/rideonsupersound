import { CustomerObject } from '@/features/customer/lib/types'
import axios from 'axios'
// import { v4 } from 'uuid'
import {
  ClerkObject,
  LogObject,
  SaleItemObject,
  SaleObject,
  SaleTransactionObject,
  StockMovementTypes,
  StockObject,
  StocktakeItemObject,
  StocktakeObject,
  StocktakeTemplateObject,
  TaskObject,
  TillObject,
  VendorObject,
  VendorPaymentObject,
} from '../types'

async function createItemInDatabase(
  properties,
  table,
  mutateFunction?,
  mutateList?
) {
  return axios
    .post(`/api/create`, {
      table,
      properties,
      k: process.env.NEXT_PUBLIC_SWR_API_KEY,
    })
    .then((response) => {
      const id = response.data.insertId
      if (mutateFunction) {
        if (mutateList)
          mutateFunction(
            mutateList?.map((listItem) =>
              listItem?.id === id ? properties : listItem
            ),
            false
          )
        else mutateFunction()
      }
      return id
    })
    .catch((error) => console.log(error))
}

export async function createVendorInDatabase(vendor: VendorObject) {
  const {
    name,
    vendor_category,
    clerk_id,
    bank_account_number,
    contact_name,
    email,
    phone,
    postal_address,
    note,
    store_credit_only,
    email_vendor,
  } = vendor
  const newVendor = {
    // uid: v4(),
    name,
    vendor_category,
    clerk_id,
    bank_account_number,
    contact_name,
    email,
    phone,
    postal_address,
    note,
    store_credit_only,
    email_vendor,
  }
  return await createItemInDatabase(newVendor, 'vendor')
}

export async function createVendorPaymentInDatabase(
  vendorPayment: VendorPaymentObject
) {
  const {
    amount,
    bank_account_number,
    batch_number,
    sequence_number,
    bank_reference,
    clerk_id,
    vendor_id,
    register_id,
    type,
    date,
    note,
  } = vendorPayment
  const newVendorPayment = {
    amount,
    bank_account_number,
    batch_number,
    sequence_number,
    bank_reference,
    clerk_id,
    vendor_id,
    register_id,
    type,
    date,
    note,
  }
  return await createItemInDatabase(newVendorPayment, 'vendor_payment')
}

export async function createStocktakeItemInDatabase(
  stocktakeItem: StocktakeItemObject
) {
  const {
    id,
    stock_id,
    stocktake_id,
    quantity_counted,
    quantity_recorded,
    quantity_difference,
    review_decision,
    date_counted,
    counted_by,
  } = stocktakeItem
  const newStockTakeItem = {
    id,
    stock_id,
    stocktake_id,
    quantity_counted,
    quantity_recorded,
    quantity_difference,
    review_decision,
    date_counted,
    counted_by,
  }
  return await createItemInDatabase(newStockTakeItem, 'stocktake_item')
}

export async function createStocktakeInDatabase(stocktake: StocktakeObject) {
  const {
    stocktake_template_id,
    date_started,
    started_by,
    date_closed,
    closed_by,
    date_cancelled,
    cancelled_by,
    total_counted,
    total_unique_counted,
    total_estimated,
    total_unique_estimated,
  } = stocktake
  const newStocktake = {
    stocktake_template_id,
    date_started,
    started_by,
    date_closed,
    closed_by,
    date_cancelled,
    cancelled_by,
    total_counted,
    total_unique_counted,
    total_estimated,
    total_unique_estimated,
  }
  return await createItemInDatabase(newStocktake, 'stocktake')
}

export async function createStocktakeTemplateInDatabase(
  stocktakeTemplate: StocktakeTemplateObject
) {
  const {
    name,
    filter_description,
    image,
    vendor_enabled,
    vendor_list,
    section_enabled,
    section_list,
    media_enabled,
    media_list,
    format_enabled,
    format_list,
    total_estimated,
    total_unique_estimated,
  } = stocktakeTemplate
  const newStocktakeTemplate = {
    name,
    filter_description,
    image,
    vendor_enabled,
    vendor_list,
    section_enabled,
    section_list,
    media_enabled,
    media_list,
    format_enabled,
    format_list,
    total_estimated,
    total_unique_estimated,
  }
  return await createItemInDatabase(newStocktakeTemplate, 'stocktake_template')
}

export async function createSaleInDatabase(
  sale: SaleObject,
  clerk: ClerkObject
) {
  const {
    customer_id,
    state,
    date_sale_opened,
    weather,
    geo_latitude,
    geo_longitude,
    note,
    layby_started_by,
    date_layby_started,
    sale_closed_by,
    date_sale_closed,
    store_cut,
    total_price,
    number_of_items,
    item_list,
    is_mail_order,
    postage,
    postal_address,
  } = sale
  const newSale = {
    customer_id,
    state,
    sale_opened_by: clerk?.id,
    date_sale_opened,
    weather,
    geo_latitude,
    geo_longitude,
    note,
    layby_started_by,
    date_layby_started,
    sale_closed_by,
    date_sale_closed,
    store_cut,
    total_price,
    number_of_items,
    item_list,
    is_mail_order: is_mail_order ? 1 : 0,
    postage,
    postal_address,
  }
  return await createItemInDatabase(newSale, 'sale')
}

export async function createSaleItemInDatabase(saleItem: SaleItemObject) {
  const {
    sale_id,
    item_id,
    quantity,
    vendor_discount,
    store_discount,
    is_gift_card,
    is_misc_item,
    note,
  } = saleItem
  const newSaleItem = {
    sale_id,
    item_id,
    quantity,
    vendor_discount,
    store_discount,
    is_gift_card,
    is_misc_item,
    note,
  }
  return await createItemInDatabase(newSaleItem, 'sale_item')
}

export async function createSaleTransactionInDatabase(
  saleTransaction: SaleTransactionObject
) {
  const {
    sale_id,
    clerk_id,
    date,
    payment_method,
    amount,
    cash_received,
    change_given,
    register_id,
    vendor_payment_id,
    gift_card_id,
    gift_card_taken,
    gift_card_change,
    is_refund,
  } = saleTransaction
  const newSaleTransaction = {
    sale_id,
    clerk_id,
    date,
    payment_method,
    amount,
    cash_received,
    change_given,
    register_id,
    vendor_payment_id,
    gift_card_id,
    gift_card_taken,
    gift_card_change,
    is_refund,
  }
  return await createItemInDatabase(newSaleTransaction, 'sale_transaction')
}

export async function createTillInDatabase(till: TillObject) {
  const {
    one_hundred_dollar,
    fifty_dollar,
    twenty_dollar,
    ten_dollar,
    five_dollar,
    two_dollar,
    one_dollar,
    fifty_cent,
    twenty_cent,
    ten_cent,
  } = till
  const newTill = {
    one_hundred_dollar,
    fifty_dollar,
    twenty_dollar,
    ten_dollar,
    five_dollar,
    two_dollar,
    one_dollar,
    fifty_cent,
    twenty_cent,
    ten_cent,
  }
  return await createItemInDatabase(newTill, 'register_till')
}

export async function createTaskInDatabase(task: TaskObject) {
  const {
    description,
    created_by_clerk_id,
    assigned_to,
    assigned_to_clerk_id,
    is_priority,
    date_created,
    is_post_mail_order,
  } = task
  const newTask = {
    description,
    created_by_clerk_id,
    assigned_to,
    assigned_to_clerk_id,
    is_priority,
    date_created,
    is_post_mail_order,
  }
  return await createItemInDatabase(newTask, 'task')
}

export async function createCustomerInDatabase(
  customer: CustomerObject,
  clerk: ClerkObject
) {
  const { name, email, phone, postal_address, note } = customer
  const newCustomer = {
    name,
    email,
    phone,
    postal_address,
    note,
    created_by_clerk_id: clerk?.id,
  }
  return await createItemInDatabase(newCustomer, 'customer')
}

export async function createHoldInDatabase(
  sale: SaleObject,
  item: SaleItemObject,
  holdPeriod: number,
  note: string,
  clerk: ClerkObject,
  registerID: number
) {
  const newHold = {
    customer_id: sale?.customer_id,
    item_id: item?.item_id,
    quantity: item?.quantity,
    vendor_discount: item?.vendor_discount,
    store_discount: item?.store_discount,
    hold_period: holdPeriod,
    started_by: clerk?.id,
    note: note,
  }
  return await createItemInDatabase(newHold, 'hold')
}

export async function createStockItemInDatabase(
  stockItem: StockObject,
  clerk: ClerkObject
) {
  const {
    vendor_id,
    artist,
    title,
    display_as,
    media,
    format,
    section,
    genre,
    is_new,
    cond,
    country,
    release_year,
    barcode,
    publisher,
    colour,
    size,
    tags,
    description,
    note,
    image_id,
    image_url,
    thumb_url,
    google_books_item_id,
    googleBooksItem,
    discogs_item_id,
    discogsItem,
    do_list_on_website,
    has_no_quantity,
    is_gift_card,
    gift_card_code,
    gift_card_amount,
    gift_card_remaining,
    gift_card_is_valid,
    is_misc_item,
    misc_item_description,
    misc_item_amount,
    date_last_stocktake,
  } = stockItem
  const newStockItem = {
    vendor_id,
    artist,
    title,
    display_as,
    media,
    format,
    section,
    genre,
    is_new,
    cond,
    country,
    release_year,
    barcode,
    publisher,
    colour,
    size,
    tags,
    description,
    note,
    image_id,
    image_url,
    thumb_url,
    google_books_item_id,
    googleBooksItem,
    discogs_item_id,
    discogsItem,
    do_list_on_website,
    has_no_quantity,
    is_gift_card,
    gift_card_code,
    gift_card_amount,
    gift_card_remaining,
    gift_card_is_valid,
    is_misc_item,
    misc_item_description,
    misc_item_amount,
    created_by_id: clerk?.id,
    date_last_stocktake,
  }
  return await createItemInDatabase(newStockItem, 'stock')
}

export async function createStockPriceInDatabase(
  stock_id: number,
  clerk: ClerkObject,
  total_sell: number,
  vendor_cut: number,
  note: string
) {
  const newStockPrice = {
    stock_id,
    clerk_id: clerk?.id,
    vendor_cut,
    total_sell,
    note,
  }
  return await createItemInDatabase(newStockPrice, 'stock_price')
}

interface stockMovementProps {
  item: SaleItemObject
  clerk: ClerkObject
  registerID: number
  act: string
  note: string
  sale_id?: number
  stocktake_id?: number
}

export async function createStockMovementInDatabase({
  item,
  clerk,
  registerID,
  act,
  note,
  sale_id,
  stocktake_id,
}: stockMovementProps) {
  const newStockMovement = {
    stock_id: item?.item_id,
    clerk_id: clerk?.id,
    register_id: registerID,
    quantity: getQuantityByType(item?.quantity, act),
    act,
    note,
    sale_id,
    stocktake_id,
  }
  return await createItemInDatabase(newStockMovement, 'stock_movement')
}

function getQuantityByType(quantity, act) {
  return act === StockMovementTypes.Received ||
    act === StockMovementTypes.Unhold ||
    act === StockMovementTypes.Unlayby ||
    act === StockMovementTypes.Found ||
    act === StockMovementTypes.Unsold ||
    act === StockMovementTypes.Adjustment
    ? parseInt(quantity)
    : -parseInt(quantity)
}

export async function createSettingSelectInDatabase(
  label: string,
  setting_select: string,
  mutateSettings: Function
) {
  // const { label, setting_select } = setting
  const newSetting = { label, setting_select }
  return await createItemInDatabase(newSetting, 'select_option', mutateSettings)
}

export async function createRegisterInDatabase(register) {
  const { opened_by_id, open_amount, open_note, open_till_id, open_date } =
    register
  const newRegister = {
    opened_by_id,
    open_amount,
    open_note,
    open_till_id,
    open_date,
  }
  return await createItemInDatabase(newRegister, 'register')
}

export async function createPettyCashInDatabase(pettyCash) {
  const { register_id, clerk_id, amount, is_take, note, date } = pettyCash
  const newPettyCash = { register_id, clerk_id, amount, is_take, note, date }
  return await createItemInDatabase(newPettyCash, 'register_petty_cash')
}

export async function createLogInDatabase(logObj: LogObject) {
  const { date_created, table_id, row_id, log, clerk_id } = logObj
  const newLog = { date_created, table_id, row_id, log, clerk_id }
  return await createItemInDatabase(newLog, 'log')
}
