import { StockItemObject, StockListItemObject, VendorObject } from 'lib/types'

export function getItemById(item_id: number, inventory: StockItemObject[]) {
  return inventory?.find((i) => i?.id === item_id)
}

export function getItemSkuDisplayName(item: StockItemObject) {
  return `[${getItemSku(item)}] ${getItemDisplayName(item)}`
}

export function getItemSku(item: StockItemObject) {
  return item
    ? `${('000' + item?.vendorId || '').slice(-3)}/${(
        '00000' + item?.id || ''
      ).slice(-5)}`
    : null
}

export function getItemDisplayName(item: StockItemObject) {
  // Add special cases e.g. for comics
  // Might be better as a span component
  if (item?.isGiftCard)
    return `Gift Card [${item?.giftCardCode?.toUpperCase()}]`
  // let inventoryItem: any = item
  if (item?.isMiscItem) return item?.miscItemDescription
  if (item?.displayAs) return item?.displayAs
  if (!item || !(item?.artist || item?.title)) return 'Untitled'
  return `${item?.title || ''}${item?.title && item?.artist ? ' - ' : ''}${
    item?.artist || ''
  }`
}

export function getImageSrc(item: StockItemObject) {
  let src = 'default'
  if (item?.imageUrl) return item.imageUrl
  if (item?.isGiftCard) src = 'giftCard'
  if (item?.format === 'Zine') src = 'zine'
  else if (item?.format === 'Comics') src = 'comic'
  else if (item?.format === 'Book') src = 'book'
  else if (item?.format === '7"') src = '7inch'
  else if (item?.format === '10"') src = '10inch'
  else if (item?.format === 'LP') src = 'LP'
  else if (item?.format === 'CD') src = 'CD'
  else if (item?.format === 'Cassette') src = 'cassette'
  else if (item?.format === 'Badge') src = 'badge'
  else if (item?.format === 'Shirt') src = 'shirt'
  return `${process.env.NEXT_PUBLIC_RESOURCE_URL}img/${src}.png`
}

export function mapInventoryItem(
  item: StockListItemObject,
  vendors: VendorObject[]
) {
  return {
    id: item?.id,
    title: item?.title || '-',
    artist: item?.artist || '-',
    vendor: `[${('000' + item?.vendorId || '').slice(-3)}] ${
      vendors?.filter((v: VendorObject) => v?.id === item?.vendorId)?.[0]?.name
    }`,
    section: `${item?.section || ''}${
      item?.section && item?.country === 'New Zealand' ? '/' : ''
    }${item?.country === 'New Zealand' ? 'NZ' : ''}`,
    media: item?.media || '-',
    format: item?.format || '-',
    cost: item?.vendorCut ? item?.vendorCut / 100 : 0,
    store:
      item?.vendorCut && item?.totalSell
        ? (item.totalSell - item.vendorCut) / 100
        : 0,
    sell: item?.totalSell ? item?.totalSell / 100 : 0,
    profitMargin:
      item?.totalSell && item?.vendorCut && item?.totalSell > 0
        ? ((item?.totalSell - item?.vendorCut) / item?.totalSell) * 100
        : 0,
    quantity: item?.quantity || 0,
    quantityReceived: item?.quantityReceived || 0,
    quantityHoldLayby: item?.quantityHold + item?.quantityLayby,
    quantityReturned: Math.abs(item?.quantityReturned || 0),
    quantitySold: Math.abs(item?.quantitySold || 0),
  }
}

// export function getHoldQuantity(item: StockListItemObject) {
//   return ((item?.quantityHold || 0) + (item?.quantityUnhold || 0)) * -1
// }

// export function getLaybyQuantity(item: StockListItemObject) {
//   return ((item?.quantityLayby || 0) + (item?.quantityUnlayby || 0)) * -1
// }
