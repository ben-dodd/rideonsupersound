// Packages
import { useAtom } from 'jotai'

// DB
import {
  alertAtom,
  cartAtom,
  clerkAtom,
  confirmModalAtom,
  loadedItemIdAtom,
  sellSearchBarAtom,
  viewAtom,
} from 'lib/atoms'
import {
  useInventory,
  useLogs,
  useVendors,
  useWeather,
} from 'lib/database/read'
import { StockObject, VendorObject } from 'lib/types'

// Components
import Tooltip from '@mui/material/Tooltip'

// Icons
import AddIcon from '@mui/icons-material/AddCircleOutline'
import InfoIcon from '@mui/icons-material/Info'

// REVIEW add tooltips everywhere. Have ability to turn them off.

// Functions
import { getItemQuantity, getItemSku } from 'lib/data-functions'

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
      className={`flex w-full mb-2 p-4 text-black ${
        item?.quantity < 1 ? 'bg-pink-200' : 'bg-gray-200'
      }`}
    >
      <div className="w-1/6">
        <Tooltip title="You can change the price in the item details screen.">
          <div className="font-bold text-lg">{`$${(
            (item?.total_sell || 0) / 100
          )?.toFixed(2)}`}</div>
        </Tooltip>
        <Tooltip title="Go to the INVENTORY screen to receive or return items.">
          <div
            className={`${itemQuantity < 1 && 'text-red-500'}`}
          >{`${itemQuantity} in stock${
            (item?.quantity_hold || 0) + (item?.quantity_unhold || 0) > 0
              ? `, ${-(
                  (item?.quantity_hold || 0) + (item?.quantity_unhold || 0)
                )} on hold`
              : ''
          }${
            (item?.quantity_layby || 0) + (item?.quantity_unlayby || 0) > 0
              ? `, ${-(
                  (item?.quantity_layby || 0) + (item?.quantity_unlayby || 0)
                )} on layby`
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
              item?.needs_restock ? 'text-yellow-400' : 'text-red-400'
            } font-bold text-xl`}
          >
            {item?.needs_restock
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
                  onClick={clickOpenInventoryModal}
                >
                  <InfoIcon style={{ fontSize: '30px' }} />
                </button>
              </Tooltip>
            </div>
            <div className="self-center pl-1 pr-2 hidden sm:inline">
              <Tooltip title="Add item to list.">
                <button
                  className="icon-button-large text-black hover:text-blue-500"
                  disabled={!item?.total_sell}
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
            item?.is_new ? 'NEW' : item?.cond?.toUpperCase() || 'USED'
          }]`}</div>

          <div className="ml-4">
            {`${vendor ? `Selling for ${vendor?.name}` : ''}`}
          </div>
        </div>
      </div>
    </div>
  )
}
