import { atom } from "jotai";

import { ClerkObject, CartObject } from "../../types";

export const clerkAtom = atom<ClerkObject>(null);
export const cartAtom = atom<CartObject>(null);
export const pageAtom = atom<string>("sell");
export const menuDisplayAtom = atom<boolean>(false);
export const showCartAtom = atom<boolean>(false);

// modals
export const sellModalAtom = atom(null);
export const sellSearchBarAtom = atom<string>("");
