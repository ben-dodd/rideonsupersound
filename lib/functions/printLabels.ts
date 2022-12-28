import { getItemSku } from 'lib/functions/displayInventory'
import { centsToDollars } from 'lib/utils'

export function getLabelPrinterCSV(items) {
  return items?.map((item: any) => [
    getItemSku(item),
    item?.artist,
    item?.title,
    item?.isNew ? 'NEW' : 'USED',
    `$${Math.round(centsToDollars(item?.totalSell))}`,
    `${item?.section || ''}${
      item?.section && item?.country === 'New Zealand' ? '/' : ''
    }${item?.country === 'New Zealand' ? 'NZ' : ''}`,
    `${('00000' + item?.id || '').slice(-5)}`,
  ])
}
