import { useState } from 'react'
import { downloadEmailList, downloadFile } from 'lib/functions/payment'
import { Email, NoTransfer } from '@mui/icons-material'
import BatchPaymentSummary from '../summary'
import { useAppStore } from 'lib/store'
import dayjs from 'dayjs'
import ViewBatchPaymentListItem from './view-batch-payment-list-item'

export default function ViewBatchPayments() {
  const { batchPaymentSession } = useAppStore()
  const { paymentList = [] } = batchPaymentSession || {}
  const totalPay = paymentList?.reduce((prev, v) => (v?.isChecked ? parseFloat(v?.payAmount) : 0) + prev, 0)
  const vendorNum = paymentList?.reduce((prev, v) => (v?.isChecked ? 1 : 0) + prev, 0)
  const [search, setSearch] = useState('')

  return (
    <div>
      <div className="flex justify-between p-2">
        <BatchPaymentSummary
          search={search}
          setSearch={setSearch}
          paymentList={paymentList}
          totalPay={totalPay}
          vendorNum={vendorNum}
        />
        <div className="px-4">
          <div
            className="icon-text-button"
            onClick={() =>
              downloadFile(
                batchPaymentSession?.kbbFile,
                `batch-payment-${`00000${batchPaymentSession?.id}`.slice(-5)}-${dayjs(
                  batchPaymentSession?.dateCompleted,
                ).format('YYYY-MM-DD')}.kbb`,
              )
            }
          >
            DOWNLOAD KBB FILE <NoTransfer />
          </div>
          <div
            className="icon-text-button"
            onClick={() =>
              downloadEmailList(
                batchPaymentSession?.emailCsvFile,
                `batch-payment-email-list-${`00000${batchPaymentSession?.id}`.slice(-5)}-${dayjs(
                  batchPaymentSession?.dateCompleted,
                ).format('YYYY-MM-DD')}.csv`,
              )
            }
          >
            DOWNLOAD EMAIL LIST <Email />
          </div>
        </div>
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
