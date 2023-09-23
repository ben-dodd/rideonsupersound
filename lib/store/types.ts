/* eslint-disable unused-imports/no-unused-vars */
import { ConfirmModal, AlertProps, ClippyProps } from 'lib/types'
import { CartObject, SaleItemObject, SaleTransactionObject } from 'lib/types/sale'
import { BatchReceiveObject } from 'lib/types/stock'
import { AccountPayment, BatchPaymentObject } from 'lib/types/vendor'

export interface StoreState {
  view: {
    mainMenu?: boolean
    cart?: boolean
    checkHoldsDialog?: boolean
    createHold?: boolean
    createLayby?: boolean
    createMailOrder?: boolean
    createCustomer?: boolean
    closeRegisterScreen?: boolean
    receiveStockScreen?: boolean
    returnStockScreen?: boolean
    stockEditDialog?: boolean
    changePriceDialog?: boolean
    changeStockQuantityDialog?: boolean
    helpDialog?: boolean
    returnCashDialog?: boolean
    takeCashDialog?: boolean
    batchVendorPaymentDialog?: boolean
    batchVendorPaymentScreen?: boolean
    transferVendorPaymentDialog?: boolean
    cashVendorPaymentDialog?: boolean
    acctPaymentDialog?: boolean
    cardPaymentDialog?: boolean
    cashPaymentDialog?: boolean
    giftPaymentDialog?: boolean
    giftCardDialog?: boolean
    miscItemDialog?: boolean
    holdDialog?: boolean
    labelPrintDialog?: boolean
    loadSalesDialog?: boolean
    refundPaymentDialog?: boolean
    returnItemDialog?: boolean
    splitSaleDialog?: boolean
    saleScreen?: boolean
    taskDialog?: boolean
    stocktakeScreen?: boolean
    stocktakeTemplateScreen?: boolean
    stocktakeTemplateSetupDialog?: boolean
    exportVendorReportDialog?: boolean
    vendorEditDialog?: boolean
  }
  confirmModal?: ConfirmModal
  alert?: AlertProps
  clippy?: ClippyProps
  createableCustomerName?: string
  cart: CartObject
  batchReceiveSession?: BatchReceiveObject
  batchPaymentSession?: BatchPaymentObject
  sellPage?: {
    searchBar?: string
    isSearching?: boolean
    activeItemId?: number
  }
  ordersPage?: {
    tab?: number
  }
  stockPage?: {
    tab?: number
    searchBar?: string
  }
  vendorsPage?: any
  paymentsPage?: any
  registersPage?: any
  salesPage?: {
    tab?: number
    returnToCartDialog?: any
  }
  salesListPage?: {
    searchBar?: string
  }
  salesCalendarPage?: {
    viewPeriod?: string
    rangeStartDate?: string
    rangeEndDate?: string
    clerkIds?: number[]
    viewLaybysOnly?: boolean
  }
  parkedSalesPage?: any
  laybysPage?: any
  holdsPage?: {
    searchBar?: string
    loadedHold?: number
  }
  saleStatsPage?: any
  giftCardsPage?: {
    searchBar?: string
    loadedGiftCard?: number
  }
  logsPage?: any
  jobsPage?: any
  stocktakesPage?: any
  options?: {
    doBypassRegister?: boolean
  }
  openView: (view: ViewProps) => void
  closeView: (view: ViewProps) => void
  openConfirm: (confirm: any) => void
  closeConfirm: () => void
  setAlert: (alert: any) => void
  closeAlert: () => void
  setCreateableCustomerName: (name: string) => void
  setCart: (update: any) => void
  loadSaleToCartById: (saleId: number) => void
  loadSaleToCart: (sale: CartObject) => void
  mutateCart: (mutates?: string[]) => void
  addCartTransaction: (transaction: SaleTransactionObject) => void
  deleteCartTransaction: (transaction: SaleTransactionObject) => void
  addCartItem: (newItem: SaleItemObject, clerkId: number, replacePrevious?: boolean, alertMessage?: string) => void
  setCartItem: (id: number, update: any) => void
  setCartSale: (update: any, doMutate?: boolean) => void
  setClippy: (update: any) => void
  setBatchReceiveSession: (update: any) => void
  loadBatchReceiveSession: (session: BatchReceiveObject) => void
  addBatchReceiveItem: (newItem: any) => void
  updateBatchReceiveItem: (key: any, update: any) => void
  updateBatchReceiveItemField: (index: number, objName: string, fieldName: string, newValue: any) => void
  setBatchPaymentSession: (update: any) => void
  setBatchPaymentList: (list: AccountPayment[]) => void
  setBatchAccountPayment: (vendorId: number, update: any) => void
  resetBatchPaymentSession: () => void
  resetCart: () => void
  resetBatchReceiveSession: () => void
  resetCustomer: () => void
  setSearchBar: (page: Pages, val: string) => void
  setPage: (page: Pages, update: any) => void
  togglePageOption: (page: Pages, option: string) => void
  resetSearchBar: (page: Pages) => void
  resetPage: (page: Pages) => void
  setOption: (option: string, value: any) => void
}

