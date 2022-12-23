import { StockObject, VendorObject } from 'lib/types'
import {
  getImageSrc,
  getItemDisplayName,
  getItemSku,
} from '../../display-inventory/lib/functions'
import { useClerk } from 'lib/api/clerk'
import { useVendors } from 'lib/api/vendor'
import router from 'next/router'
import { useStockItem } from 'lib/api/stock'

export default function StockItemDisplay() {
  const { id } = router.query
  const { stockItem, isStockItemLoading } = useStockItem(`${id}`)
  // TODO fix up stock item type so it can be used here
  const { item = {} } = stockItem || {}
  const { vendors } = useVendors()
  // TODO fix up display so it looks nice

  return (
    <div>
      <div className="flex justify-start w-full">
        <div className="pr-2 w-52 mr-2">
          <div className="w-52 h-52 relative">
            <img
              className="object-cover absolute"
              src={getImageSrc(item)}
              alt={item?.title || 'Inventory image'}
            />
            {item?.id && (
              <div className="absolute w-52 h-8 bg-opacity-50 bg-black text-white flex justify-center items-center">
                {getItemSku(item)}
              </div>
            )}
          </div>
        </div>
        <div className="w-full">
          <div className="flex">
            <div className="font-bold mr-2">ARTIST</div>
            <div>{item?.artist}</div>
          </div>
          <div className="flex">
            <div className="font-bold mr-2">TITLE</div>
            <div>{item?.title}</div>
          </div>
          <div className="flex">
            <div className="font-bold mr-2">DISPLAY NAME</div>
            <div>{item?.displayAs}</div>
          </div>
          <div className="flex">
            <div className="font-bold mr-2">VENDOR</div>
            <div>{`[${item?.vendorId}] ${
              vendors?.filter(
                (v: VendorObject) => v?.id === item?.vendorId
              )?.[0]?.name || ''
            }`}</div>
          </div>
        </div>
      </div>
      <div className="mb-2">
        <div className="flex">
          <div className="font-bold mr-2">BARCODE</div>
          <div>{item?.barcode}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div className="flex">
          <div className="font-bold mr-2">TYPE</div>
          <div>{item?.type}</div>
        </div>
        <div className="flex">
          <div className="font-bold mr-2">FORMAT</div>
          <div>{item?.format}</div>
        </div>
      </div>
      {item?.format == 'Shirt' ? (
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="flex">
            <div className="font-bold mr-2">COLOUR</div>
            <div>{item?.colour}</div>
          </div>
          <div className="flex">
            <div className="font-bold mr-2">SIZE</div>
            <div>{item?.size}</div>
          </div>
        </div>
      ) : (
        <div className="flex items-end">
          <div className="flex">
            <div className="font-bold mr-2">CONDITION</div>
            <div>`${item?.isNew ? 'NEW' : item?.cond}`</div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-2 items-center justify-center">
        <div className="flex">
          <div className="font-bold mr-2">SECTION</div>
          <div>{item?.section}</div>
        </div>
        <div className="flex">
          <div className="font-bold mr-2">COUNTRY</div>
          <div>{item?.country}</div>
        </div>
      </div>
      <div className="flex">
        <div className="font-bold mr-2">GENRE / TAGS</div>
        <div>{item?.genre?.join?.(', ')}</div>
      </div>
      <div className="flex">
        <div className="font-bold mr-2">DESCRIPTION / NOTES</div>
        <div>{item?.description}</div>
      </div>
      <div className="grid grid-cols-3 mt-4 gap-2">
        <div className="flex">
          <div className="font-bold mr-2">LISTED ON WEBSITE?</div>
          <div>{item?.doListOnWebsite ? 'YES' : 'NO'}</div>
        </div>
        <div className="flex">
          <div className="font-bold mr-2">ITEM HAS NO QUANTITY?</div>
          <div>{item?.hasNoQuantity ? 'YES' : 'NO'}</div>
        </div>
      </div>
    </div>
  )
}
