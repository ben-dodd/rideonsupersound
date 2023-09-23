import { dollarsToCents } from 'lib/utils'
import { v4 as uuid } from 'uuid'

export function parseCSVItems(results: any, defaultItem = { price: {}, item: {} }) {
  let parsedItems = []
  for (let i = 0; i < results?.data?.length; i++) {
    let d = results?.data[i]
    if (!d?.Artist && !d?.Title) break
    parsedItems.push({
      key: uuid(),
      quantity: d?.Quantity ? parseInt(d?.Quantity) : 1,
      price: {
        totalSell: d['Sale Price'] ? parseInt(`${parseFloat(d['Sale Price']?.replace(/\$|["],/g, ''))}`) : null,
        vendorCut: d['Vendor Cut'] ? parseInt(`${parseFloat(d['Vendor Cut']?.replace(/\$|["],/g, ''))}`) : null,
      },
      item: {
        artist: d?.Artist,
        barcode: d?.Barcode,
        colour: d?.Colour,
        cond: d?.Condition,
        country: d?.Country,
        format: d?.Format,
        genre: d?.Genre,
        isNew: d['Is New?'] === 'TRUE' ? true : false,
        note: d?.Notes,
        size: d?.Size,
        title: d?.Title,
        media: d?.Type,
      },
    })
  }
  return parsedItems?.map((receiveItem) => ({
    ...receiveItem,
    item: { ...defaultItem?.item, ...receiveItem?.item },
    price: { ...defaultItem?.price, ...receiveItem?.price },
  }))
}

export function getDefaultReceiveItem(batchReceiveSession) {
  const {
    cond = '',
    country = '',
    format = '',
    genre = [],
    isNew = false,
    media = '',
    section = '',
    totalSell = '',
    vendorCut = '',
    doListOnWebsite = true,
    doReorder = true,
  } = batchReceiveSession || {}
  const defaultItem = {
    item: { cond, country, format, genre, isNew, media, section, doListOnWebsite, doReorder },
    quantity: 1,
    price: { vendorCut, totalSell },
  }
  return defaultItem
}

export function convertPriceToCents(price) {
  return {
    totalSell: price?.totalSell ? dollarsToCents(price.totalSell) : null,
    storeCut: price?.storeCut ? dollarsToCents(price.storeCut) : null,
    vendorCut: price?.vendorCut ? dollarsToCents(price.vendorCut) : null,
  }
}
