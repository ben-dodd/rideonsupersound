import { useState } from 'react'
import dynamic from 'next/dynamic'
import { SaleItemObject } from 'lib/types/sale'
import TextField from 'components/inputs/text-field'
import { getImageSrc, getItemDisplayName, getItemSku } from 'lib/functions/displayInventory'
import DeleteIcon from '@mui/icons-material/Delete'
import { getCartItemTotal, writeCartItemPriceBreakdown } from 'lib/functions/sell'
import { useAppStore } from 'lib/store'
import { useStockList } from 'lib/api/stock'
import { priceCentsString } from 'lib/utils'
import { deleteSale, deleteSaleItem } from 'lib/api/sale'
import { ViewProps } from 'lib/store/types'
import { ArrowDropDown, ArrowDropUp, PanTool } from '@mui/icons-material'
import { BasicStockItemObject, BasicStockObject } from 'lib/types/stock'
const Tooltip = dynamic(() => import('@mui/material/Tooltip'))
// TODO make list items share more components

export default function SellListItem({ cartItem, item }: { cartItem: SaleItemObject; item: BasicStockItemObject }) {
  const { cart, openConfirm, setCartItem, setCart, resetCart, closeView, setAlert } = useAppStore()
  const { sale = {}, items = [], transactions = [] } = cart || {}
  const { stockList = [] } = useStockList()
  const stockListItem = stockList.find((stock) => stock?.id === cartItem?.itemId) || {}

  // const { item = stockListItem || {}, quantities = { inStock: stockListItem?.quantity }, price = {} } = stockItem || {}
  const [expanded, setExpanded] = useState(false)

  function onChangeCart(e: any, property: string) {
    setCartItem(cartItem?.itemId, { [property]: e.target.value })
  }

  function onChangeQuantity(e: any) {
    if (item?.quantity < parseInt(e?.target?.value)) {
      const newQuantity = e?.target?.value
      openConfirm({
        open: true,
        title: 'Are you sure you want to add to cart?',
        type: 'warning',
        styledMessage: (
          <div>
            <div>
              {item?.quantity === 1 ? (
                <span>There is only 1 copy of </span>
              ) : (
                <span>There are only {item?.quantity} copies of </span>
              )}
              <b>{getItemDisplayName(item)}</b> in stock. Are you sure you want to sell {e?.target?.value}?
            </div>
            <div className="font-bold text-red-500 text-sm">THIS WILL PUT THE STOCK COUNT INTO NEGATIVES</div>
          </div>
        ),
        yesText: "YES, I'M SURE",
        action: () => onChangeCart({ target: { value: newQuantity } }, 'quantity'),
      })
    } else onChangeCart(e, 'quantity')
  }

  function deleteCartItem(cartItem) {
    let updatedCartItems = items?.filter((item) => item?.itemId !== cartItem?.itemId)
    if (cartItem?.id)
      // Cart has been saved to the database, delete sale_item
      deleteSaleItem(cartItem?.id)
    if (updatedCartItems.length < 1 && transactions?.length < 1) {
      // No items left and no transactions, delete cart
      closeView(ViewProps.cart)
      resetCart()
      if (sale?.id) deleteSale(sale?.id)
    } else {
      setCart({
        items: updatedCartItems,
      })
    }
    setAlert({
      open: true,
      type: 'success',
      message: `ITEM REMOVED FROM CART`,
    })
  }

  const checkEditInputs = () => {
    const update: SaleItemObject = {}
    if (Number.isNaN(cartItem?.quantity) || Number(cartItem?.quantity) < 1) update.quantity = '1'
    if (Number.isNaN(cartItem?.storeDiscount) || Number(cartItem?.storeDiscount) < 0) update.storeDiscount = null
    if (Number.isNaN(cartItem.vendorDiscount) || Number(cartItem?.vendorDiscount) < 0) update.vendorDiscount = null
    if (Number(cartItem?.storeDiscount) > 100) update.storeDiscount = '100'
    if (Number(cartItem?.vendorDiscount) > 100) update.vendorDiscount = '100'
    if (Object.keys(update).length > 0) setCartItem(cartItem?.itemId, update)
  }

  const miscOrGiftItem = item?.isMiscItem || item?.isGiftCard

  return (
    <>
      <div
        className={`flex w-full relative pt cursor-pointer mt-2`}
        onClick={() => {
          if (expanded) checkEditInputs()
          setExpanded((expanded) => !expanded)
        }}
      >
        <div className="w-20">
          <div className="w-20 h-20 aspect-ratio-square relative">
            <img
              className="object-cover w-full h-full absolute"
              src={getImageSrc(item)}
              alt={item?.title || 'Stock image'}
            />
            {!item?.isGiftCard && !item?.isMiscItem && (
              <div className="absolute w-20 h-8 bg-opacity-50 bg-black text-white text-sm flex justify-center items-center">
                {getItemSku(item)}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col w-full pt-2 px-2 justify-between">
          <div className="flex justify-between">
            <div className="text-sm pl-1">{getItemDisplayName(item)}</div>
            {cartItem?.holdId ? (
              <Tooltip title={'Item was previously on hold.'}>
                <PanTool style={{ fontSize: 12 }} className="text-blue-200" />
              </Tooltip>
            ) : (
              <div />
            )}
          </div>
          <div className="text-red-500 self-end">{writeCartItemPriceBreakdown(cartItem, item)}</div>
          <div className="self-end text-xs">
            {expanded ? (
              <div>
                CLOSE PANEL
                <ArrowDropUp />
              </div>
            ) : (
              <div>
                CLICK TO EDIT ITEM
                <ArrowDropDown />
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        className={`text-black bg-white px-2 overflow-y-hidden transition-height duration-200 border-b ${
          expanded ? (miscOrGiftItem ? 'h-48' : 'h-64') : 'h-0'
        }`}
      >
        <div>
          {!miscOrGiftItem && (
            <div className="flex justify-between items-end">
              <TextField
                className="w-1/3"
                inputLabel="QTY"
                selectOnFocus
                min={1}
                inputType="number"
                valueNum={parseInt(cartItem?.quantity ?? '1')}
                onChange={(e: any) => onChangeQuantity(e)}
              />
              <TextField
                className="mx-2 w-1/3"
                inputLabel="VEND. DISC."
                selectOnFocus
                max={100}
                inputType="number"
                endAdornment="%"
                error={parseInt(cartItem?.vendorDiscount ?? '0') > 100}
                valueNum={parseInt(cartItem?.vendorDiscount ?? '0')}
                onChange={(e: any) => onChangeCart(e, 'vendorDiscount')}
              />
              <TextField
                className="w-1/3"
                inputLabel="STORE DISC."
                selectOnFocus
                max={100}
                inputType="number"
                endAdornment="%"
                error={parseInt(cartItem?.storeDiscount ?? '0') > 100}
                valueNum={parseInt(cartItem?.storeDiscount ?? '0')}
                onChange={(e: any) => onChangeCart(e, 'storeDiscount')}
              />
            </div>
          )}
          <TextField
            multiline
            rows={2}
            divClass="py-2"
            inputLabel="NOTES"
            value={cartItem?.note ?? ''}
            onChange={(e: any) => onChangeCart(e, 'note')}
          />
          <div className="flex w-full justify-between place-start">
            <div className="font-bold">{writeCartItemPriceBreakdown(cartItem, item)}</div>
            <div>
              <div className="font-bold self-center">{priceCentsString(getCartItemTotal(cartItem, item))}</div>
              <div className="w-50 text-right">
                <button
                  className="py-2 text-tertiary hover:text-tertiary-dark"
                  onClick={() => deleteCartItem(cartItem)}
                >
                  <DeleteIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
