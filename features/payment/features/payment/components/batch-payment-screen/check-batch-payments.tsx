import CheckIcon from '@mui/icons-material/CheckCircleOutline'
import NoBankDetailsIcon from '@mui/icons-material/CreditCardOff'
import StoreCreditOnlyIcon from '@mui/icons-material/ShoppingBag'
import QuantityCheckIcon from '@mui/icons-material/Warning'
import { Tooltip } from '@mui/material'
import dayjs from 'dayjs'
import { useCurrentRegisterId } from 'lib/api/register'
import { useState } from 'react'
import {
  modulusCheck,
  writeKiwiBankBatchFile,
  writePaymentNotificationEmail,
} from '../../lib/functions'

export default function CheckBatchPayments({
  vendorList,
  setKbbLoaded,
  setEmailed,
}) {
  const { registerID } = useCurrentRegisterId()
  const totalPay = vendorList?.reduce(
    (prev, v) => (v?.is_checked ? parseFloat(v?.payAmount) : 0) + prev,
    0
  )
  const vendorNum = vendorList?.reduce(
    (prev, v) => (v?.is_checked ? 1 : 0) + prev,
    0
  )
  const [includeUnchecked, setIncludeUnchecked] = useState(false)
  const [includeNoBank, setIncludeNoBank] = useState(false)

  return (
    <div>
      <div className="flex justify-between">
        <div className="flex mb-2">
          <button
            className="border p-2 rounded bg-gray-100 hover:bg-gray-200"
            onClick={() => {
              let csvContent = writeKiwiBankBatchFile({
                transactions: vendorList
                  ?.filter((v) => v?.is_checked)
                  ?.map((vendor: any) => ({
                    name: vendor?.name || '',
                    vendor_id: `${vendor?.id || ''}`,
                    accountNumber: vendor?.bank_account_number || '',
                    amount: Math.round(
                      parseFloat(vendor?.payAmount || '0') * 100
                    ),
                  })),
                batchNumber: `${registerID}`,
                sequenceNumber: 'Batch',
              })
              var link = document.createElement('a')
              link.setAttribute('href', csvContent)
              link.setAttribute(
                'download',
                `batch-payment-${dayjs().format('YYYY-MM-DD')}.kbb`
              )
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
                vendorList,
                includeUnchecked,
                includeNoBank,
              })
              var link = document.createElement('a')
              link.setAttribute('href', csvContent)
              link.setAttribute(
                'download',
                `batch-payment-email-list-${dayjs().format('YYYY-MM-DD')}.csv`
              )
              document.body.appendChild(link)
              link.click()
              setEmailed(true)
            }}
          >
            Download Email List CSV
          </button>
        </div>
        <div>
          <div className="flex items-center">
            <input
              type="checkbox"
              className="cursor-pointer"
              checked={includeUnchecked}
              onChange={(e) => setIncludeUnchecked(e.target.checked)}
            />
            <div className="ml-2">Include unchecked vendors</div>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              className="cursor-pointer"
              checked={includeNoBank}
              onChange={(e) => setIncludeNoBank(e.target.checked)}
            />
            <div className="ml-2">
              Include vendors with no bank account number
            </div>
          </div>
        </div>
        <div className="text-red-400 text-2xl font-bold text-right">
          {vendorList?.filter((v) => isNaN(parseFloat(v?.payAmount)))?.length >
          0
            ? `CHECK PAY ENTRIES`
            : `PAY $${parseFloat(totalPay).toFixed(
                2
              )}\nto ${vendorNum} VENDORS`}
        </div>
      </div>
      <div className="text-sm">
        <div className="font-bold">NOTE</div>
        Vendors with $0 payments or vendors with invalid bank account numbers
        will not be added to the KBB file, only the email CSV.
      </div>
      <div className="w-full">
        <div className="flex font-bold py-2 px-2 border-b border-black">
          <div className="w-1/2">NAME</div>
          <div className="w-1/4">AMOUNT</div>
          <div className="w-1/4" />
        </div>
        <div className="h-dialog overflow-y-scroll">
          {vendorList
            ?.filter((v) => v?.is_checked)
            ?.map((v) => {
              let invalidBankAccountNumber = !modulusCheck(
                v?.bank_account_number
              )
              let negativeQuantity =
                v?.totalItems?.filter((i) => i?.quantity < 0)?.length > 0
              return (
                <div
                  key={v?.id}
                  className={`border-b flex${
                    parseFloat(v?.payAmount) <= 0 ? ' opacity-50' : ''
                  }`}
                >
                  <div className="w-1/2">{`[${v?.id}] ${v?.name}`}</div>
                  <div className="w-1/4">{`$${parseFloat(v?.payAmount)?.toFixed(
                    2
                  )}`}</div>
                  <div className="flex w-1/4">
                    {v?.store_credit_only ? (
                      <div className="text-blue-500 pl-2">
                        <Tooltip title="Vendor wants Store Credit Only">
                          <StoreCreditOnlyIcon />
                        </Tooltip>
                      </div>
                    ) : (
                      <div />
                    )}
                    {invalidBankAccountNumber ? (
                      <Tooltip
                        title={`${
                          v?.bank_account_number ? 'Invalid' : 'Missing'
                        } Bank Account Number`}
                      >
                        <div
                          className={`${
                            v?.bank_account_number
                              ? 'text-orange-500'
                              : 'text-red-500'
                          } pl-2 flex`}
                        >
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
                    {!negativeQuantity &&
                    !invalidBankAccountNumber &&
                    !v?.store_credit_only ? (
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
