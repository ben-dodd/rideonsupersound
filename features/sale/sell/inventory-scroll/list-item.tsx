import { StockObject } from 'lib/types'
import Tooltip from '@mui/material/Tooltip'
import AddIcon from '@mui/icons-material/AddCircleOutline'
import InfoIcon from '@mui/icons-material/Info'
import {
  getHoldQuantity,
  getImageSrc,
  getItemDisplayName,
  getItemSku,
  getLaybyQuantity,
} from 'lib/functions/displayInventory'
import { getItemQuantity, skuScan } from '../../../../../lib/functions/sell'
import { useRouter } from 'next/router'
import { useAppStore } from 'lib/store'
import { useClerk } from 'lib/api/clerk'

export default function ListItem({ item }: { item: StockObject }) {
  const { cart, sellSearchBar, openConfirm, addCartItem } = useAppStore()
  const router = useRouter()
  const { clerk } = useClerk()

  const itemQuantity = getItemQuantity(item, cart?.items)

  function clickAddToCart() {
    if (itemQuantity < 1) {
      openConfirm({
        open: true,
        title: 'Are you sure you want to add to cart?',
        styledMessage: (
          <span>
            There is no more of <b>{getItemDisplayName(item)}</b> in stock. Are
            you sure you want to add to cart?
          </span>
        ),
        yesText: "YES, I'M SURE",
        action: () => handleAddItemToCart(),
      })
    } else handleAddItemToCart()
  }

  function handleAddItemToCart() {
    addCartItem({ itemId: item?.id, quantity: '1' }, clerk?.id)
  }

  skuScan(sellSearchBar, item, handleAddItemToCart)

  return (
    <div
      className={`flex w-full mb-2 text-black ${
        item?.quantity < 1 ? 'bg-pink-200' : 'bg-gray-200'
      }`}
    >
      <div className="w-imageMed">
        <div className={`w-imageMed${item?.quantity < 1 ? ' opacity-50' : ''}`}>
          <img
            className="object-cover h-imageMed w-full aspect-ratio-square"
            src={getImageSrc(item)}
            alt={item?.title || 'Inventory image'}
          />
          <div className="h-8 text-lg font-bold text-center bg-black text-white w-imageMed">
            {getItemSku(item)}
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full px-2">
        <div className="flex justify-between border-b items-center border-gray-400">
          <div>
            <div className="font-bold text-md">{`${
              item?.title || 'Untitled'
            }`}</div>
            <div className="text-md">{`${item?.artist || 'Untitled'}`}</div>
          </div>
          <div className="flex py-2">
            <div className="self-center pl-8 hidden sm:inline">
              <Tooltip title="View and edit item details.">
                <button
                  className="icon-button-large text-black hover:text-blue-500"
                  onClick={() => router.push(`/stock/${item?.id}`)}
                >
                  <InfoIcon style={{ fontSize: '40px' }} />
                </button>
              </Tooltip>
            </div>
            <div className="self-center pl-1 hidden sm:inline">
              <Tooltip title="Add item to sale.">
                <button
                  className="icon-button-large text-black hover:text-blue-500"
                  disabled={!item?.totalSell}
                  onClick={clickAddToCart}
                >
                  <AddIcon style={{ fontSize: '40px' }} />
                </button>
              </Tooltip>
            </div>
          </div>
        </div>
        <div className="flex w-full h-full justify-between">
          <div className="flex flex-col justify-between w-full">
            <div className="flex justify-between items-end">
              <div>
                <div className="text-sm text-green-800">{`${
                  item?.section ? `${item.section} / ` : ''
                }${item?.format} [${
                  item?.isNew ? 'NEW' : item?.cond?.toUpperCase() || 'USED'
                }]`}</div>
                <div className="text-sm">{`Selling for ${item?.vendorName}`}</div>
              </div>
              <div
                className={`${
                  item?.needsRestock ? 'text-yellow-400' : 'text-red-400'
                } font-bold text-2xl`}
              >
                {item?.needsRestock
                  ? 'PLEASE RESTOCK!'
                  : itemQuantity < 1
                  ? 'OUT OF STOCK'
                  : ''}
              </div>
            </div>

            <div className="flex justify-between items-end">
              <Tooltip title="Go to the INVENTORY screen to receive or return items.">
                <div
                  className={`text-md ${itemQuantity < 1 && 'text-red-500'}`}
                >{`${itemQuantity} in stock${
                  getHoldQuantity(item) > 0
                    ? `, ${getHoldQuantity(item)} on hold`
                    : ''
                }${
                  getLaybyQuantity(item) > 0
                    ? `, ${getLaybyQuantity(item)} on layby`
                    : ''
                }`}</div>
              </Tooltip>
              <Tooltip title="You can change the price in the item details screen.">
                <div className="text-xl">{`$${(
                  (item?.totalSell || 0) / 100
                )?.toFixed(2)}`}</div>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
