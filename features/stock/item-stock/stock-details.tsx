import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { deleteStockPrice, useStockItem } from 'lib/api/stock'
import { isPreApp, priceCentsString } from 'lib/utils'
import { Delete, MonetizationOnRounded, ShoppingCartCheckoutRounded, StackedBarChartRounded } from '@mui/icons-material'
import SectionPanel from 'components/container/section-panel'
import { useAppStore } from 'lib/store'
import { useSWRConfig } from 'swr'
import { useHoldsForItem } from 'lib/api/sale'
import { StockMovementTypes } from 'lib/types/stock'

export default function StockDetails() {
  const router = useRouter()
  const { openConfirm, closeConfirm } = useAppStore()
  const { mutate } = useSWRConfig()
  const { id } = router.query
  const { stockItem } = useStockItem(`${id}`)
  const { itemHolds } = useHoldsForItem(id)
  const { quantities = {}, stockMovements = [], stockPrices = [], sales = [] } = stockItem || {}
  let runningQuantity = quantities?.inStock || 0
  let prevQuantity = 0
  let saleIndex = 0

  return (
    <>
      <SectionPanel icon={<StackedBarChartRounded />} title="Stock Quantities">
        <div className="grid grid-cols-4 justify-items-start">
          <div className="stock-indicator__container">IN STOCK</div>
          <div
            className={`stock-indicator__number ${quantities?.inStock <= 0 ? 'bg-tertiary-light' : 'bg-primary-light'}`}
          >
            {`${quantities?.inStock}`}
          </div>
          <div className="stock-indicator__container">RECEIVED</div>
          <div className="stock-indicator__number bg-secondary-light">{`${quantities?.received}`}</div>
          <div className="stock-indicator__container">SOLD</div>
          <div className="stock-indicator__number bg-secondary-light">{`${quantities?.sold}`}</div>
          <div className="stock-indicator__container">RETURNED</div>
          <div className="stock-indicator__number bg-secondary-light">{`${quantities?.returned}`}</div>
          <div className="stock-indicator__container">LAYBY/HOLD</div>
          <div className="stock-indicator__number bg-secondary-light">{`${quantities?.laybyHold}`}</div>
          <div className="stock-indicator__container">DISCARD/LOST</div>
          <div className="stock-indicator__number bg-secondary-light">{`${quantities?.discardedLost}`}</div>
          <div className="stock-indicator__container">REFUNDED</div>
          <div className="stock-indicator__number bg-secondary-light">{`${quantities?.refunded}`}</div>
          <div className="stock-indicator__container">ADJUSTMENT</div>
          <div
            className={`stock-indicator__number ${
              quantities?.adjustment < 0 ? 'bg-tertiary-light' : 'bg-secondary-light'
            }`}
          >
            {`${quantities?.adjustment}`}
          </div>
        </div>
      </SectionPanel>
      <SectionPanel
        icon={<ShoppingCartCheckoutRounded />}
        title="Stock Movement Logs"
        closedByDefault={stockMovements?.length > 10}
      >
        <div>
          {stockMovements?.length === 0 ? (
            <div>No stock movements found.</div>
          ) : (
            <div>
              {stockMovements?.map((s, i) => {
                runningQuantity -= prevQuantity || 0
                prevQuantity = s?.quantity
                const saleId = s?.saleId ? s?.saleId : s?.act === 'sold' ? sales[saleIndex]?.saleId : null
                if (s?.act === 'sold') saleIndex++
                const hold = s?.holdId ? itemHolds?.find((hold) => hold?.id === s?.holdId) : null
                return (
                  <div key={s?.id} className={`flex p-2 justify-between`}>
                    <div className="mr-2 flex">
                      {isPreApp(s?.dateMoved) ? 'Pre-App' : dayjs(s?.dateMoved).format('D MMMM YYYY, h:mm A')}
                      {saleId ? (
                        <div
                          className="link-blue ml-2"
                          onClick={() => router.push(`/sales/${saleId}`)}
                        >{`[Sale #${saleId}]`}</div>
                      ) : (
                        <div />
                      )}
                      {s?.holdId ? <div className="ml-2">{`[${hold?.customerName?.toUpperCase()}]`}</div> : <div />}
                    </div>
                    <div className="flex">
                      <div
                        className={`mr-2 font-bold ${s?.quantity < 1 ? 'text-red-500' : 'text-blue-500'}${
                          s?.act === StockMovementTypes.Hold && s?.holdId && hold?.dateRemovedFromHold
                            ? ' line-through'
                            : ''
                        }`}
                      >{`${s?.act === 'adjustment' ? (s?.quantity < 1 ? '-' : '+') : ''}${Math.abs(s?.quantity)} ${
                        s?.act
                      }`}</div>
                      <div
                        className={`ml-2 ${runningQuantity < 0 ? 'text-red-500' : 'text-black'}`}
                      >{`(${runningQuantity} in stock)`}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </SectionPanel>
      <SectionPanel icon={<MonetizationOnRounded />} title="Stock Price Logs">
        <div>
          {stockPrices?.length === 0 ? (
            <div>No stock prices found.</div>
          ) : (
            <div>
              {stockPrices?.map((s, i) => (
                <div key={s?.id} className={`flex p-2 justify-between`}>
                  <div className="flex">
                    <div className="w-12">
                      {i !== stockPrices?.length - 1 ? (
                        <button
                          onClick={() => {
                            openConfirm({
                              open: true,
                              title: 'Delete Price?',
                              message:
                                'Are you sure you want to delete this price change? This might have devastating consequences...',
                              yesText: 'Yes',
                              noText: 'No',
                              action: () => {
                                deleteStockPrice(s?.id).then(() => {
                                  mutate(`stock/${id}`)
                                  closeConfirm()
                                })
                                closeConfirm()
                              },
                            })
                          }}
                          className="border-rounded hover:opacity-50 mr-2"
                        >
                          <Delete />
                        </button>
                      ) : (
                        <div />
                      )}
                    </div>
                    <div className="mr-2">
                      {isPreApp(s?.dateValidFrom) ? 'Pre-App' : dayjs(s?.dateValidFrom).format('D MMMM YYYY, h:mm A')}
                    </div>
                  </div>
                  <div className={`mr-2 font-bold`}>{`(Vendor ${priceCentsString(
                    s?.vendorCut,
                  )}/Store ${priceCentsString(s?.totalSell - s?.vendorCut)}) ${priceCentsString(s?.totalSell)}`}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SectionPanel>
    </>
  )
}
