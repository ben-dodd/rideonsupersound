import { useState } from 'react'
import BatchPaymentSummary from '../summary'
import { useAppStore } from 'lib/store'
import ViewBatchPaymentListItem from './view-batch-payment-list-item'

export default function ViewBatchPayments() {
  const { batchPaymentSession } = useAppStore()
  const { paymentList = [] } = batchPaymentSession || {}
  const [search, setSearch] = useState('')

  return (
    <div>
      <div className="flex justify-between p-2">
        <BatchPaymentSummary search={search} setSearch={setSearch} paymentList={paymentList} />
        <div className="px-4"></div>
      </div>
      <div className="w-full">
        <div className="flex font-bold py-2 px-2 border-b border-black">
          <div className="w-1/3">NAME</div>
          <div className="w-1/6">TOTAL OWED</div>
          <div className="w-1/6">AMOUNT TO PAY</div>
          <div className="w-1/6">BALANCE</div>
          <div className="w-1/6" />
        </div>
        <div className="h-dialog overflow-y-scroll">
          {paymentList
            ?.filter((payment) => payment?.isChecked)
            ?.map((payment) => (
              <ViewBatchPaymentListItem key={payment?.vendorId} payment={payment} />
            ))}
        </div>
      </div>
    </div>
  )
}
