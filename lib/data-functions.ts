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
import { Email } from "@mui/icons-material";

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

export function writeCartItemPriceBreakdown(cartItem: any, item?: StockObject) {
  // Writes out the sale item in the following form:
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
      } x $${((cartItem?.total_sell ?? item?.total_sell) / 100)?.toFixed(2)}`;
}

export function writeCartItemPriceTotal(
  cartItem: SaleItemObject,
  item?: StockObject
) {
  // Writes out the sale item total applying discounts and quantity
  // $40.00
  const prices = getCartItemPrice(cartItem, item);
  return `$${(prices?.totalPrice / 100)?.toFixed(2)}`;
}

export function getPrice(
  cost: number | string,
  discount: number | string,
  quantity: number | string
) {
  return (
    (parseInt(`${quantity}`) ?? 1) *
    ((parseFloat(`${cost}`) || 0) *
      (1 - (parseFloat(`${discount}`) || 0) / 100))
  );
}

export function getCartItemPrice(cartItem: any, item: StockObject) {
  // Gets three prices for each sale item: the vendor cut, store cut, and total
  // Price is returned in cents
  const totalSell: number = !cartItem
    ? 0
    : item?.is_gift_card
    ? item?.gift_card_amount || 0
    : item?.is_misc_item
    ? item?.misc_item_amount || 0
    : null;
  const vendorCut: number = cartItem?.vendor_cut ?? item?.vendor_cut;
  const storeCut: number = item?.is_misc_item
    ? item?.misc_item_amount || 0
    : // : cartItem?.store_cut ??
      (cartItem?.total_sell ?? item?.total_sell) - vendorCut;
  const storePrice: number = getPrice(
    storeCut,
    cartItem?.store_discount,
    cartItem?.quantity
  );
  const vendorPrice: number = getPrice(
    vendorCut,
    cartItem?.vendor_discount,
    cartItem?.quantity
  );
  const totalPrice: number = totalSell ?? storePrice + vendorPrice;
  return { storePrice, vendorPrice, totalPrice };
}

export function getStoreCut(item: StockObject) {
  if (!item?.total_sell || !item?.vendor_cut) return 0;
  return item?.total_sell - item?.vendor_cut;
}

export function getSaleVars(sale: any, inventory: StockObject[]) {
  // Sale - sale item
  // Inventory - used to look up item prices if not in sale, used for new sales
  const totalPostage = parseFloat(`${sale?.postage}`) || 0; // Postage: currently in dollars
  const totalStoreCut = sumPrices(sale?.items, inventory, "storePrice") / 100; // Total Amount of Sale goes to Store in dollars
  // console.log(totalStoreCut);
  const totalPriceUnrounded =
    sumPrices(
      sale?.items?.filter((s) => !s?.is_refunded),
      inventory,
      "totalPrice"
    ) / 100; // Total Amount of Sale in dollars
  const totalVendorCut = totalPriceUnrounded - totalStoreCut; // Total Vendor Cut in dollars
  const totalItemPrice =
    Math.round((totalPriceUnrounded + Number.EPSILON) * 10) / 10; // Total Amount rounded to 10c to avoid unpayable sales
  const totalPrice = totalItemPrice + totalPostage; // TotalPrice + postage
  const totalPaid =
    Math.round((getTotalPaid(sale?.transactions) / 100 + Number.EPSILON) * 10) /
    10; // Total Paid to nearest 10c
  const totalRemaining =
    Math.round((totalPrice - totalPaid + Number.EPSILON) * 10) / 10; // Amount remaining to pay
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
      ?.reduce((acc, item) => acc + parseInt(item?.quantity), 0), // Total number of items in sale
    itemList: writeItemList(inventory, sale?.items), // List of items written in full
  };
}

export function getVendorDetails(
  inventory: StockObject[],
  vendorSales: VendorSaleItemObject[],
  vendorPayments: VendorPaymentObject[],
  vendor_id: number,
  cart?: SaleObject
) {
  if (vendor_id < 0) return {}; // -1 is used for new vendors, i.e. no sales or payments

  // Total Items - all stock items that belong to the vendor
  let totalItems = inventory?.filter(
    (i: StockObject) => i?.vendor_id === vendor_id
  );

  // Total Sales - all sale items of the Vendor's stock
  let totalSales = vendorSales?.filter(
    (v: VendorSaleItemObject) =>
      totalItems?.filter((i: StockObject) => i?.id === v?.item_id)[0]
  );

  // Total Payments - all payments made to the Vendor
  let totalPayments = vendorPayments?.filter(
    (v: VendorPaymentObject) => v?.vendor_id === vendor_id
  );

  // If a cart is in progress, add these payments - possibly delete this?
  if (cart) {
    let cartPayments: VendorPaymentObject[] =
      cart?.transactions
        ?.filter((t: SaleTransactionObject) => t?.vendor?.id === vendor_id)
        ?.map((t: SaleTransactionObject) => ({ amount: t?.amount })) || [];
    totalPayments = [...totalPayments, ...cartPayments];
  }

  // Total Paid = sum all payments
  const totalPaid = totalPayments?.reduce(
    (acc: number, payment: VendorPaymentObject) => acc + payment?.amount,
    0
  );

  // Total Store Cut = sum all store cut
  const totalStoreCut = sumPrices(totalSales, null, "storePrice");
  // const totalStoreCut2 = totalSales?.reduce(
  //   (acc: number, sale: VendorSaleItemObject) =>
  //     acc +
  //     sale?.quantity *
  //       (sale?.total_sell - sale?.vendor_cut) *
  //       (1 - (sale?.store_discount || 0) / 100),
  //   0
  // );

  // Total Vendor Take = sum all vendor take
  const totalSell: number = sumPrices(totalSales, null, "vendorPrice");
  // const totalSell2: any = totalSales?.reduce(
  //   (acc: number, sale: VendorSaleItemObject) =>
  //     acc +
  //     sale?.quantity *
  //       sale?.vendor_cut *
  //       (1 - (sale?.vendor_discount || 0) / 100),
  //   0
  // );

  // console.group(`${vendor_id}`);
  // console.log(`totalStoreCut: ${totalStoreCut}`);
  // console.log(`totalStoreCut2: ${totalStoreCut2}`);
  // console.log(`totalSell: ${totalSell}`);
  // console.log(`totalSell2: ${totalSell2}`);
  // console.groupEnd();

  // Get the date of the last payment made to vendor
  let lastPaid = latestDate(
    totalPayments?.map((p: VendorPaymentObject) => p?.date)
  );

  // Get the date of the last sale of the vendor stock
  let lastSold = latestDate(
    totalSales?.map((s: VendorSaleItemObject) => s?.date_sale_closed)
  );

  // Total vendor take minus total paid to vendor
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

export function sumPrices(
  saleItems: any[],
  inventory: StockObject[],
  field: string
) {
  if (!saleItems) return 0;
  return saleItems
    ?.filter((s) => !s?.is_refunded)
    ?.reduce((acc, saleItem) => {
      // Dont bother getting inventory item if not needed
      let item: StockObject =
        saleItem?.total_sell && saleItem?.vendor_cut && saleItem?.store_cut
          ? null
          : inventory?.filter(
              (i: StockObject) => i?.id === saleItem?.item_id
            )[0];
      const prices = getCartItemPrice(saleItem, item);
      return (acc += prices?.[field]);
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

export function getFormatFromDiscogs(formats: string[]) {
  if (!formats) return "";
  let format = null;
  console.log(formats);
  [
    "LP",
    "CD",
    "Cassette",
    '16"',
    '12"',
    '11"',
    '10"',
    '9"',
    '8"',
    '7"',
    '6½"',
    '6"',
    '5½"',
    '5"',
    '4"',
    '3½"',
    '3"',
    '2"',
    '1"',
  ]?.forEach((f) => {
    if (formats?.includes(f)) format = f;
  });
  if (!format) format = formats[0];
  console.log(format);
  return format;
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

export function isValidBankAccountNumber(value: string) {
  if (!value) return false;
  return /^(?:[0-9]{15}|[0-9]{16})$/.test(`${value}`.replace(/\D/g, ""));
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
  let transactionAmount = 0;
  let transactionCount = 0;
  let hashTotal = 0;
  let kbb = [
    [
      1,
      "",
      parseInt(batchNumber?.substring(0, 2)) || "",
      parseInt(sequenceNumber?.substring(0, 4)) || "",
      parseInt(storeAccountNumber?.substring(0, 16)),
      7,
      parseInt(dayjs.utc().format("YYMMDD")),
      parseInt(dayjs.utc().format("YYMMDD")),
      "",
    ],
  ];
  transactions
    ?.filter((t) => isValidBankAccountNumber(t?.accountNumber) && t?.amount)
    .forEach((transaction: KiwiBankTransactionObject) => {
      transactionAmount += transaction?.amount;
      transactionCount += 1;
      let accountNumber = `${transaction?.accountNumber}`.replace(/\D/g, "");
      // remove bank number
      accountNumber = accountNumber.substring(2);
      // remove suffix
      accountNumber = accountNumber.slice(0, 11);
      // add to hash total
      hashTotal += parseInt(accountNumber);
      kbb.push([
        2,
        `${transaction?.accountNumber}`.replace(/\D/g, "")?.substring(0, 16),
        50,
        transaction?.amount,
        transaction?.name?.substring(0, 20),
        "RideOn Pay",
        `${transaction?.vendor_id} ${transaction?.name}`?.substring(0, 12),
        "",
        `Reg ${batchNumber}`?.substring(0, 12),
        "Ride On Super Sound",
        `Reg ${batchNumber}`?.substring(0, 12),
        `${transaction?.vendor_id} ${transaction?.name}`?.substring(0, 12),
        `Seq ${dayjs.utc().format("YYMMDD")}`?.substring(0, 12),
      ]);
    });

  let paddedHashTotal = `00000000000${hashTotal}`;
  paddedHashTotal = paddedHashTotal.slice(paddedHashTotal.length - 11);

  kbb.push([3, transactionAmount, transactionCount, parseInt(paddedHashTotal)]);

  let csvContent = "data:text/csv;charset=utf-8,";
  kbb.forEach((rowArray) => {
    let row = rowArray?.join(",");
    csvContent += row + "\r\n";
  });
  return encodeURI(csvContent);
}

export function writeEmailCSV(vendors, includeUnchecked, includeNoBank) {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent +=
    "CODE,NAME,RECIPIENT,ACCOUNT,OWING,LINK,DATE,CHECKED,VALID BANK NUM,STORE CREDIT ONLY\r\n";
  // console.log(vendors);
  let vendorArrays = vendors
    ?.filter(
      (v) =>
        (includeUnchecked || v?.is_checked) &&
        (includeNoBank || isValidBankAccountNumber(v?.bank_account_number))
    )
    ?.map((v) => [
      v?.id,
      v?.name,
      v?.email,
      v?.bank_account_number,
      v?.payAmount,
      `https://rideonsupersound.vercel.app/vendor/${v?.uid}`,
      dayjs().format("DD/MM/YYYY"),
      v?.is_checked,
      isValidBankAccountNumber(v?.bank_account_number),
      Boolean(v?.store_credit_only),
    ]);
  // console.log(vendorArrays);
  vendorArrays?.forEach((vendorArray) => {
    let row = vendorArray?.join(",");
    csvContent += row + "\r\n";
  });
  return encodeURI(csvContent);
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

export function filterInventory({
  inventory,
  search,
  slice = 50,
  emptyReturn = false,
}) {
  if (!inventory) return [];
  return inventory
    .filter((item: StockObject) => {
      let res = true;
      if (!search || search === "") return emptyReturn;

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
    .slice(0, slice);
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
