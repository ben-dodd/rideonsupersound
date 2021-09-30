import {
  InventoryObject,
  SaleObject,
  SaleItemObject,
  TransactionObject,
  VendorSaleItemObject,
  VendorPayment,
} from "@/lib/types";

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

export function writeInventoryDisplayName(item: InventoryObject) {
  if (!item || !(item?.artist || item?.title)) return "Untitled";
  let str = item?.sku || "";
  if (item?.display_as) return `${str}${item?.display_as}`;
  return `${str}${item?.artist}${item?.artist && item?.title && " - "}${
    item?.title
  }`;
}

export function filterInventory({ inventory, search }) {
  if (!inventory) return [];
  console.log(inventory);
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

export function getTotalPrice(cart: SaleObject, inventory: InventoryObject[]) {
  return (cart?.items || []).reduce((acc, cartItem) => {
    // Misc Items and Gift Cards in inventory
    let item: InventoryObject = inventory.filter(
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
    let item: InventoryObject = inventory.filter(
      (i: InventoryObject) => i?.id === cartItem?.item_id
    )[0];
    return acc + getItemStoreCut(item, cartItem);
  }, 0);
}

export function getRemainingBalance(
  totalPrice: number,
  transactions: TransactionObject[]
) {
  if (!totalPrice || !transactions) return null;
  // return totalPrice;
  const totalTransactions = transactions
    .filter((transaction) => !transaction.is_deleted)
    .reduce((acc, transaction) => acc + transaction?.total_amount, 0);
  return totalPrice - totalTransactions;
}

export function getTotalOwing(
  totalPayments: VendorPayment[],
  totalSales: VendorSaleItemObject[]
) {
  console.log(totalPayments);
  console.log(totalSales);
  const totalPaid = totalPayments.reduce(
    (acc: number, payment: VendorPayment) => acc + payment?.amount,
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
  if (sellNum > 0) return `$${(sellNum - costNum).toFixed(2)}`;
  else return "";
}

export function getProfitMargin(item: InventoryObject) {
  let sellNum = item?.total_sell || 0,
    costNum = item?.vendor_cut || 0;
  if (sellNum > 0)
    return `${(((sellNum - costNum) / sellNum) * 100).toFixed(1)}%`;
  else return "";
}

export function getItemQuantity(item: InventoryObject) {
  return item?.quantity
    ? item?.quantity
    : item?.quantity_received - item?.quantity_returned;
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
  discogsItem: any,
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
            console.log({
              ...discogsItem,
              ...detailedDiscogsItem,
              priceSuggestions,
            });
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
  console.log(
    `https://www.googleapis.com/books/v1/volumes?q=${item?.artist || ""}${
      item?.title || ""
    }&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`
  );
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
  googleBooksItem: any,
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
