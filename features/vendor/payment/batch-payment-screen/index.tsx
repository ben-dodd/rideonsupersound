import { useEffect, useState } from 'react'
import { checkDefaultChecked, downloadEmailList, downloadKbbFile } from 'lib/functions/payment'
import { useCurrentRegisterId } from 'lib/api/register'
import { useClerk } from 'lib/api/clerk'
import { createVendorBatchPayment, useVendorAccounts, useVendorBatchPayment } from 'lib/api/vendor'
import { centsToDollars } from 'lib/utils'
import MidScreenContainer from 'components/container/mid-screen'
import SelectBatchPayments from './select-batch-payments'
import { useRouter } from 'next/router'
import CheckBatchPayments from './check-batch-payments'

export default function BatchPaymentScreen() {
  const router = useRouter()
  const id = router.query.id
  const { registerId } = useCurrentRegisterId()
  const { clerk } = useClerk()
  const { vendorAccounts, isVendorAccountsLoading } = useVendorAccounts()
  const { batchPayment } = useVendorBatchPayment(`${id}`)
  const [paymentList, setPaymentList] = useState([])
  const [stage, setStage] = useState('select')

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

  const button =
    stage === 'select'
      ? [
          {
            type: 'ok',
            text: 'NEXT',
            onClick: () => setStage('review'),
            disabled: paymentList?.reduce((prev, v) => (isNaN(parseFloat(v?.payAmount)) ? prev + 1 : prev), 0) > 0,
          },
        ]
      : [
          {
            type: 'cancel',
            onClick: () => setStage('select'),
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
      full
      dark
    >
      {stage === 'select' ? (
        <SelectBatchPayments paymentList={paymentList} setPaymentList={setPaymentList} setStage={setStage} />
      ) : stage === 'review' ? (
        <CheckBatchPayments paymentList={paymentList} setKbbLoaded={true} setEmailed={true} setStage={setStage} />
      ) : (
        <div />
      )}
    </MidScreenContainer>
  )
}
