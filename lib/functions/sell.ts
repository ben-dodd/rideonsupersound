import { getItemDisplayName, getItemSku } from 'lib/functions/displayInventory'
import { saveLog } from 'lib/functions/log'
import { SaleItemObject } from 'lib/types/sale'
import {
  BasicStockPriceObject,
  GiftCardObject,
  StockItemObject,
  BasicStockItemObject,
  StockObject,
} from 'lib/types/stock'
import { priceCentsString } from 'lib/utils'

export function writeCartItemPriceBreakdown(cartItem: SaleItemObject, item: BasicStockItemObject) {
  // Writes out the sale item in the following form:
  // 1 x V10% x R50% x $27.00
  if (item?.isGiftCard) {
    return `${priceCentsString(item?.giftCardAmount)} GIFT VOUCHER`
  }
  if (item?.isMiscItem) {
    return `${cartItem?.quantity} × ${priceCentsString(item?.miscItemAmount)}${
      parseInt(cartItem?.quantity) > 1
        ? ` (${priceCentsString(parseInt(cartItem?.quantity) * item?.miscItemAmount)})`
        : ''
    }`
  }
  if (item?.totalPrice === null || item?.totalPrice === undefined) return '...'
  return `${cartItem?.quantity}${parseInt(cartItem?.vendorDiscount) > 0 ? ` × V${cartItem?.vendorDiscount}%` : ''}${
    parseInt(cartItem?.storeDiscount) > 0 ? ` × S${cartItem?.storeDiscount}%` : ''
  } × ${priceCentsString(cartItem?.totalSell ?? item?.totalPrice)}${
    cartItem?.storeDiscount || cartItem?.vendorDiscount || parseInt(cartItem?.quantity) !== 1
      ? ` (${priceCentsString(getCartItemTotal(cartItem, item))})`
      : ''
  }`
}

export function getDiscountedPrice(cost: number | string, discount: number | string, quantity: number | string) {
  return (parseInt(`${quantity}`) ?? 1) * ((parseFloat(`${cost}`) || 0) * (1 - (parseFloat(`${discount}`) || 0) / 100))
}

export function getCartItemVendorCut(cartItem: SaleItemObject, item) {
  const vendorPrice: number = getDiscountedPrice(item?.vendorCut, cartItem?.vendorDiscount, cartItem?.quantity)
  return vendorPrice
}

export function getCartItemStoreCut(cartItem, item) {
  const storePrice: number = getDiscountedPrice(item?.storeCut, cartItem?.storeDiscount, cartItem?.quantity)
  return storePrice
}

export function getCartItemTotal(cartItem, item) {
  const totalSell: number = !cartItem
    ? 0
    : item?.isGiftCard
    ? item?.giftCardAmount || 0
    : item?.isMiscItem
    ? item?.miscItemAmount || 0
    : null
  if (totalSell) return totalSell
  return getCartItemVendorCut(cartItem, item) + getCartItemStoreCut(cartItem, item)
}

export function getCartItemPrices(cartItem: any, item: BasicStockItemObject) {
  // Gets three prices for each sale item: the vendor cut, store cut, and total
  // Price is returned in cents
  return {
    storePrice: getCartItemStoreCut(cartItem, item),
    vendorPrice: getCartItemVendorCut(cartItem, item),
    totalPrice: getCartItemTotal(cartItem, item),
  }
}

export function getItemQuantity(item: BasicStockItemObject, saleItems: SaleItemObject[]) {
  if (item?.quantity === undefined || item?.quantity === null) return null
  const saleItem = saleItems?.find((i: SaleItemObject) => i?.itemId === item?.id)
  const cartQuantity = parseInt(saleItem?.quantity || '0')
  const itemQuantity = item?.quantity || 0
  return itemQuantity - cartQuantity
}

export function filterInventory(item: BasicStockItemObject, searchString) {
  if (!searchString || searchString === '') return []
  let res = true
  let terms = searchString.split(' ')
  // let itemMatch = `
  //     ${getItemSku(item) || ''}
  //     ${item?.artist || ''}
  //     ${item?.title || ''}
  //     ${item?.format || ''}
  //     ${item?.genre || ''}
  //     ${item?.country || ''}
  //     ${item?.section || ''}
  //     ${item?.tags ? item?.tags?.join(' ') : ''}
  //     ${item?.vendorName || ''}
  //     ${item?.googleBooksItem?.volumeInfo?.authors?.join(' ') || ''}
  //     ${item?.googleBooksItem?.volumeInfo?.publisher || ''}
  //     ${item?.googleBooksItem?.volumeInfo?.subtitle || ''}
  //     ${item?.googleBooksItem?.volumeInfo?.categories?.join(' ') || ''}
  //   `
  let itemMatch = `
        ${getItemSku(item) || ''}
        ${item?.artist || ''}
        ${item?.title || ''}
        ${item?.format || ''}
        ${item?.genre || ''}
        ${item?.section || ''}
        ${item?.tags ? item?.tags?.join(' ') : ''}
      `
  terms.forEach((term: string) => {
    if (!itemMatch.toLowerCase().includes(term.toLowerCase())) res = false
  })

  return res
}

export function sortInventory(a: BasicStockItemObject, b: BasicStockItemObject) {
  if (a?.quantity === b?.quantity) return 0
  if (a?.quantity < 1) return 1
  if (b?.quantity < 1) return -1
  return 0
}

export function makeGiftCardCode(giftCards: GiftCardObject[], length = 6) {
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  var charactersLength = characters.length
  let result = ''
  while (result === '' || giftCards?.map((g: GiftCardObject) => g?.giftCardCode).includes(result)) {
    result = ''
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
  }
  return result
}

function getIndexOfItemInCart(item, cart) {
  return cart?.items?.findIndex?.((cartItem) => cartItem.item_id === item?.id) || -1
}

function addNewItemToCart(item, cart, clerk) {
  const newItems = cart?.items || []
  newItems.push({
    item_id: item?.id,
    quantity: '1',
  })
  saveLog(`${getItemDisplayName(item)} added to cart${cart?.id ? ` (sale #${cart?.id})` : ''}.`, clerk?.id)
  return newItems
}

function updateItemQuantityInCart(item, cart, clerk, quantity = 1) {
  const newItems = cart?.items || []
  const index = getIndexOfItemInCart(item, cart)
  newItems[index].quantity = `${parseInt(newItems[index].quantity) + quantity}`
  saveLog(
    `${quantity} more ${getItemDisplayName(item)} added to cart${cart?.id ? ` (sale #${cart?.id})` : ''}.`,
    clerk?.id,
  )
  return newItems
}

export function addItemToCart(item, cart, setCart, clerk) {
  const index = getIndexOfItemInCart(item, cart)
  const newItems = index < 0 ? addNewItemToCart(item, cart, clerk) : updateItemQuantityInCart(item, cart, clerk)
  setCart({ items: newItems })
}

export function skuScan(inputValue, item, callbackFunction) {
  if (inputValue?.trim() === `${('00000' + item?.id || '').slice(-5)}`) {
    callbackFunction()
  }
}
