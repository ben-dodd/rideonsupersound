import {
  InventoryObject,
  SaleObject,
  SaleItemObject,
  SaleTransactionObject,
  KiwiBankTransactionObject,
  TillObject,
  VendorObject,
  VendorSaleItemObject,
  VendorPaymentObject,
  DiscogsItem,
  GoogleBooksItem,
} from "@/lib/types";

import {
  format,
  add,
  parseISO,
  formatDistanceToNowStrict,
  max,
} from "date-fns";

export function getItemSku(item: InventoryObject) {
  return `${("000" + item?.vendor_id || "").slice(-3)}/${(
    "00000" + item?.id || ""
  ).slice(-5)}`;
}

export function getItemDisplayName(item: InventoryObject) {
  // Add special cases e.g. for comics
  // Might be better as a span component
  if (item?.display_as) return item?.display_as;
  if (!item || !(item?.artist || item?.title)) return "Untitled";
  return `${item?.title || ""}${item?.title && item?.artist ? " - " : ""}${
    item?.artist || ""
  }`;
}

export function getItemSkuDisplayName(
  item_id: number,
  inventory: InventoryObject[]
) {
  let item = (inventory || []).filter((i) => i?.id === item_id)[0];
  return `[${getItemSku(item)}] ${getItemDisplayName(item)}`;
}

