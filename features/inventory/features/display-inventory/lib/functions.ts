import { GiftCardObject, StockObject, VendorObject } from 'lib/types'

export function getItemById(item_id: number, inventory: StockObject[]) {
  return inventory?.find((i) => i?.id === item_id)
}

export function getItemSkuDisplayName(item: StockObject) {
  return `[${getItemSku(item)}] ${getItemDisplayName(item)}`
}

export function getItemSku(item: StockObject) {
  return item
    ? `${('000' + item?.vendor_id || '').slice(-3)}/${(
        '00000' + item?.id || ''
      ).slice(-5)}`
    : null
}

export function getItemDisplayName(item: StockObject | GiftCardObject) {
  // Add special cases e.g. for comics
  // Might be better as a span component
  if (item?.is_gift_card)
    return `Gift Card [${item?.gift_card_code?.toUpperCase()}]`
  let inventoryItem: any = item
  if (inventoryItem?.is_misc_item) return inventoryItem?.misc_item_description
  if (inventoryItem?.display_as) return inventoryItem?.display_as
  if (!inventoryItem || !(inventoryItem?.artist || inventoryItem?.title))
    return 'Untitled'
  return `${inventoryItem?.title || ''}${
    inventoryItem?.title && inventoryItem?.artist ? ' - ' : ''
  }${inventoryItem?.artist || ''}`
}

export function getImageSrc(item: StockObject) {
  let src = 'default'
  if (item?.image_url) return item.image_url
  if (item?.is_gift_card) src = 'giftCard'
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

export function mapInventoryItem(item: StockObject, vendors: VendorObject[]) {
  return {
    id: item?.id,
    title: item?.title || '-',
    artist: item?.artist || '-',
    vendor: `[${('000' + item?.vendor_id || '').slice(-3)}] ${
      vendors?.filter((v: VendorObject) => v?.id === item?.vendor_id)?.[0]?.name
    }`,
    section: `${item?.section || ''}${
      item?.section && item?.country === 'New Zealand' ? '/' : ''
    }${item?.country === 'New Zealand' ? 'NZ' : ''}`,
    media: item?.media || '-',
    format: item?.format || '-',
    cost: item?.vendor_cut ? item?.vendor_cut / 100 : 0,
    store:
      item?.vendor_cut && item?.total_sell
        ? (item.total_sell - item.vendor_cut) / 100
        : 0,
    sell: item?.total_sell ? item?.total_sell / 100 : 0,
    profitMargin:
      item?.total_sell && item?.vendor_cut && item?.total_sell > 0
        ? ((item?.total_sell - item?.vendor_cut) / item?.total_sell) * 100
        : 0,
    quantity: item?.quantity || 0,
    quantityReceived: item?.quantity_received || 0,
    quantityHoldLayby: getHoldQuantity(item) + getLaybyQuantity(item),
    quantityReturned: Math.abs(item?.quantity_returned || 0),
    quantitySold: Math.abs(item?.quantity_sold || 0),
  }
}

export function getHoldQuantity(item: StockObject) {
  return ((item?.quantity_hold || 0) + (item?.quantity_unhold || 0)) * -1
}

export function getLaybyQuantity(item: StockObject) {
  return ((item?.quantity_layby || 0) + (item?.quantity_unlayby || 0)) * -1
}
