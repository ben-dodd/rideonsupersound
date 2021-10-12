import { atom } from "jotai";

import { ClerkObject, SaleObject, ContactObject, Modal } from "@/lib/types";

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

export const clerkAtom = atom<ClerkObject>({ id: null });
export const pageAtom = atom<string>("sell");
export const menuDisplayAtom = atom<boolean>(false);
export const showCartAtom = atom<boolean>(false);
export const showHoldAtom = atom<boolean>(false);
export const showCreateContactAtom = atom<ContactObject>({ id: null });
export const showCartScreenAtom = atom<boolean>(false);
export const cartAtom = atom<SaleObject>({ id: null, items: [] });
export const showSaleScreenAtom = atom<boolean>(false);
export const saleAtom = atom<SaleObject>({ id: null, items: [] });
export const showItemScreenAtom = atom<number>(0);
export const showVendorScreenAtom = atom<number>(0);
export const pettyCashAtom = atom<number>(0);
export const showCloseRegisterScreenAtom = atom<boolean>(false);
export const showBatchPaymentDialogAtom = atom<boolean>(false);
export const showCashPaymentDialogAtom = atom<boolean>(false);
export const showReceiveItemsScreenAtom = atom<boolean>(false);
export const showReturnItemsScreenAtom = atom<boolean>(false);
export const showPrintLabelsDialogAtom = atom<boolean>(false);
export const showReceiveStockScreenAtom = atom<boolean>(false);
export const showReturnStockScreenAtom = atom<boolean>(false);

// modals
export const sellModalAtom = atom<Modal>({ open: false });
export const sellSearchBarAtom = atom<string>("");
export const paymentDialogAtom = atom<PaymentDialogProps>({});
export const showHoldDialogAtom = atom<number>(0);
export const showLabelPrintDialogAtom = atom<boolean>(false);
export const confirmModalAtom = atom<Modal>({ open: false });
export const alertAtom = atom<AlertProps>({ open: false });
