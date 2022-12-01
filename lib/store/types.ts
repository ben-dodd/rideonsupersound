import {
  ConfirmModal,
  SaleObject,
  AlertProps,
  SaleTransactionObject,
  SaleItemObject,
} from 'lib/types'

export interface StoreState {
  view: {
    mainMenu?: boolean
    cart?: boolean
    createHold?: boolean
    createCustomer?: boolean
    closeRegisterScreen?: boolean
    receiveStockScreen?: boolean
    returnStockScreen?: boolean
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
  }
  cart: SaleObject
  loadedItemId?: any
  loadedVendorId?: any
  loadedHoldId?: any
  loadedSaleId?: any
  loadedStocktakeId?: number
  loadedStocktakeTemplateId?: number
  createableCustomerName?: string
  sellSearchBar?: string
  confirmModal?: ConfirmModal
  alert?: AlertProps
  receiveStock?: any
  bypassRegister?: boolean
  salesView?: string
  salesViewRange?: any
  salesViewClerks?: number[]
  tableMode?: boolean
  compactMode?: boolean
  openView: (view: ViewProps) => void
  closeView: (view: ViewProps) => void
  openConfirm: (confirm: any) => void
  closeConfirm: () => void
  setAlert: (alert: any) => void
  closeAlert: () => void
  setCart: (update: any) => void
  addCartTransaction: (transaction: SaleTransactionObject) => void
  addCartItem: (newItem: SaleItemObject) => void
  setCartItem: (id: number, update: any) => void
  setCustomer: (update: any) => void
  resetCart: () => void
  resetCustomer: () => void
  resetSellSearchBar: () => void
  toggleTableMode: () => void
  toggleCompactMode: () => void
  setLoadedStocktakeTemplateId: (id: number) => void
  setLoadedVendorId: (id: number) => void
}

export enum ViewProps {
  mainMenu = 'mainMenu',
  cart = 'cart',
  createHold = 'createHold',
  createCustomer = 'createCustomer',
  closeRegisterScreen = 'closeRegisterScreen',
  receiveStockScreen = 'receiveStockScreen',
  returnStockScreen = 'returnStockScreen',
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
}
