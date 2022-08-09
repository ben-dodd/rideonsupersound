import {
  createStockItemInDatabase,
  createStockMovementInDatabase,
  createStockPriceInDatabase,
} from '@lib/database/create'
import { ClerkObject, StockMovementTypes } from '@lib/types'
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

export async function receiveStock(
  basket: any,
  clerk: ClerkObject,
  registerID: number
) {
  const receivedStock = []
  await Promise.all(
    basket?.items?.map(async (receiveItem: any) => {
      if (receiveItem?.item?.id) {
        createStockMovementInDatabase({
          item: {
            item_id: receiveItem?.item?.id,
            quantity: receiveItem?.quantity,
          },
          clerk,
          registerID,
          act: StockMovementTypes?.Received,
          note: 'Existing stock received.',
        })
        receivedStock.push({
          item: receiveItem?.item,
          quantity: receiveItem?.quantity,
        })
      } else {
        const newStockID = await createStockItemInDatabase(
          { ...receiveItem?.item, vendor_id: basket?.vendor_id },
          clerk
        )
        createStockPriceInDatabase(
          newStockID,
          clerk,
          parseFloat(receiveItem?.total_sell) * 100,
          parseFloat(receiveItem?.vendor_cut) * 100,
          'New stock priced.'
        )
        createStockMovementInDatabase({
          item: {
            item_id: newStockID,
            quantity: receiveItem?.quantity,
          },
          clerk,
          registerID,
          act: StockMovementTypes?.Received,
          note: 'New stock received.',
        })
        receivedStock.push({
          item: {
            ...receiveItem?.item,
            vendor_id: basket?.vendor_id,
            total_sell: parseFloat(receiveItem?.total_sell) * 100,
            id: newStockID,
          },
          quantity: receiveItem?.quantity,
        })
      }
    })
  )
  return receivedStock
}
