import Select from 'react-select'
import {
  getImageSrc,
  getItemDisplayName,
  getItemSku,
} from 'lib/functions/displayInventory'
import {
  StockObject,
  StocktakeItemObject,
  StocktakeObject,
  StocktakeReviewDecisions,
} from 'lib/types'
import CheckIcon from '@mui/icons-material/CheckCircleOutline'
import EditIcon from '@mui/icons-material/Edit'

interface reviewListItemProps {
  stocktakeItem: StocktakeItemObject
  stockItem: StockObject
  stocktake: StocktakeObject
}

export default function ReviewListItem({
  stocktakeItem,
  stockItem,
  stocktake,
}: reviewListItemProps) {
  const { stocktakeItems, mutateStocktakeItems } = useStocktakeItemsByStocktake(
    stocktake?.id
  )
  const [loadedItemId, setLoadedItemId] = useAtom(loadedItemIdAtom)
  const { vendors } = useVendors()
  const vendor = vendors?.filter((v) => v?.id === stockItem?.vendor_id)?.[0]
  const completed = Boolean(stocktake?.date_closed || stocktake?.date_cancelled)
  return (
    <div className="flex my-2 border-b w-full hover:bg-gray-100">
      <div className="w-1/2 flex">
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
      <div className="w-4/12 flex flex-col justify-center">
        {stocktakeItem?.quantity_difference === 0 ? (
          <div />
        ) : (
          <Select
            isDisabled={completed}
            className={`w-full border border-4 ${
              !stocktakeItem?.review_decision
                ? 'border-red-500'
                : stocktakeItem?.review_decision ===
                  StocktakeReviewDecisions?.review
                ? 'border-orange-300'
                : stocktakeItem?.review_decision ===
                  StocktakeReviewDecisions?.keep
                ? 'border-blue-500'
                : 'border-green-500'
            }`}
            value={{
              value:
                stocktakeItem?.review_decision ||
                StocktakeReviewDecisions?.review,
              label:
                stocktakeItem?.review_decision ||
                StocktakeReviewDecisions?.review,
            }}
            options={(stocktakeItem?.quantity_difference > 0
              ? [
                  StocktakeReviewDecisions?.review,
                  StocktakeReviewDecisions?.adjust,
                  StocktakeReviewDecisions?.found,
                  StocktakeReviewDecisions?.keep,
                ]
              : [
                  StocktakeReviewDecisions?.review,
                  StocktakeReviewDecisions?.adjust,
                  StocktakeReviewDecisions?.discard,
                  StocktakeReviewDecisions?.lost,
                  StocktakeReviewDecisions?.return,
                  StocktakeReviewDecisions?.keep,
                ]
            ).map((m: string) => ({
              value: m,
              label: m,
            }))}
            onChange={(item: any) => {
              const newStocktakeItem = {
                ...stocktakeItem,
                review_decision: item?.value,
              }
              updateStocktakeItemInDatabase(newStocktakeItem)
              mutateStocktakeItems(
                (stocktakeItems || [])?.map((si) =>
                  si?.id === stocktakeItem?.id ? newStocktakeItem : si
                ),
                false
              )
            }}
          />
        )}
      </div>
      <div className="w-1/12 flex flex-col items-center justify-center">
        <button
          className={`p-1 w-10 h-10 rounded-full ${
            stocktakeItem?.do_check_details
              ? 'bg-red-200 hover:bg-red-300 animate-spin'
              : 'bg-gray-200 hover:bg-gray-300 '
          }`}
          onClick={() =>
            setLoadedItemId({ ...loadedItemId, stocktake: stockItem?.id })
          }
        >
          <EditIcon />
        </button>
        <div className="text-xs pt-2">EDIT ITEM</div>
      </div>
      <div className="w-1/12">
        <div>{`Counted ${stocktakeItem?.quantity_counted}`}</div>
        <div>{`Recorded ${stocktakeItem?.quantity_recorded}`}</div>
        {stocktakeItem?.quantity_difference === 0 ? (
          <div className="bg-green-500 text-center">
            <CheckIcon className="text-white" />
          </div>
        ) : (
          <div
            className={`${
              stocktakeItem?.quantity_difference < 0
                ? 'bg-red-500'
                : 'bg-orange-500'
            } text-center`}
          >
            <div className="text-white">
              {stocktakeItem?.quantity_difference < 0
                ? stocktakeItem?.quantity_difference
                : `+${stocktakeItem?.quantity_difference}`}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
