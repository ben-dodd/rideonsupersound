import { atom } from "jotai";

import {
  ClerkObject,
  SaleObject,
  ContactObject,
  ConfirmModal,
} from "@/lib/types";

interface PaymentDialogProps {
  method?: string;
  remainingBalance?: number;
}

interface AlertProps {
  open: boolean;
  type?: "error" | "info" | "success" | "warning";
  message?: string;
  undo?: Function;
}

interface ViewProps {
  menu?: boolean;
  cart?: boolean;
  createHold?: boolean;
  createContact?: boolean;
  saleScreen?: boolean;
  itemScreen?: boolean;
  vendorScreen?: boolean;
  returnCashDialog?: boolean;
  takeCashDialog?: boolean;
  closeRegisterScreen?: boolean;
  batchVendorPaymentDialog?: boolean;
  cashVendorPaymentDialog?: boolean;
  receiveStockScreen?: boolean;
  returnStockScreen?: boolean;
  acctPaymentDialog?: boolean;
  cardPaymentDialog?: boolean;
  cashPaymentDialog?: boolean;
  giftPaymentDialog?: boolean;
  holdDialog?: boolean;
  labelPrintDialog?: boolean;
}

export const viewAtom = atom<ViewProps>({});
export const clerkAtom = atom<ClerkObject>({ id: null });
export const pageAtom = atom<string>("sell");

export const cartAtom = atom<SaleObject>({ id: null, items: [] });
export const newSaleObjectAtom = atom<SaleObject>({});
export const loadedSaleObjectAtom = atom<SaleObject>({});
export const saleAtom = atom<SaleObject>({ id: null, items: [] });

export const loadedItemIdAtom = atom<number>(0);
export const loadedVendorIdAtom = atom<number>(0);
export const loadedHoldIdAtom = atom<number>(0);
export const loadedContactObjectAtom = atom<ContactObject>({});

export const sellSearchBarAtom = atom<string>("");
export const confirmModalAtom = atom<ConfirmModal>({ open: false });
export const alertAtom = atom<AlertProps>({ open: false });
