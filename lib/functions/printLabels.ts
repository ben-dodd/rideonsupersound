import { getItemSku } from 'lib/functions/displayInventory'
import { priceCentsString } from 'lib/utils'
import { downloadFile } from './payment'

export function getLabelPrinterCSV(items) {
  return items?.map((item: any) => [
    getItemSku(item),
    item?.artist,
    item?.title,
    item?.isNew ? 'NEW' : 'USED',
    priceCentsString(item?.totalSell, true),
    `${item?.section || ''}${item?.section && item?.country === 'New Zealand' ? '/' : ''}${
      item?.country === 'New Zealand' ? 'NZ' : ''
    }`,
    `${('00000' + item?.id || '').slice(-5)}`,
  ])
}

export function getBatchListCSVData(batchList) {
  const csvList = []
  batchList?.forEach((batchItem) => {
    const labelItem = {
      id: batchItem?.item?.id,
      vendorId: batchItem?.item?.vendorId,
      artist: batchItem?.item?.artist,
      title: batchItem?.item?.title,
      isNew: batchItem?.item?.isNew,
      totalSell: batchItem?.price?.totalSell,
      section: batchItem?.item?.section,
      country: batchItem?.item?.country,
    }
    if (batchItem?.quantity > 1) {
      const itemList = Array(batchItem?.quantity).fill(labelItem)
      csvList.push(...itemList)
    } else csvList.push(labelItem)
  })
  return getLabelPrinterCSV(csvList)
}

export function downloadCSV(headers, data, fileName) {
  let string = headers?.join(',')
  string = string + data?.map((row) => `\n${row?.join(',')}`)
  downloadFile(string, fileName)
}
