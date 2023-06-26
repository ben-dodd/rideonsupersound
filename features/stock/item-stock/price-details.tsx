import { useStockItem } from 'lib/api/stock'
import { getGrossProfit, getProfitMarginString } from 'lib/functions/pay'
import { priceDollarsString, priceCentsString } from 'lib/utils'
import { useRouter } from 'next/router'

export default function PriceDetails() {
  const router = useRouter()
  const { id } = router.query
  const { stockItem } = useStockItem(`${id}`)
  const { item = {}, price = {} } = stockItem || {}

  return (
    <>
      <div className="grid grid-cols-6 gap-2 mt-4 mb-4">
        <div>
          {(!item?.isNew && !item?.cond) ||
          !(
            item?.discogsItem?.priceSuggestions &&
            item?.discogsItem?.priceSuggestions[item?.isNew ? 'Mint (M)' : item?.cond || 'Good (G)']?.value
          ) ? (
            <div />
          ) : (
            <>
              <div className="text-xs mt-2 mb-2">DISCOGS</div>
              <div className="font-bold text-xl">
                {priceDollarsString(
                  item?.discogsItem?.priceSuggestions[item?.isNew ? 'Mint (M)' : item?.cond || 'Good (G)']?.value,
                )}
              </div>
            </>
          )}
        </div>
        <div>
          <div className="text-xs mt-2 mb-2">COST PRICE</div>
          <div className="font-bold text-xl">{priceCentsString(price?.vendorCut)}</div>
        </div>
        <div>
          <div className="text-xs mt-2 mb-2">STORE CUT</div>
          <div className="font-bold text-xl">{getGrossProfit(price) || 'N/A'}</div>
        </div>
        <div>
          <div className="text-xs mt-2 mb-2">MARGIN</div>
          <div className="font-bold text-xl">{getProfitMarginString(price) || 'N/A'}</div>
        </div>
        <div className="col-start-5 col-end-7">
          <div className="flex justify-center items-center p-4 bg-tertiary-dark">
            <div className="font-bold text-4xl text-white">{priceCentsString(price?.totalSell)}</div>
          </div>
          {/* <button
            onClick={() => openView(ViewProps.changePriceDialog)}
            className="bg-brown-dark hover:bg-brown p-2 w-full text-white"
          >
            CHANGE PRICE
          </button> */}
        </div>
      </div>
    </>
  )
}
