import { atom } from "jotai";

import { ClerkObject, SaleObject, ContactObject, Modal } from "@/lib/types";

export const clerkAtom = atom<ClerkObject>({ id: null });
export const cartAtom = atom<SaleObject>({ id: null, items: [] });
export const pageAtom = atom<string>("sell");
export const menuDisplayAtom = atom<boolean>(false);
export const showCartAtom = atom<boolean>(false);
export const showHoldAtom = atom<boolean>(false);
export const showCreateContactAtom = atom<ContactObject>({ id: null });
export const showSaleScreenAtom = atom<boolean>(false);

// modals
export const sellModalAtom = atom<Modal>({ open: false });
export const sellSearchBarAtom = atom<string>("");
export const paymentDialogAtom = atom<string>("");
