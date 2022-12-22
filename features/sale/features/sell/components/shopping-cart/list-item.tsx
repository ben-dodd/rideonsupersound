import { useEffect, useState } from 'react'
import { SaleItemObject } from 'lib/types'
import TextField from 'components/inputs/text-field'
import {
  getImageSrc,
  getItemDisplayName,
  getItemSku,
} from 'features/inventory/features/display-inventory/lib/functions'
import ArrowDown from '@mui/icons-material/ArrowDropDown'
import ArrowUp from '@mui/icons-material/ArrowDropUp'
import DeleteIcon from '@mui/icons-material/Delete'
import {
  getCartItemPrice,
  getCartItemTotal,
  writeCartItemPriceBreakdown,
} from '../../lib/functions'
import { useAppStore } from 'lib/store'
import {
  useSaleStockItems,
  useSimpleStockItem,
  useStockItem,
  useStockList,
} from 'lib/api/stock'
import { priceCentsString } from 'lib/utils'

type SellListItemProps = {
  cartItem: SaleItemObject
  deleteCartItem?: Function
}

export default function SellListItem({
  cartItem,
  deleteCartItem,
}: SellListItemProps) {
  const { openConfirm, setCartItem } = useAppStore()
  const { stockItem } = useStockItem(`${cartItem?.itemId}`)
  const { stockList = [] } = useStockList()

  const {
    item = stockList?.find((stock) => stock?.id === cartItem?.itemId) || {},
    quantities = {},
    price = {},
  } = stockItem || {}
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
            There is not enough of <b>{getItemDisplayName(item)}</b> in stock.
            Are you sure you want to change the quantity to {e?.target?.value}?
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
              src={getImageSrc(item)}
              alt={item?.title || 'Inventory image'}
            />
            {!item?.isGiftCard && !item?.isMiscItem && (
              <div className="absolute w-20 h-8 bg-opacity-50 bg-black text-white text-sm flex justify-center items-center">
                {getItemSku(item)}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col w-full pt-2 px-2 justify-between">
          <div className="text-sm pl-1">{getItemDisplayName(item)}</div>
          <div className="text-red-500 self-end">
            {writeCartItemPriceBreakdown(cartItem, item, price)}
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
          {!item?.isGiftCard && !item?.isMiscItem && (
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
            <div className="font-bold">
              {writeCartItemPriceBreakdown(cartItem, item, price)}
            </div>
            <div>
              <div className="font-bold self-center">
                {priceCentsString(getCartItemTotal(cartItem, item))}
              </div>
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
