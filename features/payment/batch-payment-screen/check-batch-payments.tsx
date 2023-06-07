import CheckIcon from '@mui/icons-material/CheckCircleOutline'
import NoBankDetailsIcon from '@mui/icons-material/CreditCardOff'
import StoreCreditOnlyIcon from '@mui/icons-material/ShoppingBag'
import QuantityCheckIcon from '@mui/icons-material/Warning'
import { Tooltip } from '@mui/material'
import { useCurrentRegisterId } from 'lib/api/register'
import { useState } from 'react'
import { modulusCheck } from 'lib/functions/payment'
import { useClerk } from 'lib/api/clerk'
import { ArrowLeft, Download, Save } from '@mui/icons-material'
import { createVendorBatchPayment } from 'lib/api/vendor'
import { dollarsToCents, priceCentsString, priceDollarsString } from 'lib/utils'
import BatchPaymentSummary from './summary'

export default function CheckBatchPayments({ paymentList, setStage }) {
  const { registerId } = useCurrentRegisterId()
  const { clerk } = useClerk()
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
          <div className="icon-text-button" onClick={() => setStage('select')}>
            GO BACK <ArrowLeft />
          </div>
          <div className="icon-text-button" onClick={null}>
            SAVE AND CLOSE <Save />
          </div>
          <div
            className="icon-text-button"
            onClick={() => {
              createVendorBatchPayment({
                paymentList: paymentList?.filter((payment) => payment?.isChecked),
                clerkId: clerk?.id,
                registerId,
                emailed: true,
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
            ?.filter((v) => v?.isChecked)
            ?.map((v) => {
              let invalidBankAccountNumber = !modulusCheck(v?.bankAccountNumber)
              let negativeQuantity = v?.totalItems?.filter((i) => i?.quantity < 0)?.length > 0
              const balance = v?.totalOwing - dollarsToCents(v?.payAmount)
              return (
                <div
                  key={v?.id}
                  className={`py-2 px-2 text-sm border-b flex${parseFloat(v?.payAmount) <= 0 ? ' opacity-50' : ''}`}
                >
                  <div className="w-1/3">{`[${v?.id}] ${v?.name}`}</div>
                  <div className="w-1/6">{priceCentsString(v?.totalOwing)}</div>
                  <div className="w-1/6">{priceDollarsString(v?.payAmount)}</div>
                  <div className="w-1/6">{priceCentsString(balance)}</div>
                  <div className="flex w-1/6">
                    {v?.storeCreditOnly ? (
                      <div className="text-blue-500 pl-2">
                        <Tooltip title="Vendor wants Store Credit Only">
                          <StoreCreditOnlyIcon />
                        </Tooltip>
                      </div>
                    ) : (
                      <div />
                    )}
                    {invalidBankAccountNumber ? (
                      <Tooltip title={`${v?.bankAccountNumber ? 'Invalid' : 'Missing'} Bank Account Number`}>
                        <div className={`${v?.bankAccountNumber ? 'text-orange-500' : 'text-red-500'} pl-2 flex`}>
                          <NoBankDetailsIcon />
                        </div>
                      </Tooltip>
                    ) : (
                      <div />
                    )}
                    {negativeQuantity ? (
                      <Tooltip title="Vendor has negative quantity items. Please check!">
                        <div className="text-purple-500 pl-2">
                          <QuantityCheckIcon />
                        </div>
                      </Tooltip>
                    ) : (
                      <div />
                    )}
                    {!negativeQuantity && !invalidBankAccountNumber && !v?.storeCreditOnly ? (
                      <Tooltip title="Everything looks good!">
                        <div className="text-green-500 pl-2">
                          <CheckIcon />
                        </div>
                      </Tooltip>
                    ) : (
                      <div />
                    )}
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}

{
  /* <div className="flex mb-2">
<button
  className="border p-2 rounded bg-gray-100 hover:bg-gray-200"
  onClick={() => {
    let csvContent = writeKiwiBankBatchFile({
      transactions: paymentList
        ?.filter((v) => v?.isChecked)
        ?.map((vendor: any) => ({
          name: vendor?.name || '',
          vendorId: `${vendor?.id || ''}`,
          accountNumber: vendor?.bankAccountNumber || '',
          amount: dollarsToCents(vendor?.payAmount),
        })),
      batchNumber: `${registerId}`,
      sequenceNumber: 'Batch',
    })
    var link = document.createElement('a')
    link.setAttribute('href', csvContent)
    link.setAttribute('download', `batch-payment-${dayjs().format('YYYY-MM-DD')}.kbb`)
    document.body.appendChild(link)
    link.click()
    setKbbLoaded(true)
  }}
>
  Download KiwiBank Batch KBB
</button>
<button
  className="ml-2 border p-2 rounded bg-gray-100 hover:bg-gray-200"
  onClick={() => {
    let csvContent = writePaymentNotificationEmail({
      paymentList,
      includeUnchecked,
      includeNoBank,
    })
    var link = document.createElement('a')
    link.setAttribute('href', csvContent)
    link.setAttribute('download', `batch-payment-email-list-${dayjs().format('YYYY-MM-DD')}.csv`)
    document.body.appendChild(link)
    link.click()
    setEmailed(true)
  }}
>
  Download Email List CSV
</button>
</div> */
}
