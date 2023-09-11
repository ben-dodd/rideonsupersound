import { useState } from 'react'
import { useClerk } from 'lib/api/clerk'
import { ArrowLeft, Download, Save } from '@mui/icons-material'
import BatchPaymentSummary from '../summary'
import { useAppStore } from 'lib/store'
import { saveVendorBatchPayment } from 'lib/api/vendor'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import ReviewBatchPaymentListItem from './review-batch-payment-list-item'
import { downloadEmailList, downloadKbbFile } from 'lib/functions/payment'
import { useSWRConfig } from 'swr'

export default function ReviewBatchPayments({ setStage, setBypassConfirmDialog }) {
  const router = useRouter()
  const { batchPaymentSession } = useAppStore()
  const { paymentList = [] } = batchPaymentSession || {}
  const { clerk } = useClerk()
  const [search, setSearch] = useState('')
  const { mutate } = useSWRConfig()
  const validPayments =
    paymentList?.filter((payment) => payment?.isChecked && Number(payment?.payAmount) > 0)?.length > 0

  return (
    <div>
      <div className="flex justify-between p-2">
        <BatchPaymentSummary search={search} setSearch={setSearch} paymentList={paymentList} />
        <div className="px-4">
          <button className="icon-text-button w-full" onClick={() => setStage('select')}>
            GO BACK <ArrowLeft />
          </button>
          <button
            className="icon-text-button w-full"
            onClick={() => {
              saveVendorBatchPayment(batchPaymentSession).then((savedBatchPayment) => {
                mutate(`vendor/payment/batch/${savedBatchPayment?.id}`, savedBatchPayment)
                setBypassConfirmDialog(true)
                router.push('/payments')
              })
            }}
          >
            SAVE AND CLOSE <Save />
          </button>
          <button
            className="icon-text-button-highlight w-full"
            disabled={!validPayments}
            onClick={() => {
              // setBatchPaymentSession({ completedByClerkId: clerk?.id, dateCompleted: dayjs.utc().format() })
              setBypassConfirmDialog(true)
              saveVendorBatchPayment({
                ...batchPaymentSession,
                completedByClerkId: clerk?.id,
                dateCompleted: dayjs.utc().format(),
              }).then((savedBatchPayment) => {
                console.log('Downloading the saved batch payment', savedBatchPayment)
                mutate(`vendor/payment/batch/${savedBatchPayment?.id}`, savedBatchPayment)
                mutate(`vendor/payment/batch`)
                mutate(`vendor/payment`)
                downloadKbbFile(savedBatchPayment?.id, savedBatchPayment?.kbbFile)
                downloadEmailList(savedBatchPayment?.id, savedBatchPayment?.emailCsvFile)
                // setBypassConfirmDialog(true).then(() => router.push(`/payments`))
                router.push('/payments')
              })
            }}
          >
            COMPLETE AND DOWNLOAD <Download />
          </button>
        </div>
      </div>
      {validPayments ? (
        <>
          <div className="info-box">
            <ul className="list-disc">
              <li>Check all payments are correct.</li>
              <li>
                If they are not, click <span className="font-bold text-brown-dark">GO BACK</span> to edit.
              </li>
              <li>
                Click<span className="font-bold text-primary-dark"> COMPLETE AND DOWNLOAD</span> to save the batch
                payment. This will also download a KBB file for the bank transfer and a CSV file to import into the RIDE
                ON emailing GoogleSheet.
              </li>
              <li>
                Vendors with $0 payments or vendors with invalid bank account numbers will not be added to the KBB file,
                only the email CSV.
              </li>
            </ul>
          </div>
          <div className="w-full">
            <div className="flex font-bold py-2 px-2 border-b border-black">
              <div className="w-1/3">NAME</div>
              <div className="w-1/6">TOTAL OWED</div>
              <div className="w-1/6">PAY AMOUNT</div>
              <div className="w-3/12">BALANCE REMAINING</div>
              <div className="w-1/12" />
            </div>
            <div className="h-dialog overflow-y-scroll">
              {paymentList
                ?.filter((payment) => payment?.isChecked)
                ?.filter((payment) => search === '' || payment?.name?.toLowerCase()?.includes(search?.toLowerCase()))
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
      )}
    </div>
  )
}
