import { useSalesForRange } from 'lib/hooks/sales'
import { useAppStore } from 'lib/store'
import GrandTotal from './grand-total'
import SaleDay from './sale-day'

export default function SalesList() {
  const { salesCalendarPage } = useAppStore()
  const { saleArray, grandTotal } = useSalesForRange(salesCalendarPage)
  return (
    <div>
      {saleArray?.length === 0 ? (
        <div className="font-bold text-sm my-8 text-center">NO SALES FOR THIS PERIOD</div>
      ) : (
        <div>
          <GrandTotal grandTotal={grandTotal} />
          <div>
            {saleArray?.map((saleDay) => (
              <SaleDay key={saleDay?.day} saleDay={saleDay} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