export function getImageSrc(item: InventoryObject) {
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
        parseInt(cartItem?.vendor_discount) > 0
          ? ` x V${cartItem?.vendor_discount}%`
          : ""
      }${
        parseInt(cartItem?.store_discount) > 0
          ? ` x S${cartItem?.store_discount}%`
          : ""
      } x $${(item?.total_sell / 100)?.toFixed(2)}`;
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
    ? `$${(item?.gift_card_amount / 100)?.toFixed(2)}`
    : item?.is_misc_item
    ? `$${(item?.misc_item_amount / 100)?.toFixed(2)}`
    : `$${(getItemPrice(item, cartItem) / 100)?.toFixed(2)}`;
}

export function filterInventory({ inventory, search }) {
  if (!inventory) return [];
  return inventory
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
  // ?.sort((a: InventoryObject, b: InventoryObject) => {
  //   if (!a?.quantity || !b?.quantity) return 0;
  //   if (a?.quantity === b?.quantity) return 0;
  //   if (a?.quantity < 1) return 1;
  //   if (b?.quantity < 1) return -1;
  //   return 0;
  // })
}

export function getItemPrice(item: InventoryObject, cartItem: SaleItemObject) {
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

export function getItemStoreCut(
  item: InventoryObject,
  cartItem: SaleItemObject
) {
  if (item?.is_gift_card || item?.is_misc_item) return 0;
  let storeDiscountFactor = 100;
  if (parseInt(cartItem?.store_discount) > 0)
    storeDiscountFactor = 100 - parseInt(cartItem?.store_discount);
  return (
    (((item?.total_sell - item?.vendor_cut) * storeDiscountFactor) / 100) *
    parseInt(cartItem?.quantity)
  );
}

export function getSaleVars(cart: SaleObject, inventory: InventoryObject[]) {
  const totalPrice = getTotalPrice(cart, inventory) / 100;
  const totalPaid = getTotalPaid(cart) / 100;
  const totalStoreCut = getTotalStoreCut(cart, inventory) / 100;
  return {
    totalPrice,
    totalPaid,
    totalStoreCut,
    totalVendorCut: totalPrice - totalStoreCut,
    totalRemaining: totalPrice - totalPaid,
  };
}

export function getPaymentVars(
  inventory: InventoryObject[],
  vendorSales: VendorSaleItemObject[],
  vendorPayments: VendorPaymentObject[],
  vendor_id: number
) {
  let totalItems = (inventory || []).filter(
    (i: InventoryObject) => i?.vendor_id === vendor_id
  );

  let totalSales = (vendorSales || []).filter(
    (v: VendorSaleItemObject) =>
      (totalItems || []).filter((i: InventoryObject) => i?.id === v?.item_id)[0]
  );
  let totalPayments = (vendorPayments || []).filter(
    (v: VendorPaymentObject) => v?.vendor_id === vendor_id
  );

  const totalPaid = totalPayments.reduce(
    (acc: number, payment: VendorPaymentObject) => acc + payment?.amount,
    0
  );

  const totalSell: any = totalSales.reduce(
    (acc: number, sale: VendorSaleItemObject) =>
      acc +
      (sale?.quantity * sale?.vendor_cut * (100 - sale?.vendor_discount || 0)) /
        100,
    0
  );

  let lastPaid = latestDate(
    totalPayments.map((p: VendorPaymentObject) => p?.date)
  );
  let lastSold = latestDate(
    totalSales.map((s: VendorSaleItemObject) => s?.date_sale_closed)
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
  };
}

export function getVendorQuantityInStock(
  inventory: InventoryObject[],
  vendor_id: number
) {
  return getVendorItemsInStock(inventory, vendor_id).reduce(
    (sum, item) => (item?.quantity || 0) + sum,
    0
  );
}

export function getVendorItemsInStock(
  inventory: InventoryObject[],
  vendor_id: number
) {
  return (inventory || []).filter(
    (i: InventoryObject) => i?.vendor_id === vendor_id
  );
}

export function getItemQuantity(item: InventoryObject, cart: SaleObject) {
  const saleItem = (cart?.items || []).filter(
    (i: SaleItemObject) => i?.item_id === item?.id
  )[0];
  const cartQuantity = saleItem?.quantity || "0";
  return item?.quantity || item?.quantity === 0
    ? item?.quantity - parseInt(cartQuantity)
    : item?.quantity_received -
        item?.quantity_returned -
        parseInt(cartQuantity);
}

export function getTotalPrice(cart: SaleObject, inventory: InventoryObject[]) {
  return (cart?.items || []).reduce((acc, cartItem) => {
    // Misc Items and Gift Cards in inventory
    let item: InventoryObject = (inventory || []).filter(
      (i: InventoryObject) => i?.id === cartItem?.item_id
    )[0];
    return (acc += getItemPrice(item, cartItem));
  }, 0);
}

export function getTotalStoreCut(
  cart: SaleObject,
  inventory: InventoryObject[]
) {
  return (cart?.items || []).reduce((acc, cartItem: SaleItemObject) => {
    let item: InventoryObject = (inventory || []).filter(
      (i: InventoryObject) => i?.id === cartItem?.item_id
    )[0];
    return acc + getItemStoreCut(item, cartItem);
  }, 0);
}

export function getTotalPaid(sale: SaleObject) {
  console.log(sale?.transactions);
  return sale?.transactions
    ? sale.transactions
        .filter((transaction) => !transaction.is_deleted)
        .reduce((acc, transaction) => acc + transaction?.amount, 0)
    : null;
}

export function getTotalOwing(
  totalPayments: VendorPaymentObject[],
  totalSales: VendorSaleItemObject[]
) {
  const totalPaid = totalPayments.reduce(
    (acc: number, payment: VendorPaymentObject) => acc + payment?.amount,
    0
  );

  const totalSell: any = totalSales.reduce(
    (acc: number, sale: VendorSaleItemObject) =>
      acc +
      (sale?.quantity * sale?.vendor_cut * (100 - sale?.vendor_discount || 0)) /
        100,
    0
  );
  return totalSell - totalPaid;
}

export function getGrossProfit(item: InventoryObject) {
  let sellNum = item?.total_sell / 100 || 0,
    costNum = item?.vendor_cut / 100 || 0;
  if (sellNum > 0) return `$${(sellNum - costNum)?.toFixed(2)}`;
  else return "";
}

export function getProfitMargin(item: InventoryObject) {
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
      // console.log(position);
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

export function getDiscogsOptions(
  item: InventoryObject,
  setDiscogsOptions: Function
) {
  fetch(
    `https://api.discogs.com/database/search?type=release&artist=${
      item?.artist || ""
    }&title=${item?.title || ""}&key=${
      process.env.NEXT_PUBLIC_DISCOGS_CONSUMER_KEY
    }&secret=${process.env.NEXT_PUBLIC_DISCOGS_CONSUMER_SECRET}`
  ).then((results) => {
    // console.log(results);
    if (results.ok)
      results.json().then((json) => {
        if (json.results && json.results.length > 0) {
          setDiscogsOptions(json.results);
        } else setDiscogsOptions([]);
      });
    else setDiscogsOptions([]);
  });
}

export async function getDiscogsItem(
  discogsItem: DiscogsItem,
  item: InventoryObject,
  setItem: Function
) {
  let detailedDiscogsItem = {};
  let priceSuggestions = {};

  fetch(
    `https://api.discogs.com/marketplace/price_suggestions/${
      discogsItem?.id || ""
    }?token=${process.env.NEXT_PUBLIC_DISCOGS_PERSONAL_ACCESS_TOKEN}`
  ).then((results) => {
    if (results.ok)
      results.json().then((json) => {
        priceSuggestions = json;
        let url = `https://api.discogs.com/masters/${
          discogsItem?.master_id || ""
        }`;
        if (discogsItem?.master_id === 0 || !discogsItem?.master_id)
          url = discogsItem?.resource_url;
        fetch(url).then((results) => {
          results.json().then((json) => {
            detailedDiscogsItem = json;
            setItem({
              ...item,
              thumb_url: discogsItem?.thumb || null,
              image_url: discogsItem?.cover_image || null,
              discogsItem: {
                ...discogsItem,
                ...detailedDiscogsItem,
                priceSuggestions,
              },
            });
            //
            // MORE ARTIST INFORMATION CAN BE GATHERED
            // THIS TENDS TO PUT DISCOGS QUERIES OVER THE LIMIT
            // WHICH EFFECTS OTHER REQUESTS
            //

            // let artists = get(detailedDiscogsItem, "artists", []);
            // detailedDiscogsItem.artists = [];
            // for (const discogsArtist of artists) {
            //   fetch(get(discogsArtist, "resource_url", "")).then((results) => {
            //     results.json().then((artist) => {
            //       detailedDiscogsItem.artists = [
            //         ...detailedDiscogsItem.artists,
            //         { ...artist, name: discogsArtist.name },
            //       ];
            //     });
            //   });
            // }
          });
        });
      });
  });
}

export function getGoogleBooksOptions(
  item: InventoryObject,
  setGoogleBooksOptions: Function
) {
  // Move this to a helper function
  // Add for books too
  fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${item?.artist || ""}${
      item?.title || ""
    }&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`
  )
    .then((results) => results.text())
    .then((data) => {
      let json = JSON.parse(data);
      setGoogleBooksOptions(json?.items || []);
    });
}

