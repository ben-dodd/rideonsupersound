import { StockObject } from '@/lib/types'

import dayjs from 'dayjs'

export function getItemSku(item: StockObject) {
  return `${('000' + item?.vendor_id || '').slice(-3)}/${(
    '00000' + item?.id || ''
  ).slice(-5)}`
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
export function filterInventory({
  inventory,
  search,
  slice = 50,
  emptyReturn = false,
}) {
  if (!inventory) return []
  return inventory
    ?.filter((item: StockObject) => {
      let res = true
      if (!search || search === '') return emptyReturn

      if (search) {
        let terms = search.split(' ')
        let itemMatch = `
        ${getItemSku(item) || ''}
        ${item?.artist || ''}
        ${item?.title || ''}
        ${item?.format || ''}
        ${item?.genre || ''}
        ${item?.country || ''}
        ${item?.section || ''}
        ${item?.tags ? item?.tags?.join(' ') : ''}
        ${item?.vendor_name || ''}
        ${item?.googleBooksItem?.volumeInfo?.authors?.join(' ') || ''}
        ${item?.googleBooksItem?.volumeInfo?.publisher || ''}
        ${item?.googleBooksItem?.volumeInfo?.subtitle || ''}
        ${item?.googleBooksItem?.volumeInfo?.categories?.join(' ') || ''}
      `
        terms.forEach((term: string) => {
          if (!itemMatch.toLowerCase().includes(term.toLowerCase())) res = false
        })
      }

      return res
    })
    .slice(0, slice)
}

export function sumPrices(
  saleItems: any[],
  inventory: StockObject[],
  field: string
) {
  if (!saleItems) return 0
  return saleItems
    ?.filter((s) => !s?.is_refunded)
    ?.reduce((acc, saleItem) => {
      // Dont bother getting inventory item if not needed
      let item: StockObject =
        saleItem?.total_sell && saleItem?.vendor_cut && saleItem?.store_cut
          ? null
          : inventory?.filter(
              (i: StockObject) => i?.id === saleItem?.item_id
            )?.[0]
      const prices = getCartItemPrice(saleItem, item)
      return (acc += prices?.[field])
    }, 0)
}

export function getCartItemPrice(cartItem: any, item: StockObject) {
  // Gets three prices for each sale item: the vendor cut, store cut, and total
  // Price is returned in cents
  const totalSell: number = !cartItem
    ? 0
    : item?.is_gift_card
    ? item?.gift_card_amount || 0
    : item?.is_misc_item
    ? item?.misc_item_amount || 0
    : null
  const vendorCut: number = cartItem?.vendor_cut ?? item?.vendor_cut
  const storeCut: number = item?.is_misc_item
    ? item?.misc_item_amount || 0
    : // : cartItem?.store_cut ??
      (cartItem?.total_sell ?? item?.total_sell) - vendorCut
  const storePrice: number = getPrice(
    storeCut,
    cartItem?.store_discount,
    cartItem?.quantity
  )
  const vendorPrice: number = getPrice(
    vendorCut,
    cartItem?.vendor_discount,
    cartItem?.quantity
  )
  const totalPrice: number = totalSell ?? storePrice + vendorPrice
  return { storePrice, vendorPrice, totalPrice }
}

export function getPrice(
  cost: number | string,
  discount: number | string,
  quantity: number | string
) {
  return (
    (parseInt(`${quantity}`) ?? 1) *
    ((parseFloat(`${cost}`) || 0) *
      (1 - (parseFloat(`${discount}`) || 0) / 100))
  )
}
