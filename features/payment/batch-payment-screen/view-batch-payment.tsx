import CheckIcon from '@mui/icons-material/CheckCircleOutline'
import NoBankDetailsIcon from '@mui/icons-material/CreditCardOff'
import StoreCreditOnlyIcon from '@mui/icons-material/ShoppingBag'
import QuantityCheckIcon from '@mui/icons-material/Warning'
import { Tooltip } from '@mui/material'
import { useState } from 'react'
import { downloadEmailList, downloadFile } from 'lib/functions/payment'
import { Email, NoTransfer } from '@mui/icons-material'
import { dollarsToCents, priceCentsString, priceDollarsString } from 'lib/utils'
import BatchPaymentSummary from './summary'
import { useAppStore } from 'lib/store'
import dayjs from 'dayjs'

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
            ?.filter((v) => v?.isChecked)
            ?.map((v) => {
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
                    {v?.invalidBankAccountNumber ? (
                      <Tooltip title={`${v?.bankAccountNumber ? 'Invalid' : 'Missing'} Bank Account Number`}>
                        <div className={`${v?.bankAccountNumber ? 'text-orange-500' : 'text-red-500'} pl-2 flex`}>
                          <NoBankDetailsIcon />
                        </div>
                      </Tooltip>
                    ) : (
                      <div />
                    )}
                    {v?.hasNegativeQuantityItems ? (
                      <Tooltip title="Vendor has negative quantity items. Please check!">
                        <div className="text-purple-500 pl-2">
                          <QuantityCheckIcon />
                        </div>
                      </Tooltip>
                    ) : (
                      <div />
                    )}
                    {!v?.hasNegativeQuantityItems && !v?.invalidBankAccountNumber && !v?.storeCreditOnly ? (
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
