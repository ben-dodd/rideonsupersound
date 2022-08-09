import { VendorSaleItemObject } from '@lib/types'
import axios from 'axios'
import dayjs from 'dayjs'
import useSWR from 'swr'
import { camelCase, pascalCase } from '../utils'
import { reverseMysqlSafeValue } from './query'

export async function fetcher(url: string) {
  return axios(url)
    .then((response) => response.data)
    .catch((error) => console.log(error))
}

export function useRead(label, query, getSingleValue = false) {
  const key = `/api/get?${Object.entries({
    ...query,
    k: process.env.NEXT_PUBLIC_SWR_API_KEY,
  })
    .map(([key, value]) => `${key}=${value}`)
    .join('&')}`
  const { data, error, mutate } = useSWR(key, fetcher)
  console.log(key)
  // Check any data that needs parsing
  data?.map?.((item) => {
    Object.entries(item).forEach((value, key) => {
      if (value[0] === '{' || value[0] === '[')
        item[key] = reverseMysqlSafeValue(value)
    })
    return item
  })
  return {
    [camelCase(label)]: getSingleValue ? data?.[0] : data,
    [`is${pascalCase(label)}Loading`]: !error && !data,
    [`is${pascalCase(label)}Error`]: error,
    [`mutate${pascalCase(label)}`]: mutate,
  }
}

export function useSalesJoined() {
  const { data, error, mutate } = useSWR(`/api/get-sales-join`, fetcher)

  // If any sold items have more than one "stock price" row, we need to only select the latest one
  // (If stock prices are changed after a sale, it won't be included in the returned data)
  // REVIEW: Make it so MYSQL only returns the latest one.

  let duplicates = {}

  data?.forEach?.((sale: VendorSaleItemObject) => {
    let key = `${sale?.sale_id}-${sale?.item_id}`
    if (
      !duplicates[key] ||
      dayjs(duplicates[key]?.date_price_valid_from)?.isBefore(
        dayjs(sale?.date_price_valid_from)
      )
    )
      duplicates[key] = sale
  })

  const totalSalesReduced = Object.values(duplicates)

  return {
    sales: totalSalesReduced,
    isSalesLoading: !error && !data,
    isSalesError: error,
    mutateSales: mutate,
  }
}

// TODO gift cards and misc items should probably be in separate table to other stock
export function useInventory() {
  const { data, error, mutate } = useSWR(`/api/get-stock-inventory`, fetcher)
  return {
    inventory: data,
    isInventoryLoading: !error && !data,
    isInventoryError: error,
    mutateInventory: mutate,
  }
}
export function useStockByVendor(vendor_id: number) {
  const { data, error, mutate } = useSWR(
    `/api/get-stock-by-vendor?vendor_id=${vendor_id}`,
    fetcher
  )
  return {
    vendorStock: data,
    isVendorStockLoading: !error && !data,
    isVendorStockError: error,
    mutateVendorStock: mutate,
  }
}

export function useStockSaleVars() {
  // Gets all stock items for getSaleVars and for SaveSale
  const { data, error, mutate } = useSWR(`/api/get-stock-sale-vars`, fetcher)
  return {
    stockSaleVars: data,
    isStockSaleVarsLoading: !error && !data,
    isStockSaleVarsError: error,
    mutateStockSaleVars: mutate,
  }
}

export function useStockDisplay() {
  // Gets all stock items, including misc and gift cards but gets less information
  // Used for list items, dropdowns etc.
  // Use where price etc. still required
  const { data, error, mutate } = useSWR(`/api/get-stock-display`, fetcher)
  return {
    stockDisplay: data,
    isStockDisplayLoading: !error && !data,
    isStockDisplayError: error,
    mutateStockDisplay: mutate,
  }
}

export function useStockDisplayMin() {
  // Gets all stock items, including misc and gift cards but gets less information
  // Used for list items, dropdowns etc.
  // Used for bare minimum needs
  // No misc items or gift cards
  const { data, error, mutate } = useSWR(`/api/get-stock-display-min`, fetcher)
  return {
    stockDisplay: data,
    isStockDisplayLoading: !error && !data,
    isStockDisplayError: error,
    mutateStockDisplay: mutate,
  }
}

export function useStockItem(stock_id: number) {
  const { data, error, mutate } = useSWR(
    `/api/get-stock-item?stock_id=${stock_id}`,
    fetcher
  )
  return {
    stockItem: data?.[0],
    isStockItemLoading: !error && !data,
    isStockItemError: error,
    mutateStockItem: mutate,
  }
}

export function useSaleById(sale_id: number) {
  return useRead('sale', { table: 'sale', where: `id = ${sale_id}` })
}

export function useSaleTransactionsForRange(range: any) {
  const { data, error, mutate } = useSWR(
    `/api/get-sale-transactions-for-range?start_date=${
      range?.startDate || dayjs().startOf('week').format('YYYY-MM-DD')
    }&end_date=${range?.endDate || dayjs().format('YYYY-MM-DD')}`,
    fetcher
  )
  return {
    saleTransactions: data,
    isSaleTransactionsLoading: !error && !data,
    isSaleTransactionsError: error,
    mutateSaleTransactions: mutate,
  }
}

