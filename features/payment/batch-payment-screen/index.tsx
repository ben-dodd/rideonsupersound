import { useEffect, useState } from 'react'
import { checkDefaultChecked } from 'lib/functions/payment'
import { useVendorAccounts, useVendorBatchPayment } from 'lib/api/vendor'
import { centsToDollars } from 'lib/utils'
import MidScreenContainer from 'components/container/mid-screen'
import SelectBatchPayments from './select-batch-payments'
import { useRouter } from 'next/router'
import CheckBatchPayments from './check-batch-payments'

export default function BatchPaymentScreen() {
  const router = useRouter()
  const id = router.query.id
  const { vendorAccounts, isVendorAccountsLoading } = useVendorAccounts()
  const { batchPayment } = useVendorBatchPayment(`${id}`)
  const [paymentList, setPaymentList] = useState([])
  const [stage, setStage] = useState('select')

  useEffect(() => {
    setPaymentList(
      vendorAccounts
        ?.filter((vendorAccount) => vendorAccount?.id !== 666)
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

  return (
    <MidScreenContainer
      title={`${id}`?.toLowerCase() === 'new' ? 'NEW BATCH PAYMENT' : `BATCH PAYMENT #${`00000${id}`.slice(-5)}`}
      titleClass="bg-brown-dark text-white"
      isLoading={isVendorAccountsLoading}
      full
      dark
    >
      {stage === 'select' ? (
        <SelectBatchPayments paymentList={paymentList} setPaymentList={setPaymentList} setStage={setStage} />
      ) : stage === 'review' ? (
        <CheckBatchPayments paymentList={paymentList} setStage={setStage} />
      ) : (
        <div />
      )}
    </MidScreenContainer>
  )
}
