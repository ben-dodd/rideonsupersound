// Packages
import { useAtom } from 'jotai'

// DB
import {
  cartAtom,
  viewAtom,
  clerkAtom,
  confirmModalAtom,
  loadedItemIdAtom,
  alertAtom,
  sellSearchBarAtom,
} from '@/lib/atoms'
import { useWeather, useInventory, useLogs, useVendors } from '@/lib/swr-hooks'
import { StockObject, VendorObject } from '@/lib/types'

// Components
import Image from 'next/image'
import Tooltip from '@mui/material/Tooltip'

// Icons
import AddIcon from '@mui/icons-material/AddCircleOutline'
import InfoIcon from '@mui/icons-material/Info'

// REVIEW add tooltips everywhere. Have ability to turn them off.

// Functions
import {
  getItemSku,
  getItemDisplayName,
  getItemQuantity,
  getImageSrc,
} from '@/lib/data-functions'
import { saveLog } from '@/lib/db-functions'
import dayjs from 'dayjs'

type ListItemProps = {
  item: StockObject
}

export default function ListItem({ item }: ListItemProps) {
  // SWR
  const { weather } = useWeather()
  const { inventory } = useInventory()
  const { vendors } = useVendors()
  const { logs, mutateLogs } = useLogs()

  // Atoms
  const [cart, setCart] = useAtom(cartAtom)
  const [sellSearch, setSearch] = useAtom(sellSearchBarAtom)
  const [view, setView] = useAtom(viewAtom)
  const [loadedItemId, setLoadedItemId] = useAtom(loadedItemIdAtom)
  const [, setConfirmModal] = useAtom(confirmModalAtom)
  const [clerk] = useAtom(clerkAtom)
  const [, setAlert] = useAtom(alertAtom)

  // Constants
  const itemQuantity = getItemQuantity(item, cart?.items)
  const vendor =
    vendors?.filter(
      (vendor: VendorObject) => vendor?.id === item?.vendor_id
    )[0] || null

  function clickOpenInventoryModal() {
    setLoadedItemId({ ...loadedItemId, inventory: item?.id })
  }

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
      <div className="flex flex-col justify-between pl-2 w-full">
        <div>
          <div className="flex justify-between border-b items-center border-gray-400">
            <div>
              <div className="font-bold text-md">{`${
                item?.title || 'Untitled'
              }`}</div>
              <div className="text-md">{`${item?.artist || 'Untitled'}`}</div>
            </div>
            <div
              className={`${
                item?.needs_restock ? 'text-yellow-400' : 'text-red-400'
              } font-bold text-3xl`}
            >
              {item?.needs_restock
                ? 'PLEASE RESTOCK!'
                : itemQuantity < 1
                ? 'OUT OF STOCK'
                : ''}
            </div>
          </div>
          <div className="text-sm text-green-800">{`${
            item?.section ? `${item.section} / ` : ''
          }${item?.format} [${
            item?.is_new ? 'NEW' : item?.cond?.toUpperCase() || 'USED'
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
              item?.quantity_hold || 0 > 0
                ? `, ${-(item?.quantity_hold || 0)} on hold`
                : ''
            }${
              item?.quantity_layby || 0 > 0
                ? `, ${-(item?.quantity_layby || 0)} on layby`
                : ''
            }`}</div>
          </Tooltip>
          <Tooltip title="You can change the price in the item details screen.">
            <div className="text-xl">{`$${(
              (item?.total_sell || 0) / 100
            )?.toFixed(2)}`}</div>
          </Tooltip>
        </div>
      </div>
      <div className="self-center pl-8 hidden sm:inline">
        <Tooltip title="View and edit item details.">
          <button
            className="icon-button-large text-black hover:text-blue-500"
            onClick={clickOpenInventoryModal}
          >
            <InfoIcon style={{ fontSize: '40px' }} />
          </button>
        </Tooltip>
      </div>
      <div className="self-center pl-1 pr-2 hidden sm:inline">
        <Tooltip title="Add item to sale.">
          <button
            className="icon-button-large text-black hover:text-blue-500"
            disabled={!item?.total_sell}
            onClick={null}
          >
            <AddIcon style={{ fontSize: '40px' }} />
          </button>
        </Tooltip>
      </div>
    </div>
  )
}
