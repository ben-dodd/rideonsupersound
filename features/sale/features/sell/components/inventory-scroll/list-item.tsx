// Packages
import { useAtom } from 'jotai'

// DB
import {
  cartAtom,
  clerkAtom,
  confirmModalAtom,
  loadedItemIdAtom,
  sellSearchBarAtom,
  viewAtom,
} from 'lib/atoms'
import { useVendorNames } from 'lib/database/read'
import { StockObject, VendorObject } from 'lib/types'

// Components
import Tooltip from '@mui/material/Tooltip'

// Icons
import AddIcon from '@mui/icons-material/AddCircleOutline'
import InfoIcon from '@mui/icons-material/Info'

// REVIEW add tooltips everywhere. Have ability to turn them off.

// Functions
import {
  getHoldQuantity,
  getImageSrc,
  getItemDisplayName,
  getItemSku,
  getLaybyQuantity,
} from 'features/inventory/features/display-inventory/lib/functions'
import {
  addItemToCart,
  getItemQuantity,
  openCart,
  skuScan,
} from '../../lib/functions'

type ListItemProps = {
  item: StockObject
  weather: Object
  geolocation: Object
}

export default function ListItem({
  item,
  weather,
  geolocation,
}: ListItemProps) {
  // SWR
  const { vendors } = useVendorNames()

  // Atoms
  const [cart, setCart] = useAtom(cartAtom)
  const [sellSearch, setSearch] = useAtom(sellSearchBarAtom)
  const [view, setView] = useAtom(viewAtom)
  const [loadedItemId, setLoadedItemId] = useAtom(loadedItemIdAtom)
  const [, setConfirmModal] = useAtom(confirmModalAtom)
  const [clerk] = useAtom(clerkAtom)

  // Constants
  const itemQuantity = getItemQuantity(item, cart?.items)
  const vendorName =
    vendors?.find((vendor: VendorObject) => vendor?.id === item?.vendorId)
      ?.name || ''

  // Functions
  function clickAddToCart() {
    if (itemQuantity < 1) {
      setConfirmModal({
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
    if (!cart?.date_sale_opened) openCart(setCart, clerk, weather, geolocation)
    addItemToCart(item, cart, setCart, clerk)
    setView({ ...view, cart: true })
    setSearch('')
  }

  function clickOpenInventoryModal() {
    setLoadedItemId({ ...loadedItemId, sell: item?.id })
  }
  // REVIEW Add in way for mobile view to add items and access info
  // Disable mobile only for now
  // <div
  //   className="flex w-full mb-2 bg-blue-100 relative"
  //   onClick={clickAddToCart}
  //   onDoubleClick={clickOpenInventoryModal}
  // >

  skuScan(sellSearch, item, handleAddItemToCart)

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
          <div className="text-sm text-green-800">{`${
            item?.section ? `${item.section} / ` : ''
          }${item?.format} [${
            item?.isNew ? 'NEW' : item?.cond?.toUpperCase() || 'USED'
          }]`}</div>
        </div>
        <div className="text-xs">
          {`${vendorName ? `Selling for ${vendorName}` : ''}`}
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
            disabled={!item?.totalSell}
            onClick={clickAddToCart}
          >
            <AddIcon style={{ fontSize: '40px' }} />
          </button>
        </Tooltip>
      </div>
    </div>
  )
}