export enum ViewProps {
  mainMenu = 'mainMenu',
  cart = 'cart',
  checkHoldsDialog = 'checkHoldsDialog',
  createHold = 'createHold',
  createLayby = 'createLayby',
  createMailOrder = 'createMailOrder',
  createCustomer = 'createCustomer',
  closeRegisterScreen = 'closeRegisterScreen',
  receiveStockScreen = 'receiveStockScreen',
  returnStockScreen = 'returnStockScreen',
  stockEditDialog = 'stockEditDialog',
  changePriceDialog = 'changePriceDialog',
  changeStockQuantityDialog = 'changeStockQuantityDialog',
  helpDialog = 'helpDialog',
  returnCashDialog = 'returnCashDialog',
  takeCashDialog = 'takeCashDialog',
  batchVendorPaymentDialog = 'batchVendorPaymentDialog',
  batchVendorPaymentScreen = 'batchVendorPaymentScreen',
  transferVendorPaymentDialog = 'transferVendorPaymentDialog',
  cashVendorPaymentDialog = 'cashVendorPaymentDialog',
  acctPaymentDialog = 'acctPaymentDialog',
  cardPaymentDialog = 'cardPaymentDialog',
  cashPaymentDialog = 'cashPaymentDialog',
  giftPaymentDialog = 'giftPaymentDialog',
  giftCardDialog = 'giftCardDialog',
  miscItemDialog = 'miscItemDialog',
  holdDialog = 'holdDialog',
  labelPrintDialog = 'labelPrintDialog',
  loadSalesDialog = 'loadSalesDialog',
  refundPaymentDialog = 'refundPaymentDialog',
  returnItemDialog = 'returnItemDialog',
  splitSaleDialog = 'splitSaleDialog',
  saleScreen = 'saleScreen',
  taskDialog = 'taskDialog',
  stocktakeScreen = 'stocktakeScreen',
  stocktakeTemplateScreen = 'stocktakeTemplateScreen',
  stocktakeTemplateSetupDialog = 'stocktakeTemplateSetupDialog',
  exportVendorReportDialog = 'exportVendorReportDialog',
  vendorEditDialog = 'vendorEditDialog',
}

export enum Pages {
  sellPage = 'sellPage',
  stockPage = 'stockPage',
  vendorsPage = 'vendorsPage',
  paymentsPage = 'paymentsPage',
  registersPage = 'registersPage',
  salesPage = 'salesPage',
  salesListPage = 'salesListPage',
  salesCalendarPage = 'salesCalendarPage',
  parkedSalesPage = 'parkedSalesPage',
  laybysPage = 'laybysPage',
  holdsPage = 'holdsPage',
  saleStatsPage = 'saleStatsPage',
  ordersPage = 'ordersPage',
  giftCardsPage = 'giftCardsPage',
  logsPage = 'logsPage',
  jobsPage = 'jobsPage',
  stocktakesPage = 'stocktakesPage',
}
