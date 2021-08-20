import { InventoryObject, CartObject, CartItem } from "@/lib/types";

export function getItemSku(item: InventoryObject) {
  return `${("000" + item?.vendor_id || "").slice(-3)}/${(
    "00000" + item?.id || ""
  ).slice(-5)}`;
}

export function getItemTitle(item: InventoryObject) {
  // Add special cases e.g. for comics
  // Might be better as a span component
  return `${item?.title || ""}${item?.title && item?.artist ? " - " : ""}${
    item?.artist || ""
  }`;
}

export function getCartItemSummary(item: InventoryObject, cartItem: CartItem) {
  // 1 x V10% x R50% x $27.00
  return `${cartItem?.cart_quantity}${
    cartItem?.vendor_discount > 0 ? ` x V${cartItem?.vendor_discount}%` : ""
  }${
    cartItem?.store_discount > 0 ? ` x S${cartItem?.store_discount}%` : ""
  } x $${(item?.total_sell / 100).toFixed(2)}`;
}

export function filterInventory({ inventory, search }) {
  return inventory
    ?.sort((a: InventoryObject, b: InventoryObject) => {
      if (a?.quantity === b?.quantity) return 0;
      if (a?.quantity < 1) return 1;
      if (b?.quantity < 1) return -1;
      return 0;
    })
    .filter((item: InventoryObject) => {
      let res = true;
      if (!search || search === "") return false;

      if (search) {
        let terms = search.split(" ");
        let itemMatch = `
          ${item?.sku || ""}
          ${item?.artist || ""}
          ${item?.title || ""}
          ${item?.format || ""}
          ${item?.genre || ""}
          ${item?.country || ""}
          ${item?.section || ""}
          ${item?.tags ? item?.tags?.join(" ") : ""}
          ${item?.vendor_name || ""}
          ${item?.googleBooksItem?.volumeInfo?.authors?.join(" ") || ""}
          ${item?.googleBooksItem?.volumeInfo?.publisher || ""}
          ${item?.googleBooksItem?.volumeInfo?.subtitle || ""}
          ${item?.googleBooksItem?.volumeInfo?.categories?.join(" ") || ""}
        `;
        terms.forEach((term: string) => {
          if (!itemMatch.toLowerCase().includes(term.toLowerCase()))
            res = false;
        });
      }

      return res;
    })
    .slice(0, 50);
}

export function getItemPrice(item: InventoryObject, cartItem: CartItem) {
  let vendorDiscountFactor = 100,
    storeDiscountFactor = 100;
  if (cartItem?.vendor_discount > 0)
    vendorDiscountFactor = 100 - cartItem?.vendor_discount;
  if (cartItem.store_discount > 0)
    storeDiscountFactor = 100 - cartItem?.store_discount;
  let storeCut =
    ((item?.total_sell - item?.vendor_cut) * storeDiscountFactor) / 100;
  let vendorCut = (item?.vendor_cut * vendorDiscountFactor) / 100;
  return (storeCut + vendorCut) * cartItem?.cart_quantity;
}

export function getItemStoreCut(item: InventoryObject, cartItem: CartItem) {
  let storeDiscountFactor = 100;
  if (cartItem?.store_discount > 0)
    storeDiscountFactor = 100 - cartItem?.store_discount;
  return (
    (((item?.total_sell - item?.vendor_cut) * storeDiscountFactor) / 100) *
    cartItem?.cart_quantity
  );
}

export function getTotalPrice(cart: CartObject, inventory: InventoryObject[]) {
  let price = 0;
  Object.entries(cart?.items || {}).forEach(
    ([id, cartItem]: [string, CartItem]) => {
      console.log(id);
      if (cartItem?.is_gift_card) price += cartItem?.gift_card_amount;
      else if (cartItem?.is_misc_item) price += cartItem?.misc_item_amount;
      else {
        let item: InventoryObject = inventory.filter(
          (i: InventoryObject) => i?.id === parseInt(id)
        )[0];
        price += getItemPrice(item, cartItem);
      }
    }
  );
  return price ? parseFloat(price.toFixed(2)) : null;
}

export function getTotalStoreCut(
  cart: CartObject,
  inventory: InventoryObject[]
) {
  return Object.entries(cart?.items || {})
    .filter(
      ([, cartItem]: [string, CartItem]) =>
        !cartItem?.is_gift_card && !cartItem?.is_misc_item
    )
    .reduce((acc, [id, cartItem]: [string, CartItem]) => {
      let item = inventory[id];
      return acc + getItemStoreCut(item, cartItem);
    }, 0);
}
