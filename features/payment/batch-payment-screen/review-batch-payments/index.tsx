import { useState } from 'react'
import { useClerk } from 'lib/api/clerk'
import { ArrowLeft, Download, Save } from '@mui/icons-material'
import BatchPaymentSummary from '../summary'
import { useAppStore } from 'lib/store'
import { saveVendorBatchPayment } from 'lib/api/vendor'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import ReviewBatchPaymentListItem from './review-batch-payment-list-item'

export default function ReviewBatchPayments({ setStage }) {
  const router = useRouter()
  const { batchPaymentSession } = useAppStore()
  const { paymentList = [] } = batchPaymentSession || {}
  const { clerk } = useClerk()
  const totalPay = paymentList?.reduce(
    (prev, payment) => (payment?.isChecked ? parseFloat(payment?.payAmount) : 0) + prev,
    0,
  )
  const vendorNum = paymentList?.reduce((prev, payment) => (payment?.isChecked ? 1 : 0) + prev, 0)
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
          <div className="icon-text-button" onClick={() => setStage('select')}>
            GO BACK <ArrowLeft />
          </div>
          <div
            className="icon-text-button"
            onClick={() =>
              saveVendorBatchPayment(batchPaymentSession).then((id) => {
                console.log(id)
                router.push('/payments')
                // console.log(paymentList)
                // downloadKbbFile(id, paymentList)
                // downloadEmailList(id, paymentList)
              })
            }
          >
            SAVE AND CLOSE <Save />
          </div>
          <div
            className="icon-text-button"
            onClick={() => {
              saveVendorBatchPayment({
                ...batchPaymentSession,
                completedByClerkId: clerk?.id,
                dateCompleted: dayjs.utc().format(),
              }).then((id) => {
                console.log(id)
                // console.log(paymentList)
                // downloadKbbFile(id, paymentList)
                // downloadEmailList(id, paymentList)
              })
            }}
          >
            COMPLETE AND DOWNLOAD <Download />
          </div>
        </div>
      </div>
      <div className="text-sm px-2">
        Check all payments are correct. If they are not, click <span className="font-bold">GO BACK</span> to edit. Click{' '}
        <span className="font-bold">COMPLETE AND DOWNLOAD</span> to save the batch payment. This will also download a
        KBB file for the bank transfer and a CSV file to import into the RIDE ON emailing GoogleSheet. Vendors with $0
        payments or vendors with invalid bank account numbers will not be added to the KBB file, only the email CSV.
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
              <ReviewBatchPaymentListItem key={payment?.vendorId} payment={payment} />
            ))}
        </div>
      </div>
    </div>
  )
}
