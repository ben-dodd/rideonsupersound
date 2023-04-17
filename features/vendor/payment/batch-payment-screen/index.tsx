import { useEffect, useState } from 'react'
import { ModalButton } from 'lib/types'
import { checkDefaultChecked, downloadEmailList, downloadKbbFile } from 'lib/functions/payment'
import { useAppStore } from 'lib/store'
import { useCurrentRegisterId } from 'lib/api/register'
import { useClerk } from 'lib/api/clerk'
import { createVendorBatchPayment, useVendorAccounts } from 'lib/api/vendor'
import { centsToDollars } from 'lib/utils'
import MidScreenContainer from 'components/container/mid-screen'
import SelectBatchPayments from './select-batch-payments'

export default function BatchPaymentScreen() {
  const { batchPaymentSession, closeView, setVendorAccount, setBatchPaymentSession, resetBatchPaymentSession } =
    useAppStore()
  const { registerId } = useCurrentRegisterId()
  const { clerk } = useClerk()
  const { accountPayments = [], id } = batchPaymentSession || {}
  const { vendorAccounts, isVendorAccountsLoading } = useVendorAccounts()
  const [stage, setStage] = useState(0)

  useEffect(() => {
    setBatchPaymentSession({
      accountPayments: vendorAccounts
        ?.map((vendorAccount) => ({
          ...vendorAccount,
          isChecked: checkDefaultChecked(vendorAccount),
          payAmount: centsToDollars(vendorAccount?.totalOwing).toFixed(2),
        }))
        ?.sort((a, b) => {
          if (!a?.isChecked && b?.isChecked) return 1
          if (!b?.isChecked && a?.isChecked) return -1
          return b?.totalOwing - a?.totalOwing
        }),
    })
  }, [vendorAccounts, setBatchPaymentSession])

  const buttons: ModalButton[] = false
    ? [
        {
          type: 'ok',
          text: 'NEXT',
          onClick: () => setStage(1),
          disabled: accountPayments?.reduce((prev, v) => (isNaN(parseFloat(v?.payAmount)) ? prev + 1 : prev), 0) > 0,
        },
      ]
    : [
        {
          type: 'cancel',
          onClick: () => setStage(0),
          text: 'BACK',
        },
        {
          type: 'ok',
          text: 'DOWNLOAD AND COMPLETE',
          onClick: () => {
            downloadKbbFile(batchPaymentSession)
            downloadEmailList(batchPaymentSession)
            createVendorBatchPayment({ vendorList, clerkId: clerk?.id, registerId, emailed })
          },
        },
      ]

  return (
    <MidScreenContainer
      title={id ? `BATCH PAYMENT #${id}` : 'NEW BATCH PAYMENT'}
      titleClass="bg-brown-dark text-white"
      isLoading={isVendorAccountsLoading}
      full
      dark
    >
      <div>
        <SelectBatchPayments />
      </div>
      {/* <div className="w-1/4 bg-white"></div> */}
      {/* <div className="w-full" hidden={stage === 0}>
          <CheckBatchPayments vendorList={vendorList} setKbbLoaded={setKbbLoaded} setEmailed={setEmailed} />
        </div> */}
    </MidScreenContainer>
  )
}
