// Packages
import { useAtom } from 'jotai'
import { useState } from 'react'

// DB
import { cartAtom, confirmModalAtom } from 'lib/atoms'
import { useInventory, useStockItem } from 'lib/swr-hooks'
import { SaleItemObject, StockObject } from 'lib/types'

// Functions
import {
  getImageSrc,
  getItemDisplayName,
  getItemSku,
  writeCartItemPriceBreakdown,
  writeCartItemPriceTotal,
} from 'lib/data-functions'

// Components
import TextField from '@/components/inputs/text-field'

// Icons
import ArrowDown from '@mui/icons-material/ArrowDropDown'
import ArrowUp from '@mui/icons-material/ArrowDropUp'
import DeleteIcon from '@mui/icons-material/Delete'

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
  // SWR
  const { inventory } = useInventory()
  const { stockItem } = useStockItem(cartItem?.item_id)

  // Atoms
  const [cart, setCart] = useAtom(cartAtom)
  const [, setConfirmModal] = useAtom(confirmModalAtom)

  // State
  const [expanded, setExpanded] = useState(false)
  const item = inventory?.filter(
    (i: StockObject) => i.id === cartItem?.item_id
  )?.[0]

  // Functions
  function onChangeCart(e: any, property: string) {
    let newCart = { ...cart }
    if (newCart?.items && newCart?.items[index])
      newCart.items[index][property] = e.target.value
    setCart(newCart)
  }

  function onChangeQuantity(e: any) {
    if (stockItem?.quantity < parseInt(e?.target?.value)) {
      const newQuantity = e?.target?.value
      setConfirmModal({
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
              // layout="fill"
              // objectFit="cover"
              src={getImageSrc(item)}
              alt={item?.title || 'Inventory image'}
            />
            {!item?.is_gift_card && !item?.is_misc_item && (
              <div className="absolute w-20 h-8 bg-opacity-50 bg-black text-white text-sm flex justify-center items-center">
                {getItemSku(item)}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col w-full pt-2 px-2 justify-between">
          <div className="text-sm pl-1">{getItemDisplayName(item)}</div>
          <div className="text-red-500 self-end">
            {writeCartItemPriceBreakdown(cartItem, item)}
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
          {!item?.is_gift_card && !item?.is_misc_item && (
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
                error={parseInt(cartItem?.vendor_discount) > 100}
                valueNum={parseInt(cartItem?.vendor_discount)}
                onChange={(e: any) => onChangeCart(e, 'vendor_discount')}
              />
              <TextField
                className="w-1/3"
                inputLabel="STORE DISC."
                selectOnFocus
                max={100}
                inputType="number"
                endAdornment="%"
                error={parseInt(cartItem?.store_discount) > 100}
                valueNum={parseInt(cartItem?.store_discount)}
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
              {writeCartItemPriceBreakdown(cartItem, item)}
            </div>
            <div>
              <div className="font-bold self-center">
                {writeCartItemPriceTotal(cartItem, item)}
              </div>
              <div className="w-50 text-right">
                <button
                  className="py-2 text-tertiary hover:text-tertiary-dark"
                  onClick={() => deleteCartItem(cartItem?.item_id)}
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
