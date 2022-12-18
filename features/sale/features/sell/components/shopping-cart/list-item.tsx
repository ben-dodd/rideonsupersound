import { useState } from 'react'
import { SaleItemObject, StockObject } from 'lib/types'
import TextField from 'components/inputs/text-field'
import {
  getImageSrc,
  getItemDisplayName,
  getItemSku,
} from 'features/inventory/features/display-inventory/lib/functions'
import { priceCentsString } from 'lib/utils'
import ArrowDown from '@mui/icons-material/ArrowDropDown'
import ArrowUp from '@mui/icons-material/ArrowDropUp'
import DeleteIcon from '@mui/icons-material/Delete'
import {
  getCartItemPrice,
  writeCartItemPriceBreakdown,
} from '../../lib/functions'
import { useAppStore } from 'lib/store'
import { useStockItem, useStockList } from 'lib/api/stock'

type SellListItemProps = {
  index: number
  cartItem: SaleItemObject
  deleteCartItem?: Function
}

export default function SellListItem({
  index,
  cartItem,
  deleteCartItem,
}: SellListItemProps) {
  console.log(cartItem)
  const { openConfirm, setCartItem } = useAppStore()
  const { stockItem } = useStockItem(`${cartItem?.itemId}`)
  const [expanded, setExpanded] = useState(false)

  // Functions
  function onChangeCart(e: any, property: string) {
    setCartItem(index, { [property]: e.target.value })
  }

  function onChangeQuantity(e: any) {
    if (stockItem?.quantity < parseInt(e?.target?.value)) {
      const newQuantity = e?.target?.value
      openConfirm({
        open: true,
        title: 'Are you sure you want to add to cart?',
        styledMessage: (
          <span>
            There is not enough of <b>{getItemDisplayName(stockItem)}</b> in
            stock. Are you sure you want to change the quantity to{' '}
            {e?.target?.value}?
          </span>
        ),
        yesText: "YES, I'M SURE",
        action: () =>
          onChangeCart({ target: { value: newQuantity } }, 'quantity'),
      })
    } else onChangeCart(e, 'quantity')
  }

  return (
    <>
      <div
        className="flex w-full bg-black text-white relative pt mb-2 cursor-pointer"
        onClick={() => setExpanded((e) => !e)}
      >
        <div className="w-20">
          <div className="w-20 h-20 relative">
            <img
              className="object-cover absolute"
              // layout="fill"
              // objectFit="cover"
              src={getImageSrc(stockItem)}
              alt={stockItem?.title || 'Inventory image'}
            />
            {!stockItem?.isGiftCard && !stockItem?.isMiscItem && (
              <div className="absolute w-20 h-8 bg-opacity-50 bg-black text-white text-sm flex justify-center items-center">
                {getItemSku(stockItem)}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col w-full pt-2 px-2 justify-between">
          <div className="text-sm pl-1">{getItemDisplayName(stockItem)}</div>
          <div className="text-red-500 self-end">
            {writeCartItemPriceBreakdown(cartItem, stockItem)}
          </div>
          <div className="self-end text-xs">
            {expanded ? (
              <div>
                CLOSE PANEL
                <ArrowUp />
              </div>
            ) : (
              <div>
                CLICK TO EDIT ITEM
                <ArrowDown />
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        className={`text-black bg-white px-2 overflow-y-hidden transition-height duration-200 ${
          expanded ? 'h-64' : 'h-0'
        }`}
      >
        <div>
          {!stockItem?.isGiftCard && !stockItem?.isMiscItem && (
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
                onChange={(e: any) => onChangeCart(e, 'vendor_discount')}
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
                onChange={(e: any) => onChangeCart(e, 'store_discount')}
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
            <div className="font-bold">
              {writeCartItemPriceBreakdown(cartItem, stockItem)}
            </div>
            <div>
              <div className="font-bold self-center">
                {/* {priceCentsString(getCartItemPrice(cartItem, stockItem))} */}
              </div>
              <div className="w-50 text-right">
                <button
                  className="py-2 text-tertiary hover:text-tertiary-dark"
                  onClick={() => deleteCartItem(cartItem?.itemId)}
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
