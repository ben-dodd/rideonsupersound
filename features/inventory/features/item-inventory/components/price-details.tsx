import { getGrossProfit, getProfitMargin } from 'features/pay/lib/functions'
import { useStockItem } from 'lib/api/stock'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'
import { useRouter } from 'next/router'

export default function PriceDetails() {
  const router = useRouter()
  const { id } = router.query
  const { stockItem, isStockItemLoading } = useStockItem(`${id}`)
  const { view, openView } = useAppStore()

  return (
    <>
      <div className="grid grid-cols-6 gap-2 mt-4 mb-4">
        <div>
          {(!stockItem?.isNew && !stockItem?.cond) ||
          !(
            stockItem?.discogsItem?.priceSuggestions &&
            stockItem?.discogsItem?.priceSuggestions[
              stockItem?.isNew ? 'Mint (M)' : stockItem?.cond || 'Good (G)'
            ]?.value
          ) ? (
            <div />
          ) : (
            <>
              <div className="px-1 text-xs mt-2 mb-2">DISCOGS</div>
              <div className="font-bold text-xl">
                {`$${parseFloat(
                  stockItem?.discogsItem?.priceSuggestions[
                    stockItem?.isNew
                      ? 'Mint (M)'
                      : stockItem?.cond || 'Good (G)'
                  ]?.value
                )?.toFixed(2)}`}
              </div>
            </>
          )}
        </div>
        <div>
          <div className="px-1 text-xs mt-2 mb-2">COST PRICE</div>
          <div className="font-bold text-xl">
            {stockItem?.vendorCut
              ? `$${(stockItem?.vendorCut / 100)?.toFixed(2)}`
              : 'N/A'}
          </div>
        </div>
        <div>
          <div className="px-1 text-xs mt-2 mb-2">STORE CUT</div>
          <div className="font-bold text-xl">
            {getGrossProfit(stockItem) || 'N/A'}
          </div>
        </div>
        <div>
          <div className="px-1 text-xs mt-2 mb-2">MARGIN</div>
          <div className="font-bold text-xl">
            {getProfitMargin(stockItem) || 'N/A'}
          </div>
        </div>
        <div className="col-start-5 col-end-7">
          <div className="flex justify-center items-center p-4 bg-tertiary-dark">
            <div className="font-bold text-4xl text-white">
              {stockItem?.totalSell
                ? `$${(stockItem?.totalSell / 100)?.toFixed(2)}`
                : 'N/A'}
            </div>
          </div>
          <button
            onClick={() => openView(ViewProps.changePriceDialog)}
            className="bg-brown-dark hover:bg-brown p-2 w-full text-white"
          >
            CHANGE PRICE
          </button>
        </div>
      </div>
    </>
  )
}
