import { ConfirmModal, CustomerObject, SaleObject, AlertProps } from 'lib/types'

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
  loadedCustomerObjectAtom?: CustomerObject
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
  toggleTableMode: () => void
  toggleCompactMode: () => void
  setLoadedStocktakeTemplateId: (id: number) => void
  setLoadedVendorId: (id: number) => void
  // setStockItems: (stockItems: StockItem[]) => void
  // addStockItems: (stockItems: StockItem[]) => void
  // fetchStockItems: () => void
  // getSelection: () => any[]
  // getSelectionAsText: () => string
  // setSchema: (schema: any) => void
  // setCell: (cellRef: number[], value: string) => void
  // setCellRange: (valueMatrix: any[][]) => void
  // clearCellRange: () => void
  // clickCell: (cellRef: number[], shiftKey: boolean) => void
  // selectByDrag: (evt: any) => void
  // selectByKeyboard: (evt: any) => void
  // clearSelection: () => void
  // setInitialWidthRatios: (widthRatios: number[]) => void
  // setWidthRatios: (index: number, widthOffset: number) => void
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
