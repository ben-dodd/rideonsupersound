import axios from 'axios'

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
  getSaleWithItemsQuery,
  getSelectQuery,
  getStockMovementByStockIdQuery,
  getStockMovementsQuery,
  getStocktakeItemsByStocktakeQuery,
  getStocktakesByTemplateQuery,
  getVendorFromVendorPaymentQuery,
  getVendorNamesQuery,
  getVendorPaymentsQuery,
  getVendorsQuery,
  getVendorTotalPaymentsQuery,
} from './read-query'

async function fetcher(url: string) {
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
  const getAll = Promise.all([getSale, getSaleItems, getSaleTransactions])
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

export function useStockMovements(limit) {
  return useRead('stock movements', getStockMovementsQuery(limit))
}

export function useStockMovementByStockId(id) {
  return useRead(
    'stock-movements-by-stock-id',
    getStockMovementByStockIdQuery(id)
  )
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
