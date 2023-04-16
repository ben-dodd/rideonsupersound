import { useState } from 'react'
import { SaleItemObject, SaleStateTypes } from 'lib/types/sale'
import TextField from 'components/inputs/text-field'
import { getImageSrc, getItemDisplayName, getItemSku } from 'lib/functions/displayInventory'
import DeleteIcon from '@mui/icons-material/Delete'
import { getCartItemTotal, writeCartItemPriceBreakdown } from 'lib/functions/sell'
import { useAppStore } from 'lib/store'
import { useBasicStockItem, useStockList } from 'lib/api/stock'
import { priceCentsString } from 'lib/utils'
import { deleteSaleItem } from 'lib/api/sale'
import { ArrowDropDown, ArrowDropUp, EventBusy } from '@mui/icons-material'
import { Tooltip } from '@mui/material'
import { useRouter } from 'next/router'

export default function EditSaleItem({ cartItem }: { cartItem: SaleItemObject }) {
  const { cart, openConfirm, closeConfirm, setCartItem, setAlert } = useAppStore()
  const { sale = {} } = cart || {}
  const { stockItem } = useBasicStockItem(`${cartItem?.itemId}`)
  const { stockList = [] } = useStockList()
  const stockListItem = stockList.find((stock) => stock?.id === cartItem?.itemId) || {}
  const router = useRouter()

  const { item = stockListItem || {}, quantities = { inStock: stockListItem?.quantity }, price = {} } = stockItem || {}
  const [expanded, setExpanded] = useState(false)

  function onChangeCart(e: any, property: string) {
    setCartItem(cartItem?.itemId, { [property]: e.target.value })
  }

  function onChangeQuantity(e: any) {
    if (quantities?.inStock < parseInt(e?.target?.value)) {
      const newQuantity = e?.target?.value
      openConfirm({
        open: true,
        title: 'Are you sure you want to add to cart?',
        styledMessage: (
          <span>
            There is not enough of <b>{getItemDisplayName(item)}</b> in stock. Are you sure you want to change the
            quantity to {e?.target?.value}?
          </span>
        ),
        yesText: "YES, I'M SURE",
        action: () => onChangeCart({ target: { value: newQuantity } }, 'quantity'),
      })
    } else onChangeCart(e, 'quantity')
  }

  function handleClickRefundItem() {
    openConfirm({
      open: true,
      title: 'Refund Item?',
      message: 'Refund Item? (If this item was added in error, deleting may be more appropriate.)',
      yesText: 'Yes',
      noText: 'No',
      action: () => {
        setCartItem(cartItem?.itemId, { isRefunded: true })
        setAlert({
          open: true,
          type: 'success',
          message: `ITEM REFUNDED`,
        })
        closeConfirm()
      },
    })
  }

  async function handleClickDeleteItem() {
    openConfirm({
      open: true,
      title: 'Delete Item?',
      message:
        'Delete Item? (If this item was sold to the customer and is being returned, use the refund item button instead.)',
      yesText: 'Yes',
      noText: 'No',
      action: async () => {
        if (cartItem?.id)
          // Cart has been saved to the database, delete sale_item
          await deleteSaleItem(cartItem?.id)
        setCartItem(cartItem?.itemId, { isDeleted: true })
        setAlert({
          open: true,
          type: 'success',
          message: `ITEM REMOVED FROM SALE`,
        })
        closeConfirm()
      },
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
            {!miscOrGiftItem && (
              <div className="absolute w-20 h-8 bg-opacity-50 bg-black text-white text-sm flex justify-center items-center">
                {getItemSku(item)}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col w-full pt-2 px-2 justify-between">
          <div
            className={`text-sm pl-1${!miscOrGiftItem ? ' link-blue' : ''}`}
            onClick={miscOrGiftItem ? null : () => router.push(`/stock/${item?.id}`)}
          >
            {getItemDisplayName(item)}
          </div>
          <div className="text-red-500 self-end">{writeCartItemPriceBreakdown(cartItem, stockItem)}</div>
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
                valueNum={parseInt(cartItem?.quantity)}
                onChange={(e: any) => onChangeQuantity(e)}
              />
              <TextField
                className="mx-2 w-1/3"
                inputLabel="VEND. DISC."
                selectOnFocus
                max={100}
                inputType="number"
                endAdornment="%"
                error={parseInt(cartItem?.vendorDiscount) > 100}
                valueNum={parseInt(cartItem?.vendorDiscount)}
                onChange={(e: any) => onChangeCart(e, 'vendorDiscount')}
              />
              <TextField
                className="w-1/3"
                inputLabel="STORE DISC."
                selectOnFocus
                max={100}
                inputType="number"
                endAdornment="%"
                error={parseInt(cartItem?.storeDiscount) > 100}
                valueNum={parseInt(cartItem?.storeDiscount)}
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
            <div className="font-bold">{writeCartItemPriceBreakdown(cartItem, stockItem)}</div>
            <div>
              <div className="font-bold self-center">{priceCentsString(getCartItemTotal(cartItem, item, price))}</div>
              <div className="w-50 text-right">
                {sale?.state === SaleStateTypes.Completed ? (
                  <Tooltip title="Refund Item">
                    <span>
                      <button className="py-2 text-tertiary hover:text-tertiary-dark" onClick={handleClickRefundItem}>
                        <EventBusy />
                      </button>
                    </span>
                  </Tooltip>
                ) : (
                  <div />
                )}
                <Tooltip title="Delete Item">
                  <span>
                    <button className="py-2 text-tertiary hover:text-tertiary-dark" onClick={handleClickDeleteItem}>
                      <DeleteIcon />
                    </button>
                  </span>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
