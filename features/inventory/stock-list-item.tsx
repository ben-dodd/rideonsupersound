import { getItemQuantity } from 'lib/functions/sell'
import { StockObject, VendorObject } from 'lib/types'
import AddIcon from '@mui/icons-material/AddCircleOutline'
import InfoIcon from '@mui/icons-material/Info'
import Tooltip from '@mui/material/Tooltip'
import {
  getHoldQuantity,
  getImageSrc,
  getItemSku,
  getLaybyQuantity,
} from '../../lib/functions/displayInventory'
import { useAppStore } from 'lib/store'
import { useVendors } from 'lib/api/vendor'

type ListItemProps = {
  item: StockObject
}

export default function StockListItem({ item }: ListItemProps) {
  const { vendors } = useVendors()
  const { cart } = useAppStore()

  // Constants
  const itemQuantity = getItemQuantity(item, cart?.items)
  const vendor =
    vendors?.find((vendor: VendorObject) => vendor?.id === item?.vendorId) ||
    null

  return (
    <div
      className={`flex w-full mb-2 text-black ${
        item?.quantity < 1 ? 'bg-pink-200' : 'bg-gray-200'
      }`}
    >
      <div className="w-imageMed">
        <div
          className={`w-imageMed h-imageMed${
            item?.quantity < 1 ? ' opacity-50' : ''
          }`}
        >
          <img
            className="object-cover h-imageMed"
            width="100%"
            // layout="fill"
            // objectFit="cover"
            src={getImageSrc(item)}
            alt={item?.title || 'Inventory image'}
          />
        </div>
        <div className="text-lg font-bold text-center bg-black text-white">
          {getItemSku(item)}
        </div>
      </div>
      <div className="flex">
        <div className="flex justify-between border-b items-center border-gray-400">
          <div>
            <div className="font-bold text-md">{`${
              item?.title || 'Untitled'
            }`}</div>
            <div className="text-md">{`${item?.artist || 'Untitled'}`}</div>
          </div>
          <div
            className={`${
              item?.needsRestock ? 'text-yellow-400' : 'text-red-400'
            } font-bold text-3xl`}
          >
            {item?.needsRestock
              ? 'PLEASE RESTOCK!'
              : itemQuantity < 1
              ? 'OUT OF STOCK'
              : ''}
          </div>
        </div>
        <div className="flex flex-col justify-between pl-2 w-full">
          <div>
            <div className="text-sm text-green-800">{`${
              item?.section ? `${item.section} / ` : ''
            }${item?.format} [${
              item?.isNew ? 'NEW' : item?.cond?.toUpperCase() || 'USED'
            }]`}</div>
          </div>
          <div className="text-xs">
            {`${vendor ? `Selling for ${vendor?.name}` : ''}`}
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
        <div className="self-center pl-8 hidden sm:inline">
          <Tooltip title="View and edit item details.">
            <button
              className="icon-button-large text-black hover:text-blue-500"
              onClick={null}
            >
              <InfoIcon style={{ fontSize: '40px' }} />
            </button>
          </Tooltip>
        </div>
        <div className="self-center pl-1 pr-2 hidden sm:inline">
          <Tooltip title="Add item to sale.">
            <button
              className="icon-button-large text-black hover:text-blue-500"
              disabled={!item?.totalSell}
              onClick={null}
            >
              <AddIcon style={{ fontSize: '40px' }} />
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}
