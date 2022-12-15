// Packages
import { useAtom } from 'jotai'

import { loadedItemIdAtom } from 'lib/atoms'

// Components
import TextField from 'components/inputs/text-field'

// Icons
import {
  getImageSrc,
  getItemDisplayName,
  getItemSku,
} from 'features/inventory/features/display-inventory/lib/functions'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

export default function CountedListItem({
  stocktakeItem,
  stockItem,
  stocktake,
}) {
  const { stocktakeItems, mutateStocktakeItems } = useStocktakeItemsByStocktake(
    stocktake?.id
  )
  const [loadedItemId, setLoadedItemId] = useAtom(loadedItemIdAtom)
  const { vendors } = useVendors()
  const vendor = vendors?.filter((v) => v?.id === stockItem?.vendor_id)?.[0]
  return (
    <div className="flex justify-between my-2 border-b w-full hover:bg-gray-100">
      <div className="flex">
        <div className="w-20">
          <div className="w-20 h-20 relative">
            <img
              className="object-cover absolute"
              // layout="fill"
              // objectFit="cover"
              src={getImageSrc(stockItem)}
              alt={stockItem?.title || 'Inventory image'}
            />
            {!stockItem?.is_gift_card && !stockItem?.is_misc_item && (
              <div className="absolute w-20 h-8 bg-opacity-50 bg-black text-white text-sm flex justify-center items-center">
                {getItemSku(stockItem)}
              </div>
            )}
          </div>
        </div>
        <div className="ml-2">
          <div>{getItemDisplayName(stockItem)}</div>

          <div className="">{`${
            stockItem?.section ? `${stockItem.section} / ` : ''
          }${stockItem?.format} [${
            stockItem?.is_new ? 'NEW' : stockItem?.cond?.toUpperCase() || 'USED'
          }]`}</div>
          <div className="text-sm">
            {`${vendor ? `Selling for ${vendor?.name}` : ''}`}
          </div>
        </div>
      </div>
      {/* <div className="text-xl">{`$${((item?.total_sell || 0) / 100)?.toFixed(
        2
      )}`}</div> */}
      <div className="flex items-center justify-end">
        <TextField
          className="w-16 mr-4"
          inputType="number"
          // error={!countedItem?.quantity}
          // max={item?.quantity || 0}
          min={0}
          valueNum={stocktakeItem?.quantity_counted}
          onChange={(e: any) => {
            const newStocktakeItem = {
              ...stocktakeItem,
              quantity_counted: parseInt(e.target.value) || 0,
              quantity_difference:
                (parseInt(e.target.value) || 0) -
                stocktakeItem?.quantity_recorded,
            }
            updateStocktakeItemInDatabase(newStocktakeItem)
            mutateStocktakeItems(
              (stocktakeItems || [])?.map((si) =>
                si?.id === stocktakeItem?.id ? newStocktakeItem : si
              )
            )
          }}
        />
        <button
          className="bg-gray-200 hover:bg-gray-300 p-1 w-10 h-10 rounded-full"
          onClick={() =>
            setLoadedItemId({
              ...loadedItemId,
              stocktake: stocktakeItem?.stock_id,
            })
          }
        >
          <EditIcon />
        </button>
        <button
          className="bg-gray-200 hover:bg-gray-300 p-1 w-10 h-10 rounded-full mx-4"
          onClick={() => {
            deleteStocktakeItemFromDatabase(stocktakeItem?.id)
            mutateStocktakeItems(
              stocktakeItems?.filter((si) => si?.id !== stocktakeItem?.id),
              false
            )
          }}
        >
          <DeleteIcon />
        </button>
      </div>
    </div>
  )
}
