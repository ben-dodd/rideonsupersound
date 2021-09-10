import { InventoryObject, SaleObject, SaleItemObject } from "@/lib/types";

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

export function getCartItemSummary(
  item: InventoryObject,
  cartItem: SaleItemObject
) {
  // 1 x V10% x R50% x $27.00
  return item?.is_gift_card
    ? item?.gift_card_code
    : item?.is_misc_item
    ? item?.misc_item_description
    : `${cartItem?.quantity}${
        cartItem?.vendor_discount > 0 ? ` x V${cartItem?.vendor_discount}%` : ""
      }${
        cartItem?.store_discount > 0 ? ` x S${cartItem?.store_discount}%` : ""
      } x $${(item?.total_sell / 100).toFixed(2)}`;
}

export function writeCartItemPriceBreakdown(
  item: InventoryObject,
  cartItem: SaleItemObject
) {
  return getCartItemSummary(item, cartItem);
}

export function writeCartItemPriceTotal(
  item: InventoryObject,
  cartItem: SaleItemObject
) {
  return item?.is_gift_card
    ? `$${(item?.gift_card_amount / 100).toFixed(2)}`
    : item?.is_misc_item
    ? `$${(item?.misc_item_amount / 100).toFixed(2)}`
    : `$${(getItemPrice(item, cartItem) / 100).toFixed(2)}`;
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

export function getItemPrice(item: InventoryObject, cartItem: SaleItemObject) {
  let vendorDiscountFactor = 100,
    storeDiscountFactor = 100;
  if (cartItem?.vendor_discount > 0)
    vendorDiscountFactor = 100 - cartItem?.vendor_discount;
  if (cartItem.store_discount > 0)
    storeDiscountFactor = 100 - cartItem?.store_discount;
  let storeCut =
    ((item?.total_sell - item?.vendor_cut) * storeDiscountFactor) / 100;
  let vendorCut = (item?.vendor_cut * vendorDiscountFactor) / 100;
  return (storeCut + vendorCut) * cartItem?.quantity;
}

export function getItemStoreCut(
  item: InventoryObject,
  cartItem: SaleItemObject
) {
  if (item?.is_gift_card || item?.is_misc_item) return 0;
  let storeDiscountFactor = 100;
  if (cartItem?.store_discount > 0)
    storeDiscountFactor = 100 - cartItem?.store_discount;
  return (
    (((item?.total_sell - item?.vendor_cut) * storeDiscountFactor) / 100) *
    cartItem?.quantity
  );
}

export function getTotalPrice(cart: SaleObject, inventory: InventoryObject[]) {
  let price = 0;
  (cart?.items || []).forEach((cartItem: SaleItemObject) => {
    // Misc Items and Gift Cards in inventory
    let item: InventoryObject = inventory.filter(
      (i: InventoryObject) => i?.id === cartItem?.item_id
    )[0];
    price += getItemPrice(item, cartItem);
  });
  return price ? parseFloat(price.toFixed(2)) : null;
}

export function getTotalStoreCut(
  cart: SaleObject,
  inventory: InventoryObject[]
) {
  return (cart?.items || []).reduce((acc, cartItem: SaleItemObject) => {
    let item: InventoryObject = inventory.filter(
      (i: InventoryObject) => i?.id === cartItem?.item_id
    )[0];
    return acc + getItemStoreCut(item, cartItem);
  }, 0);
}

export function getRemainingBalance(cart: SaleObject, totalPrice: number) {
  return totalPrice;
  // const transactions = cart?.transactions || {};
  // const totalTransactions = Object.values(transactions)
  //   .filter((transaction) => !transaction.deleted)
  //   .reduce((acc, transaction) => acc + get(transaction, "amount", 0), 0);
  // console.log(totalPrice);
  // console.log(totalTransactions);
  // return totalPrice - totalTransactions;
}

export function getGeolocation() {
  let geolocation = null;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      // console.log(position);
      geolocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
    });
  }
  return geolocation;
}
