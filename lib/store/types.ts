/* eslint-disable unused-imports/no-unused-vars */
import { ConfirmModal, AlertProps } from 'lib/types'
import { CartObject, SaleItemObject, SaleTransactionObject } from 'lib/types/sale'

export interface StoreState {
  view: {
    mainMenu?: boolean
    cart?: boolean
    createHold?: boolean
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
  }
  cart: CartObject
  loadedItemId?: any
  loadedVendorId?: any
  loadedHoldId?: any
  loadedSaleId?: any
  loadedStocktakeId?: number
  loadedStocktakeTemplateId?: number
  createableCustomerName?: string
  sellSearchBar?: string
  sellIsSearching?: boolean
  confirmModal?: ConfirmModal
  alert?: AlertProps
  receiveBasket?: {
    items: any[]
    clerkId?: number
    registerId?: number
    vendorId?: number
  }
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
  setSellSearchBar: (val: string) => void
  toggleSellSearchingOff: () => void
  setCart: (update: any) => void
  mutateCart: (mutates?: string[]) => void
  addCartTransaction: (transaction: SaleTransactionObject) => void
  addCartItem: (newItem: SaleItemObject, clerkId: number) => void
  setCartItem: (id: number, update: any) => void
  setCartSale: (update: any) => void
  setCustomer: (update: any) => void
  setReceiveBasket: (update: any) => void
  addReceiveBasketItem: (newItem: any) => void
  updateReceiveBasketItem: (key: any, update: any) => void
  resetCart: () => void
  resetReceiveBasket: () => void
  resetCustomer: () => void
  resetSellSearchBar: () => void
  toggleTableMode: () => void
  toggleCompactMode: () => void
  toggleBypassRegister: () => void
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
}
