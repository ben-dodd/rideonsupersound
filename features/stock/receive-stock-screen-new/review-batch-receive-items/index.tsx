import { useState } from 'react'
import { useClerk } from 'lib/api/clerk'
import { ArrowLeft, Download, Save } from '@mui/icons-material'
import BatchPaymentSummary from '../summary'
import { useAppStore } from 'lib/store'
import { saveVendorBatchPayment } from 'lib/api/vendor'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { downloadEmailList, downloadKbbFile } from 'lib/functions/payment'
import { useSWRConfig } from 'swr'

export default function ReviewBatchReceiveItems({ setStage }) {
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
  const { mutate } = useSWRConfig()

  return (
    <div>
      <div className="flex justify-between p-2">
        <BatchPaymentSummary />
        <div className="px-4">
          <button className="icon-text-button w-full" onClick={() => setStage('select')}>
            GO BACK <ArrowLeft />
          </button>
          <button
            className="icon-text-button w-full"
            onClick={() => {
              saveVendorBatchPayment(batchPaymentSession).then((savedBatchPayment) => {
                mutate(`vendor/payment/batch/${savedBatchPayment?.id}`, savedBatchPayment)
                router.push('/payments')
              })
            }}
          >
            SAVE AND CLOSE <Save />
          </button>
          <button
            className="icon-text-button w-full"
            disabled={false}
            onClick={() => {
              saveVendorBatchPayment({
                ...batchPaymentSession,
                completedByClerkId: clerk?.id,
                dateCompleted: dayjs.utc().format(),
              }).then((savedBatchPayment) => {
                console.log('Downloading the saved batch payment', savedBatchPayment)
                downloadKbbFile(savedBatchPayment?.id, savedBatchPayment?.kbbFile)
                downloadEmailList(savedBatchPayment?.id, savedBatchPayment?.emailCsvFile)
                mutate(`vendor/payment/batch/${savedBatchPayment?.id}`, savedBatchPayment)
                router.push('/payments')
              })
            }}
          >
            COMPLETE AND DOWNLOAD <Download />
          </button>
        </div>
      </div>
      {/* {validPayments ? (
        <>
          <div className="text-sm px-2">
            <ul className="list-disc">
              <li>- Check all payments are correct.</li>
              <li>
                - If they are not, click <span className="font-bold">GO BACK</span> to edit.
              </li>
              <li>
                - Click<span className="font-bold"> COMPLETE AND DOWNLOAD</span> to save the batch payment. This will
                also download a KBB file for the bank transfer and a CSV file to import into the RIDE ON emailing
                GoogleSheet.
              </li>
              <li>
                - Vendors with $0 payments or vendors with invalid bank account numbers will not be added to the KBB
                file, only the email CSV.
              </li>
            </ul>
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
        </>
      ) : (
        <div className="w-full h-full flex justify-center font-bold text-xl text-red-400 h-full">
          NO PAYMENTS SELECTED
        </div>
      )} */}
    </div>
  )
}
