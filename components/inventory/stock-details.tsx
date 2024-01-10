import { viewAtom } from '@/lib/atoms'
import { useStockMovementByStockId } from '@/lib/swr-hooks'
import { StockObject } from '@/lib/types'
import dayjs from 'dayjs'
import { useAtom } from 'jotai'

interface stockDetailsProps {
  item: StockObject
}

export default function StockDetails({ item }: stockDetailsProps) {
  const { stockMovements, isStockMovementsLoading } = useStockMovementByStockId(
    item?.id
  )

  const [view, setView] = useAtom(viewAtom)

  return (
    <>
      <div className="grid grid-cols-4 justify-items-start rounded border p-2 mt-2">
        <div className="stock-indicator__container">IN STOCK</div>
        <div
          className={`stock-indicator__number ${
            item?.quantity <= 0 ? 'bg-tertiary-light' : 'bg-primary-light'
          }`}
        >
          {`${item?.quantity || 0}`}
        </div>
        <div className="stock-indicator__container">RECEIVED</div>
        <div className="stock-indicator__number bg-secondary-light">
          {`${item?.quantity_received || 0}`}
        </div>
        <div className="stock-indicator__container">SOLD</div>
        <div className="stock-indicator__number bg-secondary-light">
          {`${Math.abs(item?.quantity_sold || 0)}`}
        </div>
        <div className="stock-indicator__container">RETURNED</div>
        <div className="stock-indicator__number bg-secondary-light">
          {`${Math.abs(item?.quantity_returned || 0)}`}
        </div>
        <div className="stock-indicator__container">LAYBY/HOLD</div>
        <div className="stock-indicator__number bg-secondary-light">
          {`${(item?.quantity_layby + item?.quantity_hold) * -1}`}
        </div>
        <div className="stock-indicator__container">DISCARD/LOST</div>
        <div className="stock-indicator__number bg-secondary-light">
          {`${(item?.quantity_discarded + item?.quantity_lost) * -1}`}
        </div>
        <div className="stock-indicator__container">REFUNDED</div>
        <div className="stock-indicator__number bg-secondary-light">
          {`${Math.abs(item?.quantity_unsold || 0)}`}
        </div>
        <div className="stock-indicator__container">ADJUSTMENT</div>
        <div
          className={`stock-indicator__number ${
            item?.quantity_adjustment < 0
              ? 'bg-tertiary-light'
              : 'bg-secondary-light'
          }`}
        >
          {`${item?.quantity_adjustment || 0}`}
        </div>
      </div>
      <button
        onClick={() => setView({ ...view, changeStockQuantityDialog: true })}
        className="bg-brown-dark hover:bg-brown p-2 w-full text-white"
      >
        CHANGE STOCK LEVEL
      </button>
      <div className="font-bold py-2">Stock Movement Logs</div>
      <div className="h-dialogsm overflow-y-scroll">
        {isStockMovementsLoading ? (
          <div>Loading...</div>
        ) : stockMovements?.length === 0 ? (
          <div>No stock movements found.</div>
        ) : (
          <div>
            {stockMovements?.map((s) => (
              <div
                key={s?.id}
                className={`flex hover:bg-gray-200 p-2 justify-between`}
              >
                <div className="mr-2">
                  {dayjs(s?.date_moved).format('D MMMM YYYY, h:mm A')}
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
