import dayjs from 'dayjs'
import { dateSimple } from 'lib/types/date'
import { VendorPaymentObject } from 'lib/types/vendor'
import { priceCentsString } from 'lib/utils'

export default function VendorPayments({ payments }) {
  return (
    <div>
      {payments
        ?.sort((debitA: VendorPaymentObject, debitB: VendorPaymentObject) => {
          const a = dayjs(debitA?.date)
          const b = dayjs(debitB?.date)
          return a < b ? 1 : b < a ? -1 : 0
        })
        // ?.slice(0, 5)
        ?.map((debit: VendorPaymentObject) => {
          return (
            <div className="border-b py-1 flex hover:bg-gray-100 text-sm" key={debit?.id}>
              <div className="font-bold w-1/6">{dayjs(debit?.date).format(dateSimple)}</div>
              <div className="w-1/2" />
              <div className="w-1/6">{debit?.type?.toUpperCase()}</div>
              {/* <div className="w-1/3">{`${
                  sale?.quantity
                } x ${getItemDisplayName(stockItem)}`}</div>
                <div className="w-1/6">{stockItem?.format}</div>
                <div className="w-1/6">
                  {sale?.total_sell
                    ? `$${(sale?.total_sell / 100)?.toFixed(2)}`
                    : "N/A"}
                </div> */}
              <div className="w-1/6 text-right">{priceCentsString(debit?.amount)}</div>
            </div>
          )
        })}
    </div>
  )
}
