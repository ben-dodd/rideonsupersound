import { useEffect, useState } from 'react'
import { ModalButton } from 'lib/types'
import { checkDefaultChecked, downloadEmailList, downloadKbbFile } from 'lib/functions/payment'
import { useCurrentRegisterId } from 'lib/api/register'
import { useClerk } from 'lib/api/clerk'
import { createVendorBatchPayment, useVendorAccounts, useVendorBatchPayment } from 'lib/api/vendor'
import { centsToDollars } from 'lib/utils'
import MidScreenContainer from 'components/container/mid-screen'
import SelectBatchPayments from './select-batch-payments'
import { useRouter } from 'next/router'

export default function BatchPaymentScreen() {
  // const { batchPaymentSession, closeView, setVendorAccount, setBatchPaymentSession, resetBatchPaymentSession } =
  // useAppStore()
  const router = useRouter()
  const id = router.query.id
  const { registerId } = useCurrentRegisterId()
  const { clerk } = useClerk()
  // const { accountPayments = [], id } = batchPaymentSession || {}
  const { vendorAccounts, isVendorAccountsLoading } = useVendorAccounts()
  const { batchPayment, isBatchPaymentLoading } = useVendorBatchPayment(id)
  const [paymentList, setPaymentList] = useState([])
  const [stage, setStage] = useState(0)
  console.log(batchPayment)
  console.log(vendorAccounts)

  useEffect(() => {
    setPaymentList(
      vendorAccounts
        ?.map((vendorAccount) => {
          const payment = batchPayment?.paymentList?.find((payment) => payment?.vendorId === vendorAccount?.id) || {}
          Object.keys(payment).length > 0 && console.log(payment)
          return {
            ...vendorAccount,
            ...payment,
            isChecked: id === 'new' ? checkDefaultChecked(vendorAccount) : payment?.isChecked,
            payAmount: centsToDollars(payment?.amount || vendorAccount?.totalOwing).toFixed(2),
          }
        })
        ?.sort((a, b) => {
          if (!a?.isChecked && b?.isChecked) return 1
          if (!b?.isChecked && a?.isChecked) return -1
          return b?.totalOwing - a?.totalOwing
        }),
    )
  }, [vendorAccounts])

  // console.log(paymentList)

  const buttons: ModalButton[] = false
    ? [
        {
          type: 'ok',
          text: 'NEXT',
          onClick: () => setStage(1),
          disabled: paymentList?.reduce((prev, v) => (isNaN(parseFloat(v?.payAmount)) ? prev + 1 : prev), 0) > 0,
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
            createVendorBatchPayment({ paymentList, clerkId: clerk?.id, registerId, emailed }).then((id) => {
              downloadKbbFile(id, paymentList)
              downloadEmailList(id, paymentList)
            })
          },
        },
      ]

  return (
    <MidScreenContainer
      title={id ? `BATCH PAYMENT #${`00000${id}`.slice(-5)}` : 'NEW BATCH PAYMENT'}
      titleClass="bg-brown-dark text-white"
      isLoading={isVendorAccountsLoading}
      // actionButtons={buttons}
      full
      dark
    >
      <div>
        <SelectBatchPayments paymentList={paymentList} />
      </div>
      {/* <div className="w-1/4 bg-white"></div> */}
      {/* <div className="w-full" hidden={stage === 0}>
          <CheckBatchPayments vendorList={vendorList} setKbbLoaded={setKbbLoaded} setEmailed={setEmailed} />
        </div> */}
    </MidScreenContainer>
  )
}
