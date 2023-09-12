import { useState } from 'react'
import { checkDefaultChecked } from 'lib/functions/payment'
import { ArrowRight, Save } from '@mui/icons-material'
import BatchPaymentSummary from '../summary'
import { useAppStore } from 'lib/store'
import SelectBatchPaymentListItem from './select-batch-payment-list-item'
import { saveVendorBatchPayment } from 'lib/api/vendor'
import { useRouter } from 'next/router'
import { useSWRConfig } from 'swr'

export default function SelectBatchPayments({ setStage, setBypassConfirmDialog }) {
  const [checked, setChecked] = useState(true)
  const { batchPaymentSession, setBatchPaymentList } = useAppStore()
  const { paymentList = [] } = batchPaymentSession || {}
  const [search, setSearch] = useState('')
  const router = useRouter()
  const { mutate } = useSWRConfig()

  return (
    <div>
      <div className="flex justify-between p-2">
        <BatchPaymentSummary search={search} setSearch={setSearch} paymentList={paymentList} />
        <div className="px-4">
          <button className="icon-text-button-highlight" onClick={() => setStage('review')}>
            REVIEW PAYMENTS <ArrowRight />
          </button>
          <button
            className="icon-text-button"
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
        </div>
      </div>
      <div className="w-full">
        <div className="flex font-bold py-2 px-2 border-b border-black">
          <div className="w-2/12 flex">
            <input
              type="checkbox"
              className="cursor-pointer"
              checked={checked}
              onChange={(e) => {
                if (checked) {
                  setBatchPaymentList(
                    paymentList?.map((vendor) => ({
                      ...vendor,
                      isChecked: false,
                    })),
                  )
                  setChecked(false)
                } else {
                  setBatchPaymentList(
                    paymentList?.map((vendor) =>
                      checkDefaultChecked(vendor) ? { ...vendor, isChecked: true } : vendor,
                    ),
                  )
                  setChecked(true)
                }
              }}
            />
            <div className="pl-4">NAME</div>
          </div>
          <div className="w-1/12 text-right mr-2">TAKE</div>
          <div className="w-1/12 text-right mr-8">OWED</div>
          <div className="w-2/12">LAST SALE</div>
          <div className="w-2/12">LAST PAID</div>
          <div className="w-2/12">LAST CONTACTED</div>
          <div className="w-2/12">AMOUNT TO PAY</div>
        </div>
        <div className="h-dialog overflow-y-scroll">
          {paymentList
            ?.filter((payment) => search === '' || payment?.name?.toLowerCase()?.includes(search?.toLowerCase()))
            ?.map((payment) => (
              <SelectBatchPaymentListItem key={payment?.vendorId} payment={payment} />
            ))}
        </div>
      </div>
    </div>
  )
}
