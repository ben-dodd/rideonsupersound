import {
  StockObject,
  SaleItemObject,
  SaleTransactionObject,
  KiwiBankTransactionObject,
  TillObject,
  VendorObject,
  VendorSaleItemObject,
  VendorPaymentObject,
  DiscogsItem,
  GoogleBooksItem,
  HelpObject,
  GiftCardObject,
  SaleObject,
} from "@/lib/types";

import dayjs from "dayjs";
import { AnyCnameRecord } from "dns";

export function getItemSku(item: StockObject) {
  return `${("000" + item?.vendor_id || "").slice(-3)}/${(
    "00000" + item?.id || ""
  ).slice(-5)}`;
}

export function getItemDisplayName(item: StockObject | GiftCardObject) {
  // Add special cases e.g. for comics
  // Might be better as a span component
  if (item?.is_gift_card)
    return `Gift Card [${item?.gift_card_code?.toUpperCase()}]`;
  let inventoryItem: any = item;
  if (inventoryItem?.is_misc_item) return inventoryItem?.misc_item_description;
  if (inventoryItem?.display_as) return inventoryItem?.display_as;
  if (!inventoryItem || !(inventoryItem?.artist || inventoryItem?.title))
    return "Untitled";
  return `${inventoryItem?.title || ""}${
    inventoryItem?.title && inventoryItem?.artist ? " - " : ""
  }${inventoryItem?.artist || ""}`;
}

export function getItemSkuDisplayNameById(
  item_id: number,
  inventory: StockObject[]
) {
  let item = inventory?.filter((i) => i?.id === item_id)[0];
  return `[${getItemSku(item)}] ${getItemDisplayName(item)}`;
}

export function getItemSkuDisplayName(item: StockObject) {
  return `[${getItemSku(item)}] ${getItemDisplayName(item)}`;
}

export function getImageSrc(item: StockObject) {
  let src = "default";
  if (item?.image_url) return item.image_url;
  if (item?.is_gift_card) src = "giftCard";
  if (item?.format === "Zine") src = "zine";
  else if (item?.format === "Comics") src = "comic";
  else if (item?.format === "Book") src = "book";
  else if (item?.format === '7"') src = "7inch";
  else if (item?.format === '10"') src = "10inch";
  else if (item?.format === "LP") src = "LP";
  else if (item?.format === "CD") src = "CD";
  else if (item?.format === "Cassette") src = "cassette";
  else if (item?.format === "Badge") src = "badge";
  else if (item?.format === "Shirt") src = "shirt";
  return `${process.env.NEXT_PUBLIC_RESOURCE_URL}img/${src}.png`;
}

export function getCartItemSummary(item: StockObject, cartItem: any) {
  // 1 x V10% x R50% x $27.00
  return item?.is_gift_card
    ? `$${(item?.gift_card_amount / 100)?.toFixed(2)} GIFT CARD`
    : item?.is_misc_item
    ? `${cartItem?.quantity} x $${(item?.misc_item_amount / 100).toFixed(2)}`
    : `${cartItem?.quantity}${
        parseInt(cartItem?.vendor_discount) > 0
          ? ` x V${cartItem?.vendor_discount}%`
          : ""
      }${
        parseInt(cartItem?.store_discount) > 0
          ? ` x S${cartItem?.store_discount}%`
          : ""
      } x $${((cartItem?.total_sell || item?.total_sell) / 100)?.toFixed(2)}`;
}

export function writeCartItemPriceBreakdown(
  item: StockObject,
  cartItem: SaleItemObject
) {
  return getCartItemSummary(item, cartItem);
}

export function writeCartItemPriceTotal(
  item: StockObject,
  cartItem: SaleItemObject
) {
  return item?.is_gift_card
    ? `$${(item?.gift_card_amount / 100)?.toFixed(2)}`
    : item?.is_misc_item
    ? `$${(item?.misc_item_amount / 100)?.toFixed(2)}`
    : `$${(getItemPrice(item, cartItem) / 100)?.toFixed(2)}`;
}

