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
import {
  useWeather,
  useInventory,
  useLogs,
  useVendors,
  useStockItemImage,
} from '@/lib/swr-hooks'
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
  geolocation: any
}

export default function ListItem({ item, geolocation }: ListItemProps) {
  // SWR
  const { weather } = useWeather()
  const { inventory } = useInventory()
  const { vendors } = useVendors()
  const { logs, mutateLogs } = useLogs()
  const { stockItemImage } = useStockItemImage(item?.id)

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

  // console.log(item)

  // Functions
  function clickAddToCart() {
    // console.log('Hold: ', item?.quantity_hold)
    // console.log('Layby: ', item?.quantity_layby)
    // console.log('Qty: ', itemQuantity)
    if (item?.quantity_hold < 0) {
      setConfirmModal({
        open: true,
        title: 'Item on hold.',
        styledMessage: (
          <span>
            <b>{getItemDisplayName(item)}</b> is listed as ON HOLD. If you are
            selling the held version, go to the Holds page to add to the cart
            from there.
          </span>
        ),
        yesText: 'CONTINUE ADDING TO CART',
        noText: 'Cancel',
        action: () => addItemToCart(),
      })
    } else if (item?.quantity_layby < 0) {
      setConfirmModal({
        open: true,
        title: 'Item on layby.',
        styledMessage: (
          <span>
            <b>{getItemDisplayName(item)}</b> is listed as part of a layby.
            Check if this is from a layby.
          </span>
        ),
        yesText: 'CONTINUE ADDING TO CART',
        noText: 'Cancel',
        action: () => addItemToCart(),
      })
    } else if (itemQuantity < 1) {
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
        action: () => addItemToCart(),
      })
    } else addItemToCart()
  }

  function addItemToCart() {
    let newItems = cart?.items || []
    let index = newItems.findIndex((cartItem) => cartItem.item_id === item?.id)
    if (index < 0)
      newItems.push({
        item_id: item?.id,
        quantity: '1',
      })
    else newItems[index].quantity = `${parseInt(newItems[index].quantity) + 1}`
    setCart({
      id: cart?.id || null,
      date_sale_opened:
        cart?.date_sale_opened || dayjs.utc().format('YYYY-MM-DD HH:mm:ss'),
      sale_opened_by: cart?.sale_opened_by || clerk?.id,
      items: newItems,
      transactions: cart?.transactions || [],
      state: cart?.state || null,
      customer_id: cart?.customer_id || null,
      layby_started_by: cart?.layby_started_by || null,
      date_layby_started: cart?.date_layby_started || null,
      weather: cart?.weather || weather,
      geo_latitude: cart?.geo_latitude || geolocation?.latitude,
      geo_longitude: cart?.geo_longitude || geolocation?.longitude,
    })
    setView({ ...view, cart: true })
    setSearch('')
    saveLog(
      {
        log: `${getItemDisplayName(
          inventory?.filter((i: StockObject) => i?.id === item?.id)[0]
        )} added to cart${cart?.id ? ` (sale #${cart?.id})` : ''}.`,
        clerk_id: clerk?.id,
      },
      logs,
      mutateLogs
    )
    setAlert({
      open: true,
      type: 'success',
      message: `ITEM ADDED TO CART`,
    })
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

  if (sellSearch === `${('00000' + item?.id || '').slice(-5)}`) {
    addItemToCart()
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
            src={getImageSrc({
              ...item,
              image_url: stockItemImage || item?.image_url,
            })}
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
            onClick={clickAddToCart}
          >
            <AddIcon style={{ fontSize: '40px' }} />
          </button>
        </Tooltip>
      </div>
    </div>
  )
}
