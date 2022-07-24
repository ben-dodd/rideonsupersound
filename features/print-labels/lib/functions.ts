import { getItemSku } from 'lib/data-functions'
import { centsToDollars } from 'lib/utils'

export function getLabelPrinterCSV(items) {
  return items?.map((item: any) => [
    getItemSku(item),
    item?.artist,
    item?.title,
    item?.is_new ? 'NEW' : 'USED',
    `$${Math.round(centsToDollars(item?.total_sell))}`,
    `${item?.section || ''}${
      item?.section && item?.country === 'New Zealand' ? '/' : ''
    }${item?.country === 'New Zealand' ? 'NZ' : ''}`,
    `${('00000' + item?.id || '').slice(-5)}`,
  ])
}
