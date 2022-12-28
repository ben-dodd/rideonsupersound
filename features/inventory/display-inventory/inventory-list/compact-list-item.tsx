import { StockObject, VendorObject } from 'lib/types'
import Tooltip from '@mui/material/Tooltip'
import { getItemQuantity } from 'lib/functions/sell'
import AddIcon from '@mui/icons-material/AddCircleOutline'
import InfoIcon from '@mui/icons-material/Info'
import {
  getHoldQuantity,
  getItemSku,
  getLaybyQuantity,
} from '../../../../../lib/functions/displayInventory'
import { useVendors } from 'lib/api/vendor'
import { useAppStore } from 'lib/store'
import { useRouter } from 'next/router'

// REVIEW add tooltips everywhere. Have ability to turn them off.

// Functions

type ListItemProps = {
  item: StockObject
}

export default function ListItem({ item }: ListItemProps) {
  const { vendors } = useVendors()
  const { cart } = useAppStore()
  const router = useRouter()
  const id = router.query.id

  // Constants
  const itemQuantity = getItemQuantity(item, cart?.items)
  const vendor =
    vendors?.find((vendor: VendorObject) => vendor?.id === item?.vendorId) ||
    null

  // function clickOpenInventoryModal() {
  //   setLoadedItemId({ ...loadedItemId, inventory: item?.id })
  // }

  return (
    <div
      className={`flex w-full mb-2 p-4 text-black ${
        item?.quantity < 1 ? 'bg-pink-200' : 'bg-gray-200'
      }`}
    >
      <div className="w-1/6">
        <Tooltip title="You can change the price in the item details screen.">
          <div className="font-bold text-lg">{`$${(
            (item?.totalSell || 0) / 100
          )?.toFixed(2)}`}</div>
        </Tooltip>
        <Tooltip title="Go to the INVENTORY screen to receive or return items.">
          <div
            className={`${itemQuantity < 1 && 'text-red-500'}`}
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
      </div>
      <div className="w-full">
        <div className="flex w-full justify-between border-b border-gray-400">
          <div className="flex">
            <div>{`[${getItemSku(item)}]`}</div>
            <div className="font-bold text-md px-2">{`${
              item?.title || 'Untitled'
            }`}</div>
            <div className="text-md">{`${item?.artist || 'Untitled'}`}</div>
          </div>
          <div
            className={`${
              item?.needsRestock ? 'text-yellow-400' : 'text-red-400'
            } font-bold text-xl`}
          >
            {item?.needsRestock
              ? 'PLEASE RESTOCK!'
              : itemQuantity < 1
              ? 'OUT OF STOCK'
              : ''}
          </div>
          <div className="flex">
            <div className="self-center pl-8 hidden sm:inline">
              <Tooltip title="View and edit item details.">
                <button
                  className="icon-button-large text-black hover:text-blue-500"
                  onClick={null}
                >
                  <InfoIcon style={{ fontSize: '30px' }} />
                </button>
              </Tooltip>
            </div>
            <div className="self-center pl-1 pr-2 hidden sm:inline">
              <Tooltip title="Add item to list.">
                <button
                  className="icon-button-large text-black hover:text-blue-500"
                  disabled={!item?.totalSell}
                  onClick={null}
                >
                  <AddIcon style={{ fontSize: '30px' }} />
                </button>
              </Tooltip>
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="text-green-800">{`${
            item?.section ? `${item.section} / ` : ''
          }${item?.format} [${
            item?.isNew ? 'NEW' : item?.cond?.toUpperCase() || 'USED'
          }]`}</div>

          <div className="ml-4">
            {`${vendor ? `Selling for ${vendor?.name}` : ''}`}
          </div>
        </div>
      </div>
    </div>
  )
}
