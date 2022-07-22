import { v4 as uuid } from 'uuid'

export function parseCSVItems(results: any) {
  let parsedItems = []
  for (let i = 0; i < results?.data?.length; i++) {
    let d = results?.data[i]
    if (!d?.Artist && !d?.Title) break
    parsedItems.push({
      key: uuid(),
      quantity: d?.Quantity ? parseInt(d?.Quantity) : 1,
      total_sell: d['Sale Price']
        ? parseInt(`${parseFloat(d['Sale Price']?.replace(/\$|["],/g, ''))}`)
        : null,
      vendor_cut: d['Vendor Cut']
        ? parseInt(`${parseFloat(d['Vendor Cut']?.replace(/\$|["],/g, ''))}`)
        : null,
      item: {
        artist: d?.Artist,
        barcode: d?.Barcode,
        colour: d?.Colour,
        cond: d?.Condition,
        country: d?.Country,
        format: d?.Format,
        genre: d?.Genre,
        is_new: d['Is New?'] === 'TRUE' ? true : false,
        note: d?.Notes,
        size: d?.Size,
        title: d?.Title,
        media: d?.Type,
      },
    })
  }
  return parsedItems
}