export function useSaleTransactionsForSale(sale_id: number) {
  const { data, error, mutate } = useSWR(
    `/api/get-sale-transactions-for-sale?sale_id=${sale_id}`,
    fetcher
    // {
    //   refreshInterval: 500,
    // }
  )
  return {
    transactions: data,
    isSaleTransactionsLoading: !error && !data,
    isSaleTransactionsError: error,
    mutateSaleTransactions: mutate,
  }
}

export function useSaleItemsForSale(sale_id: number) {
  const { data, error, mutate } = useSWR(
    `/api/get-sale-items-for-sale?sale_id=${sale_id}`,
    fetcher
  )

  // If any sold items have more than one "stock price" row, we need to only select the latest one
  // (If stock prices are changed after a sale, it won't be included in the returned data)
  // REVIEW: Make it so MYSQL only returns the latest one.

  let duplicates = {}

  data?.forEach((sale: VendorSaleItemObject) => {
    let key = `${sale?.sale_id}-${sale?.item_id}`
    // console.log(duplicates);
    // console.log(sale);
    if (
      !duplicates[key] ||
      duplicates[key]?.date_price_valid_from < sale?.date_price_valid_from
    )
      duplicates[key] = sale
  })

  const totalSalesReduced = Object.values(duplicates)
  return {
    items: totalSalesReduced,
    isSaleItemsLoading: !error && !data,
    isSaleItemsError: error,
    mutateSaleItems: mutate,
  }
}

export function useVendorTotalSales(vendor_id: number) {
  const { data, error, mutate } = useSWR(
    `/api/get-vendor-total-sales?vendor_id=${vendor_id}`,
    fetcher
  )

  // If any sold items have more than one "stock price" row, we need to only select the latest one
  // (If stock prices are changed after a sale, it won't be included in the returned data)
  // REVIEW: Make it so MYSQL only returns the latest one.

  let duplicates = {}

  data &&
    data.forEach((sale: VendorSaleItemObject) => {
      let key = `${sale?.sale_id}-${sale?.item_id}`
      if (
        !duplicates[key] ||
        duplicates[key]?.date_valid_from < sale?.date_price_valid_from
      )
        duplicates[key] = sale
    })

  const totalSalesReduced = Object.values(duplicates)

  return {
    totalSales: totalSalesReduced,
    isVendorTotalSalesLoading: !error && !data,
    isVendorTotalSalesError: error,
    mutateVendorTotalSales: mutate,
  }
}

export function useStocktakeTemplates() {
  const { data, error, mutate } = useSWR(
    `/api/get-stocktake-templates`,
    fetcher
  )

  const stocktakeTemplates = data?.map((st) => {
    return {
      ...st,
      media_list:
        typeof st?.media_list === 'string' || st?.media_list instanceof String
          ? JSON.parse(st?.media_list || '[]')
          : st?.media_list,
      format_list:
        typeof st?.format_list === 'string' || st?.format_list instanceof String
          ? JSON.parse(st?.format_list || '[]')
          : st?.format_list,
      section_list:
        typeof st?.section_list === 'string' ||
        st?.section_list instanceof String
          ? JSON.parse(st?.section_list || '[]')
          : st?.section_list,
      vendor_list:
        typeof st?.vendor_list === 'string' || st?.vendor_list instanceof String
          ? JSON.parse(st?.vendor_list || '[]')
          : st?.vendor_list,
    }
  })

  return {
    stocktakeTemplates: stocktakeTemplates,
    isStocktakeTemplatesLoading: !error && !data,
    isStocktakeTemplatesError: error,
    mutateStocktakeTemplates: mutate,
  }
}

export function useAccount(email: string) {
  return useRead(
    'account',
    {
      columns: ['id', 'email', 'is_admin', 'is_authenticated'],
      table: 'account',
      where: `email="${email}"`,
    },
    true
  )
}

export function useAccountClerks(account_id: number) {
  return useRead('account clerks', {
    table: 'clerk',
    where: `id IN (
        SELECT clerk_id
        FROM account_clerk
        WHERE account_id = ${account_id}
      )`,
    orderBy: 'colour',
  })
}

export function useClerks() {
  return useRead('clerks', {
    table: 'clerk',
    orderBy: 'colour',
  })
}

export function useVendors() {
  return useRead('vendors', { table: 'vendor', where: `NOT is_deleted` })
}

export function useVendorNames() {
  return useRead('vendors', {
    columns: ['id', 'name'],
    table: 'vendor',
    where: `NOT is_deleted`,
  })
}

export function useVendorPayments() {
  return useRead('vendor payments', {
    table: 'vendor_payment',
    where: 'NOT is_deleted',
  })
}

export function useVendorTotalPayments(vendor_id: number) {
  return useRead('vendor total payments', {
    columns: ['date', 'amount'],
    table: 'vendor_payment',
    where: `vendor_id = ${vendor_id} AND NOT is_deleted`,
  })
}

