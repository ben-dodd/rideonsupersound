// Packages
import { useAtom } from 'jotai'
import { useEffect, useMemo, useState } from 'react'
import { StockObject, VendorObject } from 'lib/types'

// Functions
import {
  getImageSrc,
  getItemSku,
} from 'features/inventory/features/display-inventory/lib/functions'
import InfoIcon from '@mui/icons-material/Info'
import { Tooltip } from '@mui/material'
import { getVendorDetails } from '../lib/functions'

export default function VendorItems() {
  // Atoms
  const [loadedVendorId] = useAtom(loadedVendorIdAtom)
  const [page] = useAtom(pageAtom)

  // SWR
  const { vendors } = useVendors()
  const { inventory } = useInventory()
  const { sales } = useSalesJoined()
  const { vendorPayments } = useVendorPayments()

  // State
  const [vendor, setVendor]: [VendorObject, Function] = useState({})
  const [loadedItemId, setLoadedItemId] = useAtom(loadedItemIdAtom)

  // Load
  useEffect(() => {
    setVendor(
      vendors?.find((v: VendorObject) => v?.id === loadedVendorId[page])
    )
  }, [loadedVendorId[page]])

  // Functions
  function StockItem({ item }) {
    return (
      <div
        className={`flex w-full mb-2 pr-2 text-black ${
          item?.quantity < 1 ? 'bg-pink-200' : 'bg-gray-200'
        }`}
      >
        <div className="w-32">
          <div
            className={`w-32 h-32 relative${
              item?.quantity < 1 ? ' opacity-50' : ''
            }`}
          >
            <img
              className="object-cover absolute"
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
              <div className="text-yellow-400 font-bold text-3xl">
                {item?.needs_restock ? 'PLEASE RESTOCK!' : ''}
              </div>
            </div>
            <div className="text-sm text-green-800">{`${
              item?.genre ? `${item.genre} / ` : ''
            }${item?.format} [${
              item?.is_new ? 'NEW' : item?.cond?.toUpperCase() || 'USED'
            }]`}</div>
          </div>
          <div className="flex justify-between items-end">
            <div className="text-xs">
              {`${vendor ? `Selling for ${vendor?.name}` : ''}`}
            </div>
            <div className="self-center pl-8 hidden sm:inline">
              <Tooltip title="View and edit item details.">
                <button
                  className="icon-button-large text-black hover:text-blue-500"
                  onClick={() =>
                    setLoadedItemId({ ...loadedItemId, vendors: item?.id })
                  }
                >
                  <InfoIcon style={{ fontSize: '40px' }} />
                </button>
              </Tooltip>
            </div>
          </div>

          <div className="flex justify-between items-end">
            <div
              className={`text-md ${item?.quantity < 1 && 'text-red-500'}`}
            >{`${item?.quantity} in stock${
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
            <div className="text-xl pr-2">{`$${(
              (item?.total_sell || 0) / 100
            )?.toFixed(2)}`}</div>
          </div>
        </div>
      </div>
    )
  }

  // Constants
  const v = useMemo(
    () =>
      getVendorDetails(inventory, sales, vendorPayments, loadedVendorId[page]),
    [inventory, sales, vendorPayments, loadedVendorId[page]]
  )

  return (
    <div className="flex">
      <div className="w-1/2 pr-2">
        <div className="text-sm font-bold px-1 border-b mb-2">IN STOCK</div>
        {v?.totalItems
          ?.filter((item: StockObject) => item?.quantity > 0)
          ?.map((item: StockObject) => (
            <StockItem key={item.id} item={item} />
          ))}
      </div>
      <div className="w-1/2 pl-2">
        <div className="text-sm font-bold px-1 border-b mb-2">OUT OF STOCK</div>
        {v?.totalItems
          ?.filter((item: StockObject) => (item?.quantity || 0) <= 0)
          ?.map((item: StockObject) => (
            <StockItem item={item} />
          ))}
      </div>
    </div>
  )
}
