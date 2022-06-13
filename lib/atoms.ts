import { atom } from 'jotai'

import {
  ClerkObject,
  SaleObject,
  CustomerObject,
  ConfirmModal,
  StocktakeTemplateObject,
  StocktakeObject,
} from '@/lib/types'
import dayjs from 'dayjs'

interface PaymentDialogProps {
  method?: string
  totalRemaining?: number
}

interface AlertProps {
  open: boolean
  type?: 'error' | 'info' | 'success' | 'warning'
  message?: string
  undo?: Function
}

interface ViewProps {
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

interface PageProps {
  sell?: number
  inventory?: number
  vendors?: number
  holds?: number
  giftCards?: number
  sales?: number
  laybys?: number
  payments?: number
  logs?: number
  stocktake?: number
}

export const viewAtom = atom<ViewProps>({})
export const clerkAtom = atom<ClerkObject>({ id: null })
export const pageAtom = atom<string>('sell')
export const tableModeAtom = atom<boolean>(true)

export const cartAtom = atom<SaleObject>({})

export const loadedItemIdAtom = atom<PageProps>({})
export const loadedVendorIdAtom = atom<PageProps>({})
export const loadedHoldIdAtom = atom<PageProps>({})
export const loadedSaleIdAtom = atom<PageProps>({})
export const loadedStocktakeIdAtom = atom<number>(0)
export const loadedStocktakeTemplateIdAtom = atom<number>(0)

export const loadedCustomerObjectAtom = atom<CustomerObject>({})

export const createableCustomerName = atom<string>('')

export const sellSearchBarAtom = atom<string>('')
export const confirmModalAtom = atom<ConfirmModal>({ open: false })
export const alertAtom = atom<AlertProps>({ open: false })

export const receiveStockAtom = atom<any>({})
export const bypassRegisterAtom = atom<boolean>(false)

export const salesViewAtom = atom<string>('day')
export const salesViewRangeAtom = atom<any>({
  startDate: dayjs().startOf('week').format('YYYY-MM-DD'),
  endDate: dayjs().format('YYYY-MM-DD'),
})
export const salesViewClerksAtom = atom<number[]>([])
