import { StockObject } from 'lib/types'
import dayjs from 'dayjs'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'
import { useRouter } from 'next/router'
import { useStockItem } from 'lib/api/stock'

export default function StockDetails() {
  const router = useRouter()
  const { id } = router.query
  const { stockItem } = useStockItem(`${id}`)
  const { quantities = {}, stockMovements = [] } = stockItem || {}
  const { openView } = useAppStore()

  return (
    <>
      <div className="grid grid-cols-4 justify-items-start rounded border p-2 mt-2">
        <div className="stock-indicator__container">IN STOCK</div>
        <div
          className={`stock-indicator__number ${
            quantities?.inStock <= 0 ? 'bg-tertiary-light' : 'bg-primary-light'
          }`}
        >
          {`${quantities?.inStock}`}
        </div>
        <div className="stock-indicator__container">RECEIVED</div>
        <div className="stock-indicator__number bg-secondary-light">
          {`${quantities?.received}`}
        </div>
        <div className="stock-indicator__container">SOLD</div>
        <div className="stock-indicator__number bg-secondary-light">
          {`${quantities?.sold}`}
        </div>
        <div className="stock-indicator__container">RETURNED</div>
        <div className="stock-indicator__number bg-secondary-light">
          {`${quantities?.returned}`}
        </div>
        <div className="stock-indicator__container">LAYBY/HOLD</div>
        <div className="stock-indicator__number bg-secondary-light">
          {`${quantities?.laybyHold}`}
        </div>
        <div className="stock-indicator__container">DISCARD/LOST</div>
        <div className="stock-indicator__number bg-secondary-light">
          {`${quantities?.discardedLost}`}
        </div>
        <div className="stock-indicator__container">REFUNDED</div>
        <div className="stock-indicator__number bg-secondary-light">
          {`${quantities?.refunded}`}
        </div>
        <div className="stock-indicator__container">ADJUSTMENT</div>
        <div
          className={`stock-indicator__number ${
            quantities?.adjustment < 0
              ? 'bg-tertiary-light'
              : 'bg-secondary-light'
          }`}
        >
          {`${quantities?.adjustment}`}
        </div>
      </div>
      {/* <button
        onClick={() => openView(ViewProps.changeStockQuantityDialog)}
        className="bg-brown-dark hover:bg-brown p-2 w-full text-white"
      >
        CHANGE STOCK LEVEL
      </button> */}
      <div className="font-bold py-2">Stock Movement Logs</div>
      <div className="h-dialogsm overflow-y-scroll">
        {stockMovements?.length === 0 ? (
          <div>No stock movements found.</div>
        ) : (
          <div>
            {stockItem?.stockMovements?.map((s) => (
              <div
                key={s?.id}
                className={`flex hover:bg-gray-200 p-2 justify-between`}
              >
                <div className="mr-2">
                  {dayjs(s?.dateMoved).format('D MMMM YYYY, h:mm A')}
                </div>
                <div
                  className={`mr-2 font-bold ${
                    s?.quantity < 1 ? 'text-red-500' : 'text-blue-500'
                  }`}
                >{`${
                  s?.act === 'adjustment' ? (s?.quantity < 1 ? '-' : '+') : ''
                }${Math.abs(s?.quantity)} ${s?.act}`}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
