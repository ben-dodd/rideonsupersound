import { atom } from "jotai";

import {
  ClerkObject,
  SaleObject,
  CustomerObject,
  ConfirmModal,
} from "@/lib/types";

interface PaymentDialogProps {
  method?: string;
  totalRemaining?: number;
}

interface AlertProps {
  open: boolean;
  type?: "error" | "info" | "success" | "warning";
  message?: string;
  undo?: Function;
}

interface ViewProps {
  mainMenu?: boolean;
  cart?: boolean;
  createHold?: boolean;
  createCustomer?: boolean;
  closeRegisterScreen?: boolean;
  receiveStockScreen?: boolean;
  returnStockScreen?: boolean;
  changePriceDialog?: boolean;
  changeStockQuantityDialog?: boolean;
  helpDialog?: boolean;
  returnCashDialog?: boolean;
  takeCashDialog?: boolean;
  batchVendorPaymentDialog?: boolean;
  cashVendorPaymentDialog?: boolean;
  acctPaymentDialog?: boolean;
  cardPaymentDialog?: boolean;
  cashPaymentDialog?: boolean;
  giftPaymentDialog?: boolean;
  giftCardDialog?: boolean;
  miscItemDialog?: boolean;
  holdDialog?: boolean;
  labelPrintDialog?: boolean;
  loadSalesDialog?: boolean;
  refundPaymentDialog?: boolean;
  returnItemDialog?: boolean;
  splitSaleDialog?: boolean;
  saleScreen?: boolean;
  taskDialog?: boolean;
}

interface PageProps {
  sell?: number;
  inventory?: number;
  vendors?: number;
  holds?: number;
  giftCards?: number;
  sales?: number;
  laybys?: number;
  payments?: number;
  logs?: number;
}

export const viewAtom = atom<ViewProps>({});
export const clerkAtom = atom<ClerkObject>({ id: null });
export const pageAtom = atom<string>("sell");

export const cartAtom = atom<SaleObject>({});

export const loadedItemIdAtom = atom<PageProps>({});
export const loadedVendorIdAtom = atom<PageProps>({});
export const loadedHoldIdAtom = atom<PageProps>({});
export const loadedSaleIdAtom = atom<PageProps>({});

export const loadedCustomerObjectAtom = atom<CustomerObject>({});

export const createableCustomerName = atom<string>("");

export const sellSearchBarAtom = atom<string>("");
export const confirmModalAtom = atom<ConfirmModal>({ open: false });
export const alertAtom = atom<AlertProps>({ open: false });