export function filterInventory({ inventory, search }) {
  if (!inventory) return [];
  return inventory
    .filter((item: StockObject) => {
      let res = true;
      if (!search || search === "") return false;

      if (search) {
        let terms = search.split(" ");
        let itemMatch = `
        ${getItemSku(item) || ""}
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
  // ?.sort((a: StockObject, b: StockObject) => {
  //   if (!a?.quantity || !b?.quantity) return 0;
  //   if (a?.quantity === b?.quantity) return 0;
  //   if (a?.quantity < 1) return 1;
  //   if (b?.quantity < 1) return -1;
  //   return 0;
  // })
}

export function filterHelps(
  helps: HelpObject[],
  page: string,
  view: Object,
  search: string
) {
  if (!helps) return [];
  // REVIEW make search order by relevance with page or view
  // if (!search || search === "") {
  //   return helps.filter((help: HelpObject) => {
  //     let res = false;
  //     let helpMatch = `${
  //       help?.pages?.toLowerCase() || ""
  //     } ${help?.views?.toLowerCase()}`;
  //     if (helpMatch?.includes(page?.toLowerCase())) res = true;
  //     Object.entries(view)
  //       ?.filter(([k, v]) => v)
  //       ?.forEach(([k, v]) => {
  //         if (helpMatch?.includes(k?.toLowerCase())) res = true;
  //       });
  //     return res;
  //   });
  // } else {
  if (search)
    return helps.filter((help: HelpObject) => {
      let res = false;
      let terms = search.split(" ");
      let helpMatch = `${
        help?.tags?.toLowerCase() || ""
      } ${help?.title?.toLowerCase()}`;
      terms.forEach((term: string) => {
        if (helpMatch?.includes(term.toLowerCase())) res = true;
      });
      return res;
    });
  else return helps;
  // .slice(0, 50);
  // }
  // ?.sort((a: StockObject, b: StockObject) => {
  //   if (!a?.quantity || !b?.quantity) return 0;
  //   if (a?.quantity === b?.quantity) return 0;
  //   if (a?.quantity < 1) return 1;
  //   if (b?.quantity < 1) return -1;
  //   return 0;
  // })
}

export function applyDiscount(price, discount) {
  let discountFactor = 100 - parseInt(`${discount || 0}`);
  console.log(discountFactor);
  console.log(price);
  console.log(parseInt(`${price}`));
  return parseInt(`${price}`) * discountFactor;
}

export function getItemPrice(item: StockObject, cartItem: SaleItemObject) {
  let vendorDiscountFactor = 100,
    storeDiscountFactor = 100;
  if (parseInt(cartItem?.vendor_discount) > 0)
    vendorDiscountFactor = 100 - parseInt(cartItem?.vendor_discount);
  if (parseInt(cartItem.store_discount) > 0)
    storeDiscountFactor = 100 - parseInt(cartItem?.store_discount);
  let storeCut =
    ((item?.total_sell - item?.vendor_cut) * storeDiscountFactor) / 100;
  let vendorCut = (item?.vendor_cut * vendorDiscountFactor) / 100;
  return (storeCut + vendorCut) * parseInt(cartItem?.quantity);
}

export function getItemStoreCut(item: StockObject, cartItem: SaleItemObject) {
  if (item?.is_gift_card || item?.is_misc_item) return 0;
  let storeDiscountFactor = 100;
  if (parseInt(cartItem?.store_discount) > 0)
    storeDiscountFactor = 100 - parseInt(cartItem?.store_discount);
  return (
    (((item?.total_sell - item?.vendor_cut) * storeDiscountFactor) / 100) *
    parseInt(cartItem?.quantity)
  );
}

export function getStoreCut(item: StockObject) {
  if (!item?.total_sell || !item?.vendor_cut) return 0;
  return item?.total_sell - item?.vendor_cut;
}

export function getSaleVars(sale: any, inventory: StockObject[]) {
  const totalPostage = parseFloat(`${sale?.postage}`) || 0;
  const totalVendorCut =
    sale?.items?.reduce((prev, curr) => {
      const stockItem = inventory?.filter((i) => i?.id === curr?.item_id)[0];
      return (
        (curr?.quantity *
          applyDiscount(stockItem?.vendor_cut, curr?.vendor_discount)) /
          100 +
        prev
      );
    }, 0) / 100;
  const totalStoreCut =
    sale?.items?.reduce((prev, curr) => {
      const stockItem = inventory?.filter((i) => i?.id === curr?.item_id)[0];
      return (
        (curr?.quantity *
          applyDiscount(
            stockItem?.total_sell - stockItem?.vendor_cut,
            curr?.store_discount
          )) /
          100 +
        prev
      );
    }, 0) / 100;
  const totalItemPrice =
    Math.round((totalVendorCut + totalStoreCut + Number.EPSILON) * 10) / 10;
  const totalPrice = totalItemPrice + totalPostage;
  const totalPaid =
    Math.round((getTotalPaid(sale?.transactions) / 100 + Number.EPSILON) * 10) /
    10;
  const totalRemaining =
    Math.round((totalPrice - totalPaid + Number.EPSILON) * 10) / 10;
  return {
    totalItemPrice,
    totalPrice,
    totalPostage,
    totalPaid,
    totalStoreCut,
    totalVendorCut,
    totalRemaining,
    numberOfItems: sale?.items
      ?.filter((item) => !item.is_refunded && !item?.is_deleted)
      ?.reduce((acc, item) => acc + parseInt(item?.quantity), 0),
    itemList: writeItemList(inventory, sale?.items),
  };
}

export function getVendorDetails(
  inventory: StockObject[],
  vendorSales: VendorSaleItemObject[],
  vendorPayments: VendorPaymentObject[],
  vendor_id: number,
  cart?: SaleObject
) {
  if (vendor_id < 0) return {};
  let totalItems = inventory?.filter(
    (i: StockObject) => i?.vendor_id === vendor_id
  );

  let totalSales = vendorSales?.filter(
    (v: VendorSaleItemObject) =>
      totalItems?.filter((i: StockObject) => i?.id === v?.item_id)[0]
  );
  let totalPayments = vendorPayments?.filter(
    (v: VendorPaymentObject) => v?.vendor_id === vendor_id
  );

  if (cart) {
    let cartPayments: VendorPaymentObject[] =
      cart?.transactions
        ?.filter((t: SaleTransactionObject) => t?.vendor?.id === vendor_id)
        ?.map((t: SaleTransactionObject) => ({ amount: t?.amount })) || [];
    totalPayments = [...totalPayments, ...cartPayments];
  }

  const totalPaid = totalPayments?.reduce(
    (acc: number, payment: VendorPaymentObject) => acc + payment?.amount,
    0
  );

  const totalStoreCut = totalSales?.reduce(
    (acc: number, sale: VendorSaleItemObject) =>
      acc +
      sale?.quantity *
        (sale?.total_sell - sale?.vendor_cut) *
        (1 - (sale?.store_discount || 0) / 100),
    0
  );

  const totalSell: any = totalSales?.reduce(
    (acc: number, sale: VendorSaleItemObject) =>
      acc +
      sale?.quantity *
        sale?.vendor_cut *
        (1 - (sale?.vendor_discount || 0) / 100),
    0
  );

  let lastPaid = latestDate(
    totalPayments?.map((p: VendorPaymentObject) => p?.date)
  );
  let lastSold = latestDate(
    totalSales?.map((s: VendorSaleItemObject) => s?.date_sale_closed)
  );
  let totalOwing = totalSell - totalPaid;

  return {
    totalItems,
    totalSales,
    totalSell,
    totalPayments,
    totalPaid,
    lastPaid,
    totalOwing,
    lastSold,
    totalStoreCut,
  };
}

export function getPriceSuggestion(item: StockObject) {
  if (item?.discogsItem?.priceSuggestions) {
    const priceSuggestions = item?.discogsItem?.priceSuggestions;
    const priceSuggestion = priceSuggestions[
      item?.is_new ? "Mint (M)" : item?.cond || "Good (G)"
    ]?.value
      ? `$${parseFloat(
          priceSuggestions[item?.is_new ? "Mint (M)" : item?.cond || "Good (G)"]
            ?.value
        )?.toFixed(2)} NZD (${
          item?.is_new ? "Mint (M)" : item?.cond || "Good (G)"
        } condition)`
      : null;
    return priceSuggestion;
  }
  return null;
}

export function getVendorQuantityInStock(
  inventory: StockObject[],
  vendor_id: number
) {
  return getVendorItemsInStock(inventory, vendor_id)?.reduce(
    (sum, item) => (item?.quantity || 0) + sum,
    0
  );
}

export function getVendorItemsInStock(
  inventory: StockObject[],
  vendor_id: number
) {
  return inventory?.filter((i: StockObject) => i?.vendor_id === vendor_id);
}

export function getItemQuantity(
  item: StockObject,
  saleItems: SaleItemObject[]
) {
  const saleItem = saleItems?.filter(
    (i: SaleItemObject) => i?.item_id === item?.id
  )[0];
  const cartQuantity = saleItem?.quantity || "0";
  const itemQuantity = item?.quantity || 0;
  return itemQuantity - parseInt(cartQuantity);
}

export function getTotalPrice(
  saleItems: SaleItemObject[],
  inventory: StockObject[]
) {
  if (!saleItems) return 0;
  return saleItems?.reduce((acc, saleItem) => {
    if (saleItem?.is_refunded) return acc;
    // Misc Items and Gift Cards in inventory
    let item: StockObject = inventory?.filter(
      (i: StockObject) => i?.id === saleItem?.item_id
    )[0];
    if (item?.is_gift_card) return acc + item?.gift_card_amount;
    if (item?.is_misc_item) return acc + item?.misc_item_amount;
    return (acc += getItemPrice(item, saleItem));
  }, 0);
}

export function getTotalStoreCut(
  saleItems: SaleItemObject[],
  inventory: StockObject[]
) {
  return saleItems?.reduce((acc, saleItem: SaleItemObject) => {
    if (saleItem?.is_refunded) return acc;
    let item: StockObject = inventory?.filter(
      (i: StockObject) => i?.id === saleItem?.item_id
    )[0];
    if (item?.is_gift_card) return acc + item?.gift_card_amount;
    if (item?.is_misc_item) return acc + item?.misc_item_amount;
    return acc + getItemStoreCut(item, saleItem);
  }, 0);
}

export function getTotalPaid(saleTransactions: SaleTransactionObject[]) {
  if (!saleTransactions) return 0;
  return saleTransactions
    ?.filter((transaction) => !transaction.is_deleted)
    ?.reduce((acc, transaction) => acc + transaction?.amount, 0);
}

export function getTotalOwing(
  totalPayments: VendorPaymentObject[],
  totalSales: VendorSaleItemObject[]
) {
  const totalPaid = totalPayments?.reduce(
    (acc: number, payment: VendorPaymentObject) => acc + payment?.amount,
    0
  );

  const totalSell: any = totalSales?.reduce(
    (acc: number, sale: VendorSaleItemObject) =>
      acc +
      (sale?.quantity * sale?.vendor_cut * (100 - sale?.vendor_discount || 0)) /
        100,
    0
  );
  return totalSell - totalPaid;
}

export function getGrossProfit(item: StockObject) {
  let sellNum = item?.total_sell / 100 || 0,
    costNum = item?.vendor_cut / 100 || 0;
  if (sellNum > 0) return `$${(sellNum - costNum)?.toFixed(2)}`;
  else return "";
}

export function getProfitMargin(item: StockObject) {
  let sellNum = item?.total_sell || 0,
    costNum = item?.vendor_cut || 0;
  if (sellNum > 0)
    return `${(((sellNum - costNum) / sellNum) * 100)?.toFixed(1)}%`;
  else return "";
}

export function getAmountFromCashMap(till: TillObject) {
  let closeAmount: number = 0;
  if (till) {
    const amountMap = {
      one_hundred_dollar: 100,
      fifty_dollar: 50,
      twenty_dollar: 20,
      ten_dollar: 10,
      five_dollar: 5,
      two_dollar: 2,
      one_dollar: 1,
      fifty_cent: 0.5,
      twenty_cent: 0.2,
      ten_cent: 0.1,
    };
    Object.entries(till).forEach(([denom, amount]: [string, string]) => {
      if (!amount) amount = "0";
      closeAmount += parseInt(amount) * amountMap[denom];
    });
  }
  // return rounded to 2 d.p.
  if (isNaN(closeAmount)) return 0;
  return Math.round((closeAmount + Number.EPSILON) * 100) / 100;
}

export function getGeolocation() {
  let geolocation = null;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      geolocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
    });
  }
  return geolocation;
}

export function convertDegToCardinal(deg: number) {
  const cardinalDirections = {
    N: [348.75, 360],
    NN: [0, 11.25],
    NNE: [11.25, 33.75],
    NE: [33.75, 56.25],
    ENE: [56.25, 78.75],
    E: [78.75, 101.25],
    ESE: [101.25, 123.75],
    SE: [123.75, 146.25],
    SSE: [146.25, 168.75],
    S: [168.75, 191.25],
    SSW: [191.25, 213.75],
    SW: [213.75, 236.25],
    WSW: [236.25, 258.75],
    W: [258.75, 281.25],
    WNW: [281.25, 303.75],
    NW: [303.75, 326.25],
    NNW: [326.25, 348.75],
  };

  let cardinal = null;

  Object.entries(cardinalDirections).forEach(([k, v]) => {
    if (deg >= v[0] && deg < v[1]) cardinal = k;
    if (cardinal == "NN") cardinal = "N";
  });
  return cardinal;
}

export function convertMPStoKPH(mps: number) {
  return mps * 3.6;
}

export async function getDiscogsOptionsByBarcode(barcode: string) {
  try {
    const res = await fetch(
      `https://api.discogs.com/database/search?type=release&barcode=${barcode}&key=${process.env.NEXT_PUBLIC_DISCOGS_CONSUMER_KEY}&secret=${process.env.NEXT_PUBLIC_DISCOGS_CONSUMER_SECRET}`
    );
    const json = await res.json();
    if (!res.ok) throw Error(json.message);
    return json.results;
  } catch (e) {
    throw Error(e.message);
  }
}

export async function getDiscogsOptionsByItem(item: StockObject) {
  try {
    let url = "";
    if (item?.barcode) url = `&barcode=${encodeURIComponent(item?.barcode)}`;
    // if (false) url = "";
    else
      url = `&query=${item?.artist ? `${item?.artist} ` : ""}${
        item?.title ? `${item?.title} ` : ""
      }${item?.format ? `${item?.format} ` : ""}`;
    // &artist=${
    //   item?.artist || ""
    // }&title=${item?.title || ""}
    const res = await fetch(
      `https://api.discogs.com/database/search?type=release${url}&key=${process.env.NEXT_PUBLIC_DISCOGS_CONSUMER_KEY}&secret=${process.env.NEXT_PUBLIC_DISCOGS_CONSUMER_SECRET}`
    );
    const json = await res.json();
    if (!res.ok) throw Error(json.message);
    return json.results;
  } catch (e) {
    throw Error(e.message);
  }
}

export async function getDiscogsOptionsByKeyword(keyword: string) {
  try {
    const res = await fetch(
      `https://api.discogs.com/database/search?type=release&query=${keyword}&key=${process.env.NEXT_PUBLIC_DISCOGS_CONSUMER_KEY}&secret=${process.env.NEXT_PUBLIC_DISCOGS_CONSUMER_SECRET}`
    );
    const json = await res.json();
    if (!res.ok) throw Error(json.message);
    return json.results;
  } catch (e) {
    throw Error(e.message);
  }
}

export async function getDiscogsItem(discogsItem: DiscogsItem) {
  try {
    let url = `https://api.discogs.com/masters/${discogsItem?.master_id || ""}`;
    if (discogsItem?.master_id === 0 || !discogsItem?.master_id)
      url = discogsItem?.resource_url;
    const res = await fetch(url);
    const json = await res.json();
    if (!res.ok) throw Error(json.message);
    return json;
  } catch (e) {
    throw Error(e.message);
  }
}

export async function getDiscogsPriceSuggestions(discogsItem: DiscogsItem) {
  try {
    const res = await fetch(
      `https://api.discogs.com/marketplace/price_suggestions/${
        discogsItem?.id || ""
      }?token=${process.env.NEXT_PUBLIC_DISCOGS_PERSONAL_ACCESS_TOKEN}`
    );
    const json = await res.json();
    if (!res.ok) throw Error(json.message);
    return json;
  } catch (e) {
    throw Error(e.message);
  }
}

export async function getDiscogsItemArtistDetails(discogsItem: DiscogsItem) {
  const artists = [];
  console.log(discogsItem?.artists);
  if (discogsItem?.artists) {
    for (const discogsArtist of discogsItem?.artists) {
      console.log(discogsArtist);
      if (discogsArtist?.resource_url) {
        try {
          const res = await fetch(discogsArtist?.resource_url);
          const json = await res.json();
          if (!res.ok) throw Error(json.message);
          artists?.push({ ...json, name: discogsArtist?.name });
          return artists;
        } catch (e) {
          throw Error(e.message);
        }
      }
    }
  } else {
    return {};
  }
}

export async function getGoogleBooksOptionsByItem(item: StockObject) {
  try {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${item?.artist || ""}${
        item?.title || ""
      }&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`
    );
    const data = await res.text();
    if (!res.ok) throw Error();
    let json = JSON.parse(data);
    return json?.items || [];
  } catch (e) {
    throw Error(e.message);
  }
}

export function isMoneyFormat(value: string) {
  return !value || /^((\d+\.?|\.(?=\d))?\d{0,2})$/.test(value);
}

export function isDollarMoneyFormat(value: string) {
  return !value || /^\$?((\d+\.?|\.(?=\d))?\d{0,2})$/.test(value);
}

export function writeIntegerAsWord(number: number) {
  const first = [
    "",
    "one ",
    "two ",
    "three ",
    "four ",
    "five ",
    "six ",
    "seven ",
    "eight ",
    "nine ",
    "ten ",
    "eleven ",
    "twelve ",
    "thirteen ",
    "fourteen ",
    "fifteen ",
    "sixteen ",
    "seventeen ",
    "eighteen ",
    "nineteen ",
  ];
  const tens = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];
  const mad = ["", "thousand", "million", "billion", "trillion"];
  let word = "";

  for (let i = 0; i < mad.length; i++) {
    let tempNumber = number % (100 * Math.pow(1000, i));
    if (Math.floor(tempNumber / Math.pow(1000, i)) !== 0) {
      if (Math.floor(tempNumber / Math.pow(1000, i)) < 20) {
        word =
          first[Math.floor(tempNumber / Math.pow(1000, i))] +
          mad[i] +
          " " +
          word;
      } else {
        word =
          tens[Math.floor(tempNumber / (10 * Math.pow(1000, i)))] +
          "-" +
          first[Math.floor(tempNumber / Math.pow(1000, i)) % 10] +
          mad[i] +
          " " +
          word;
      }
    }

    tempNumber = number % Math.pow(1000, i + 1);
    if (Math.floor(tempNumber / (100 * Math.pow(1000, i))) !== 0)
      word =
        first[Math.floor(tempNumber / (100 * Math.pow(1000, i)))] +
        "hundred " +
        word;
  }
  return word;
}

export function andList(list: string[]) {
  if (list === undefined || list.length === 0) return "";
  if (list.length === 1) return list[0];
  else
    return list
      .join("@")
      .replace(/@([^@]*)$/, " and $1")
      .replace(/@/g, ", ");
}

export function writeItemList(
  inventory: StockObject[],
  items: SaleItemObject[]
) {
  if (items && inventory) {
    return items
      .filter((item: SaleItemObject) => !item?.is_deleted)
      .map((item: SaleItemObject) => {
        let stockItem: StockObject = inventory?.filter(
          (i) => i?.id === item?.item_id
        )[0];
        if (item?.is_gift_card) {
          return `Gift Card [${stockItem?.gift_card_code}]`;
        } else {
          let cartQuantity = item?.quantity || 1;
          let str = "";
          if (cartQuantity > 1) str = `${cartQuantity} x `;
          str = str + getItemDisplayName(stockItem);
          if (item?.is_refunded) str = str + " [REFUNDED]";
          return str;
        }
      })
      .join(", ");
  } else return "";
}

export function makeGiftCardCode(giftCards: GiftCardObject[]) {
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var charactersLength = characters.length;
  let result = "";
  while (
    result === "" ||
    giftCards?.map((g: GiftCardObject) => g?.gift_card_code).includes(result)
  ) {
    result = "";
    for (var i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  }
  return result;
}

//               //
// CSV FUNCTIONS //
//               //

export function getCSVData(items) {
  console.log(items);
  return items?.map((item: any) => [
    getItemSku(item),
    item?.artist,
    item?.title,
    item?.is_new ? "NEW" : "USED",
    `$${Math.round(item?.total_sell / 100)}`,
    `${item?.section}${item?.section && item?.country ? "/" : ""}${
      item?.country === "New Zealand" ? "NZ" : ""
    }`,
    `${("00000" + item?.id || "").slice(-5)}`,
  ]);
}

interface KiwiBankBatchFileProps {
  transactions: KiwiBankTransactionObject[];
  batchNumber: string;
  sequenceNumber: string;
}

export function writeKiwiBankBatchFile({
  transactions,
  batchNumber,
  sequenceNumber,
}: KiwiBankBatchFileProps) {
  const storeAccountNumber = "389020005748600";
  let transactionTest = [
    {
      name: "Ben Dodd",
      vendor_id: "69",
      amount: 10,
      accountNumber: "11-7426-0024124-00",
    },
  ];
  let error = "";
  let transactionAmount = 0;
  let transactionCount = 0;
  let hashTotal = 0;
  let kbb = [
    [
      1,
      "",
      batchNumber || "",
      sequenceNumber || "",
      storeAccountNumber,
      7,
      parseInt(dayjs.utc().format("YYMMDD")),
      parseInt(dayjs.utc().format("YYMMDD")),
      "",
    ],
  ];
  transactionTest.forEach((transaction: KiwiBankTransactionObject) => {
    if (!transaction?.accountNumber)
      error = `${
        transaction?.name || "Unknown Vendor"
      } is missing an account number.`;
    if (!transaction?.amount)
      error = `No payment amount set for ${
        transaction?.name || "Unknown Vendor"
      }.`;
    transactionAmount += transaction?.amount;
    transactionCount += 1;
    let accountNumber = `${transaction?.accountNumber}`.replace(/\D/g, "");
    // remove bank number
    accountNumber = accountNumber.substr(2);
    // remove suffix
    accountNumber = accountNumber.slice(0, 11);
    // add to hash total
    hashTotal += parseInt(accountNumber);
    kbb.push([
      2,
      parseInt(`${transaction?.accountNumber}`.replace(/\D/g, "")),
      50,
      transaction?.amount,
      transaction?.name,
      "Ride On Super Sound",
      "",
      "",
      "",
      "Ride On Super Sound",
      `Seq ${sequenceNumber}`,
      `Batch ${batchNumber}`,
      transaction?.vendor_id,
    ]);
  });

  let paddedHashTotal = `00000000000${hashTotal}`;
  paddedHashTotal = paddedHashTotal.slice(paddedHashTotal.length - 11);

  kbb.push([3, transactionAmount, transactionCount, parseInt(paddedHashTotal)]);
  return kbb;
}

//                //
// DATE FUNCTIONS //
//                //

export function fFileDate(date?: Date | string) {
  return date ? dayjs(date).format("YYYY-MM-DD-HH-mm-ss") : "Invalid Date";
}

export function latestDate(dates: Date[] | string[]) {
  return dates?.length > 0
    ? dayjs.max(dates?.map((date: Date | string) => dayjs(date)))
    : null;
}

export function authoriseUrl(url: string) {
  let k = process.env.NEXT_PUBLIC_SWR_API_KEY;
  if (!url || !k) return null;
  if (url?.includes("?")) return `${url}&k=${k}`;
  else return `${url}?k=${k}`;
}