export function getGoogleBooksItem(
  googleBooksItem: GoogleBooksItem,
  item: InventoryObject,
  setItem: Function
) {
  // No new information in volume fetch
  setItem({
    ...item,
    image_url: googleBooksItem?.volumeInfo?.imageLinks?.thumbnail || null,
    googleBooksItem,
  });
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
        "hunderd " +
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
  inventory: InventoryObject[],
  items: SaleItemObject[]
) {
  if ((items || []).length > 0) {
    return items
      .map((item) => {
        let stockItem: InventoryObject = (inventory || []).filter(
          (i) => i?.id === item?.item_id
        )[0];
        if (item?.is_gift_card) {
          return `Gift Card [${stockItem?.gift_card_code}]`;
        } else {
          let cartQuantity = item?.quantity || 1;
          let str = "";
          if (cartQuantity > 1) str = `${cartQuantity} x `;
          str = str + getItemDisplayName(stockItem);
          return str;
        }
      })
      .join(", ");
  } else return "";
}

//               //
// CSV FUNCTIONS //
//               //

export function getCSVData(items, inventory: InventoryObject[]) {
  let csv = [];
  Object.values(items || {}).forEach((row: any) => {
    Array.from(Array(parseInt(row?.printQuantity || 1)).keys()).forEach(() => {
      // let item:InventoryObject = (inventory || []).filter()?.row?.item?.value || {}), {});
      // if (Object.keys(item).length > 0)
      //   csv.push([
      //     item?.sku,
      //     item?.artist,
      //     item.title,
      //     get(item, "newUsed", "USED"),
      //     item.sell,
      //     "",
      //   ]);
    });
  });
  return csv;
}

interface KiwiBankBatchFileProps {
  transactions: KiwiBankTransactionObject[];
  vendors: VendorObject[];
  batchNumber: string;
  sequenceNumber: string;
  storeAccountNumber: string;
}

export function writeKiwiBankBatchFile({
  transactions,
  vendors,
  batchNumber,
  sequenceNumber,
  storeAccountNumber,
}: KiwiBankBatchFileProps) {
  // storeAccountNumber BBbbbbaaaaaaass
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
      parseInt(format(new Date(), "yyMMdd")),
      parseInt(format(new Date(), "yyMMdd")),
      "",
    ],
  ];
  transactions.forEach((transaction: KiwiBankTransactionObject) => {
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
    // console.log(accountNumber);
    // remove bank number
    accountNumber = accountNumber.substr(2);
    // console.log(accountNumber);
    // remove suffix
    accountNumber = accountNumber.slice(0, 11);
    // add to hash total
    // console.log(accountNumber);
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
      "",
    ]);
  });

  let paddedHashTotal = `00000000000${hashTotal}`;
  paddedHashTotal = paddedHashTotal.slice(paddedHashTotal.length - 11);

  // console.log(paddedHashTotal);

  kbb.push([3, transactionAmount, transactionCount, parseInt(paddedHashTotal)]);
  // console.log(kbb);
  return kbb;
}

//                //
// DATE FUNCTIONS //
//                //

export function nzDate(isoDate: string) {
  return isoDate ? add(parseISO(isoDate), { hours: 19 }) : null;
}

export function fDate(date?: Date | string) {
  console.log(date);
  return format(
    date ? (date instanceof Date ? date : nzDate(date)) : new Date(),
    "d MMMM yyyy, p"
  );
}

export function fDateTime(date?: Date | string) {
  return format(
    date ? (date instanceof Date ? date : nzDate(date)) : new Date(),
    "d MMMM yyyy, p"
  );
}

export function fTimeDate(date?: Date | string) {
  return format(
    date ? (date instanceof Date ? date : nzDate(date)) : new Date(),
    "p, d MMMM yyyy"
  );
}

export function fFileDate(date?: Date | string) {
  return format(
    date ? (date instanceof Date ? date : nzDate(date)) : new Date(),
    "yyyy-MM-dd-HH-mm-ss"
  );
}

export function daysFrom(date: Date | string) {
  return date
    ? formatDistanceToNowStrict(date instanceof Date ? date : nzDate(date))
    : null;
}

export function latestDate(dates: Date[] | string[]) {
  return dates?.length > 0
    ? max(
        dates?.map((date: Date | string) =>
          date instanceof Date ? date : nzDate(date)
        )
      )
    : null;
}
