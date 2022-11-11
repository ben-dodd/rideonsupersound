import axios from 'axios'
import { useAuth0 } from '@auth0/auth0-react'

import useSWR from 'swr'
import { camelCase, pascalCase } from '../utils'
import { reverseMysqlSafeValue } from './query'
import {
  getAccountClerksQuery,
  getAccountQuery,
  getAllSelectsQuery,
  getCashGivenQuery,
  getCashReceivedQuery,
  getClerksQuery,
  getCustomerQuery,
  getCustomersQuery,
  getGiftCardsQuery,
  getHelpsQuery,
  getHoldsQuery,
  getJobsQuery,
  getLogsQuery,
  getManualPaymentsQuery,
  getPettyCashQuery,
  getRegisterIDQuery,
  getRegisterQuery,
  getRegistersQuery,
  getSaleByIdQuery,
  getSaleItemsByIdQuery,
  getSaleItemsQuery,
  getSalesJoinedQuery,
  getSalesQuery,
  getSaleTransactionsByIdQuery,
  getSaleTransactionsForRangeQuery,
  getSaleTransactionsForSaleQuery,
  getSaleWithItemsQuery,
  getSelectQuery,
  getStockMovementByStockIdQuery,
  getStockMovementsQuery,
  getStockQuery,
  getStocktakeItemsByStocktakeQuery,
  getStocktakesByTemplateQuery,
  getStocktakeTemplatesQuery,
  getVendorFromVendorPaymentQuery,
  getVendorNamesQuery,
  getVendorPaymentsQuery,
  getVendorsQuery,
  getVendorTotalPaymentsQuery,
} from './read-query'