export function useVendorFromVendorPayment(vendor_payment_id: number) {
  return useRead('vendor', {
    table: 'vendor',
    where: `id IN
  (SELECT vendor_id
    FROM vendor_payment
    WHERE id = ${vendor_payment_id}
  )`,
  })
}

export function useGiftCards() {
  return useRead('gift cards', {
    columns: [
      'id',
      'is_gift_card',
      'gift_card_code',
      'gift_card_amount',
      'gift_card_remaining',
      'gift_card_is_valid',
      'note',
      'date_created',
      'date_modified',
    ],
    table: 'stock',
    where: `is_gift_card AND NOT is_deleted`,
  })
}

export function useSales() {
  return useRead('sales', {
    columns: [
      'id',
      'customer_id',
      'state',
      'date_sale_opened',
      'sale_opened_by',
      'date_sale_closed',
      'sale_closed_by',
      'store_cut',
      'total_price',
      'number_of_items',
      'item_list',
      'is_mail_order',
      'postage',
      'postal_address',
      'weather',
      'note',
    ],
    table: 'sale',
    where: `NOT is_deleted`,
  })
}

export function useCustomers() {
  return useRead('customers', { table: 'customer', where: `NOT is_deleted` })
}

export function useCustomer(customer_id: number) {
  return useRead(
    'customer',
    { table: 'customer', where: `id = ${customer_id}` },
    true
  )
}

export function useSaleItems() {
  return useRead('sale items', { table: 'sale_item' })
}

export function useHelps() {
  return useRead('helps', { table: 'help', where: 'NOT is_deleted' })
}

export function useHolds() {
  return useRead('holds', {
    table: 'hold',
    where: `NOT is_deleted AND date_removed_from_hold IS NULL`,
  })
}

export function useLogs() {
  return useRead('logs', {
    table: 'log',
    where: `NOT is_deleted AND NOT table_id <=> "system"`,
    orderBy: 'date_created',
    isDesc: true,
  })
}

export function useStockMovements(limit) {
  return useRead('stock movements', {
    table: 'stock_movement',
    orderBy: 'date_moved',
    isDesc: true,
    limit,
  })
}

export function useStockMovementByStockId(id) {
  return useRead('stock-movements-by-stock-id', {
    table: 'stock_movement',
    where: `NOT is_deleted AND
  stock_id = ${id}`,
    orderBy: 'date_moved',
    isDesc: true,
    id: id,
  })
}

export function useJobs() {
  return useRead('jobs', {
    table: 'task',
    where: `NOT is_deleted
  AND NOT is_completed
  OR date_completed > date_sub(now(), interval 1 week)`,
    orderBy: 'date_created',
    isDesc: true,
    limit: 200,
  })
}

export function useStocktakeItemsByStocktake(stocktake_id: number) {
  return useRead('stocktake items', {
    table: 'stocktake_item',
    where: `NOT is_deleted
  AND stocktake_id = ${stocktake_id}`,
    orderBy: 'date_counted',
    isDesc: true,
  })
}

export function useStocktakesByTemplate(stocktake_template_id: number) {
  return useRead('stocktakes', {
    table: 'stocktake',
    where: `NOT is_deleted
  AND stocktake_template_id = ${stocktake_template_id}`,
    orderBy: 'date_started',
    isDesc: true,
  })
}

export function useRegisterID() {
  return useRead(
    'register',
    { columns: ['num'], table: 'global', where: `id="current_register"` },
    true
  )
}

export function useRegister(register_id: number) {
  return useRead(
    'register',
    { table: 'register', where: `id = ${register_id}` },
    true
  )
}

export function useRegisters(start_date, end_date) {
  return useRead('registers', {
    table: 'register',
    where: `open_date >= ${start_date}
  AND open_date <= ${end_date}`,
  })
}

export function usePettyCash(register_id: number) {
  return useRead('petty cash', {
    table: 'register_petty_cash',
    where: `register_id = ${register_id}`,
  })
}

export function useCashGiven(register_id: number) {
  return useRead('cash given', {
    columns: [
      'sale_id',
      'clerk_id',
      'date',
      'payment_method',
      'amount',
      'change_given',
    ],
    table: 'sale_transaction',
    where: `register_id = ${register_id} AND change_given AND NOT is_deleted`,
  })
}

export function useCashReceived(register_id: number) {
  return useRead('cash received', {
    columns: [
      'sale_id',
      'clerk_id',
      'date',
      'payment_method',
      'amount',
      'change_given',
    ],
    table: 'sale_transaction',
    where: `register_id = ${register_id} AND cash_received AND NOT is_deleted`,
  })
}

export function useManualPayments(register_id: number) {
  return useRead('manual payments', {
    columns: ['date', 'amount', 'clerk_id', 'vendor_id'],
    table: 'vendor_payment',
    where: `register_id = ${register_id} AND type = 'cash'`,
  })
}

export function useSelect(setting_select: string) {
  return useRead('selects', {
    columns: ['label'],
    table: 'select_option',
    where: `setting_select = '${setting_select}'`,
  })
}

export function useAllSelects() {
  return useRead('selects', {
    columns: ['label', 'setting_select'],
    table: 'select_option',
  })
}
