import { useEffect, useState } from 'react'
import { checkDefaultChecked, modulusCheck } from 'lib/functions/payment'
import { useVendorAccounts } from 'lib/api/vendor'
import { centsToDollars } from 'lib/utils'
import MidScreenContainer from 'components/container/mid-screen'
import SelectBatchPayments from './select-batch-payments'
import { useRouter } from 'next/router'
import ReviewBatchPayments from './review-batch-payments'
import { useAppStore } from 'lib/store'
import ViewBatchPayments from './view-batch-payments'

export default function BatchPaymentScreen() {
  const router = useRouter()
  const { batchPaymentSession, setBatchPaymentList } = useAppStore()
  const id = router.query.id
  const { vendorAccounts, isVendorAccountsLoading } = useVendorAccounts()
  const [stage, setStage] = useState('select')
  console.log(batchPaymentSession)

  useEffect(() => {
    if (!batchPaymentSession?.dateCompleted)
      setBatchPaymentList(
        vendorAccounts
          ?.filter((vendorAccount) => vendorAccount?.id !== 666)
          ?.map((vendorAccount) => {
            const payment =
              batchPaymentSession?.paymentList?.find((payment) => payment?.vendorId === vendorAccount?.id) || {}
            Object.keys(payment).length > 0 && console.log(payment)
            let invalidBankAccountNumber = !modulusCheck(vendorAccount?.bankAccountNumber)
            let hasNegativeQuantityItems = vendorAccount?.totalItems?.filter((i) => i?.quantity < 0)?.length > 0
            return {
              ...vendorAccount,
              ...payment,
              vendorId: vendorAccount?.id,
              invalidBankAccountNumber,
              hasNegativeQuantityItems,
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
      showBackButton
      full
      dark
    >
      {batchPaymentSession?.dateCompleted ? (
        <ViewBatchPayments />
      ) : stage === 'select' ? (
        <SelectBatchPayments setStage={setStage} />
      ) : stage === 'review' ? (
        <ReviewBatchPayments setStage={setStage} />
      ) : (
        <div />
      )}
    </MidScreenContainer>
  )
}