export async function fetcher(url: string, scope?: string) {
  const { getAccessTokenSilently } = useAuth0()
  const token = await getAccessTokenSilently({
    audience: process.env.AUTH0_AUDIENCE,
    scope: scope || 'read:stock',
  })
  return axios(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
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
  // console.log(key)
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

export function useAccount(email: string) {
  return useRead('account', getAccountQuery(email), true)
}

export function useAccountClerks(account_id: number) {
  return useRead('account clerks', getAccountClerksQuery(account_id))
}

export function useClerks() {
  return useRead('clerks', getClerksQuery())
}

export function useVendors() {
  return useRead('vendors', getVendorsQuery())
}

export function useVendorNames() {
  return useRead('vendors', getVendorNamesQuery())
}

export function useVendorPayments() {
  return useRead('vendor payments', getVendorPaymentsQuery())
}

export function useVendorTotalPayments(vendor_id: number) {
  return useRead(
    'vendor total payments',
    getVendorTotalPaymentsQuery(vendor_id)
  )
}

export function useVendorFromVendorPayment(vendor_payment_id: number) {
  return useRead('vendor', getVendorFromVendorPaymentQuery(vendor_payment_id))
}

export function useGiftCards() {
  return useRead('gift cards', getGiftCardsQuery())
}

export function useSales() {
  return useRead('sales', getSalesQuery())
}

export function useSaleItemsWithSales() {
  return useRead('saleItems', getSaleWithItemsQuery())
}

export function useSaleById(sale_id: number) {
  return useRead('sale', getSaleByIdQuery(sale_id))
}

export function useCustomers() {
  return useRead('customers', getCustomersQuery())
}

export function useCustomer(customer_id: number) {
  return useRead('customer', getCustomerQuery(customer_id), true)
}

export function useSaleItems() {
  return useRead('sale items', getSaleItemsQuery())
}

export function useSaleItemsTransactions(sale_id: number) {
  const getSale = useRead('sale', getSaleByIdQuery(sale_id))
  const getSaleItems = useRead('sale items', getSaleItemsByIdQuery(sale_id))
  const getSaleTransactions = useRead(
    'sale transactions',
    getSaleTransactionsByIdQuery(sale_id)
  )
  const getAll = Promise.all([getSale, getSaleItems, getSaleTransactions]).then(
    ([sale, items, transactions]) => {
      return {
        sale: {
          ...sale.sale,
          items: items.saleItems,
          transactions: transactions.saleTransactions,
        },
        isSaleLoading:
          sale.isSaleLoading ||
          items.isSaleItemsLoading ||
          transactions.isSaleTransactionsLoading,
        isSaleError:
          sale.isSaleError ||
          items.isSaleItemsError ||
          transactions.isSaleTransactionsError,
      }
    }
  )
  return getAll
}

export function useSaleTransactionsForRange(start_date, end_date) {
  return useRead(
    'sale transactions',
    getSaleTransactionsForRangeQuery(start_date, end_date)
  )
}

export function useSaleItemsForSale(sale_id: number) {
  return useRead('sale items', getSaleWithItemsQuery(sale_id))
}

export function useHelps() {
  return useRead('helps', getHelpsQuery())
}

export function useHolds() {
  return useRead('holds', getHoldsQuery())
}

export function useLogs() {
  return useRead('logs', getLogsQuery())
}

// TODO gift cards and misc items should probably be in separate table to other stock
export function useInventory() {
  return useRead('inventory', getStockQuery())
}

export function useStockMovements(limit) {
  return useRead('stock movements', getStockMovementsQuery(limit))
}

export function useStockMovementByStockId(id) {
  return useRead(
    'stock-movements-by-stock-id',
    getStockMovementByStockIdQuery(id)
  )
}
export function useStockByVendor(vendor_id: number) {
  return useRead('vendor stock', getStockQuery(null, vendor_id))
}

export function useStockSaleVars() {
  return useRead('stock sale vars', getStockQuery())
  // s.id,
  //       s.artist,
  //       s.title,
  //       s.display_as,
  //       s.is_gift_card,
  //       s.gift_card_code,
  //       s.gift_card_amount,
  //       s.is_misc_item,
  //       s.misc_item_description,
  //       s.misc_item_amount,
  //       p.vendor_cut,
  //       p.total_sell,
  //       q.quantity
  // Gets all stock items for getSaleVars and for SaveSale
}
export function useStockDisplayMin() {
  return useRead('stock display', getStockQuery())
  // Gets all stock items, including misc and gift cards but gets less information
  // Used for list items, dropdowns etc.
  // Used for bare minimum needs
  // No misc items or gift cards
  // SELECT
  //       id,
  //       vendor_id,
  //       artist,
  //       title,
  //       display_as,
  //       media,
  //       format,
  //       image_url
  //     FROM stock
  //     WHERE NOT is_deleted
  //     AND NOT is_misc_item
  //     AND NOT is_misc_item IS NULL
  //     AND NOT is_gift_card
  //     AND NOT is_gift_card IS NULL
}
export function useStockDisplay() {
  return useRead('stock display', getStockQuery())

  // Gets all stock items, including misc and gift cards but gets less information
  // Used for list items, dropdowns etc.
  // Use where price etc. still required
  // SELECT
  //       s.id,
  //       s.vendor_id,
  //       s.artist,
  //       s.title,
  //       s.display_as,
  //       s.media,
  //       s.format,
  //       s.section,
  //       s.is_new,
  //       s.cond,
  //       s.image_url,
  //       s.is_gift_card,
  //       s.gift_card_code,
  //       s.gift_card_amount,
  //       s.is_misc_item,
  //       s.misc_item_description,
  //       s.misc_item_amount,
  //       s.needs_restock,
  //       p.vendor_cut,
  //       p.total_sell,
  //       q.quantity
  //     FROM stock AS s
  //     LEFT JOIN
  //       (SELECT stock_id, SUM(quantity) AS quantity FROM stock_movement GROUP BY stock_id) AS q
  //       ON q.stock_id = s.id
  //     LEFT JOIN stock_price AS p ON p.stock_id = s.id
  //     WHERE
  //        (p.id = (
  //           SELECT MAX(id)
  //           FROM stock_price
  //           WHERE stock_id = s.id
  //        ) OR s.is_gift_card OR s.is_misc_item)
  //     AND NOT is_deleted
}

export function useStockItem(stock_id: number) {
  return useRead('stock item', getStockQuery(stock_id))
}

export function useJobs() {
  return useRead('jobs', getJobsQuery())
}

export function useStocktakeItemsByStocktake(stocktake_id: number) {
  return useRead(
    'stocktake items',
    getStocktakeItemsByStocktakeQuery(stocktake_id)
  )
}

export function useStocktakesByTemplate(stocktake_template_id: number) {
  return useRead(
    'stocktakes',
    getStocktakesByTemplateQuery(stocktake_template_id)
  )
}

export function useRegisterID() {
  return useRead('register', getRegisterIDQuery(), true)
}

export function useRegister(register_id: number) {
  return useRead('register', getRegisterQuery(register_id), true)
}

export function useRegisters(start_date, end_date) {
  return useRead('registers', getRegistersQuery(start_date, end_date))
}

export function usePettyCash(register_id: number) {
  return useRead('petty cash', getPettyCashQuery(register_id))
}

export function useCashGiven(register_id: number) {
  return useRead('cash given', getCashGivenQuery(register_id))
}

export function useCashReceived(register_id: number) {
  return useRead('cash received', getCashReceivedQuery(register_id))
}

export function useManualPayments(register_id: number) {
  return useRead('manual payments', getManualPaymentsQuery(register_id))
}

export function useSelect(setting_select: string) {
  return useRead('selects', getSelectQuery(setting_select))
}

export function useAllSelects() {
  return useRead('selects', getAllSelectsQuery())
}

export function useSalesJoined() {
  return useRead('sales', getSalesJoinedQuery())
}

export function useSaleTransactionsForSale(sale_id: number) {
  return useRead('transactions', getSaleTransactionsForSaleQuery(sale_id))
}

export function useVendorTotalSales(vendor_id: number) {
  return useRead('total sales', getSalesQuery())
  // SELECT
  //       sale_item.sale_id,
  //       sale_item.item_id,
  //       sale_item.quantity,
  //       sale_item.vendor_discount,
  //       sale_item.store_discount,
  //       stock_price.vendor_cut,
  //       stock_price.total_sell,
  //       stock_price.date_valid_from AS date_price_valid_from,
  //       sale.date_sale_opened,
  //       sale.date_sale_closed
  //     FROM sale_item
  //     LEFT JOIN sale
  //       ON sale.id = sale_item.sale_id
  //     LEFT JOIN stock_price
  //       ON stock_price.stock_id = sale_item.item_id
  //     WHERE sale_item.item_id IN
  //       (SELECT id FROM stock
  //         WHERE vendor_id = ?
  //       )
  //     AND stock_price.date_valid_from <= sale.date_sale_opened
  //     AND sale.state = 'completed'
  //     AND sale.is_deleted = 0
  //     AND sale_item.is_deleted = 0
}

export function useStocktakeTemplates() {
  return useRead('stocktake templates', getStocktakeTemplatesQuery())
}
