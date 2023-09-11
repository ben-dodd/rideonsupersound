import { useEffect, useState } from 'react'
import { checkDefaultChecked, downloadEmailList, downloadFile, modulusCheck } from 'lib/functions/payment'
import {
  deleteVendorBatchPayment,
  saveVendorBatchPayment,
  useVendorAccounts,
  useVendorBatchPayment,
} from 'lib/api/vendor'
import { centsToDollars, dollarsToCents } from 'lib/utils'
import MidScreenContainer from 'components/container/mid-screen'
import SelectBatchPayments from './select-batch-payments'
import { useRouter } from 'next/router'
import ReviewBatchPayments from './review-batch-payments'
import { useAppStore } from 'lib/store'
import ViewBatchPayments from './view-batch-payments'
import { useSWRConfig } from 'swr'
import { Delete, Email, NoTransfer } from '@mui/icons-material'
import dayjs from 'dayjs'

export default function BatchPaymentScreen() {
  const router = useRouter()
  const { batchPaymentSession, resetBatchPaymentSession, setBatchPaymentSession, openConfirm } = useAppStore()
  const id = router.query.id
  const { vendorAccounts, isVendorAccountsLoading } = useVendorAccounts()
  const { batchPayment, isBatchPaymentLoading } = useVendorBatchPayment(id)
  const { mutate } = useSWRConfig()
  const [stage, setStage] = useState('select')
  const [bypassConfirmDialog, setBypassConfirmDialog] = useState(false)
  useEffect(() => {
    const saveBatchAndRedirect = (url) => {
      console.log('saving batch and redirect')
      saveVendorBatchPayment(batchPaymentSession).then((savedBatchPayment) => {
        mutate(`vendor/payment/batch/${savedBatchPayment?.id}`, savedBatchPayment)
        mutate(`vendor/payment/batch`)
        mutate(`vendor/payment`)
        router.push(url)
      })
    }
    const changePage = (url) => {
      bypassConfirmDialog
        ? null
        : batchPaymentSession?.id
        ? saveBatchAndRedirect(url)
        : openConfirm({
            open: true,
            title: 'Do you want to save the current payment session?',
            yesText: 'Yes, Please Save',
            noText: 'No, Discard Changes',
            action: () => saveBatchAndRedirect(url),
          })
    }
    router.events.on('routeChangeStart', changePage)

    // unsubscribe on component destroy in useEffect return function
    return () => {
      router.events.off('routeChangeStart', changePage)
    }
  }, [batchPaymentSession, bypassConfirmDialog])

  console.log(batchPaymentSession)

  const totalPay = dollarsToCents(
    batchPaymentSession?.paymentList?.reduce((prev, v) => (v?.isChecked ? parseFloat(v?.payAmount) : 0) + prev, 0),
  )
  const totalNumVendors = batchPaymentSession?.paymentList?.filter((v) => v?.isChecked)?.length

  useEffect(() => {
    setBatchPaymentSession({ totalPay, totalNumVendors })
  }, [totalPay, totalNumVendors])

  useEffect(() => {
    let paymentList = batchPayment?.paymentList
    if (!batchPayment?.dateCompleted)
      paymentList = vendorAccounts
        ?.filter((vendorAccount) => vendorAccount?.id !== 666)
        ?.map((vendorAccount) => {
          const payment = batchPayment?.paymentList?.find((payment) => payment?.vendorId === vendorAccount?.id) || {}
          let invalidBankAccountNumber = !modulusCheck(vendorAccount?.bankAccountNumber)
          let hasNegativeQuantityItems = vendorAccount?.totalItems?.filter((i) => i?.quantity < 0)?.length > 0
          return {
            ...vendorAccount,
            ...payment,
            vendorId: vendorAccount?.id,
            invalidBankAccountNumber,
            hasNegativeQuantityItems,
            isChecked: id === 'new' ? checkDefaultChecked(vendorAccount) : payment?.isChecked,
            payAmount: payment?.payAmount || centsToDollars(vendorAccount?.totalOwing).toFixed(2),
          }
        })
        ?.sort((a, b) => {
          if (!a?.isChecked && b?.isChecked) return 1
          if (!b?.isChecked && a?.isChecked) return -1
          return b?.totalOwing - a?.totalOwing
        })
    setBatchPaymentSession({ ...batchPayment, paymentList })
  }, [vendorAccounts, id])

  const deleteBatchPayment = () => {
    openConfirm({
      open: true,
      title: 'Are you sure?',
      message: 'Are you sure you want to delete this batch payment?',
      action: () => {
        if (batchPayment?.id) {
          setBatchPaymentSession({ isDeleted: true })
          deleteVendorBatchPayment(batchPayment?.id)
        } else resetBatchPaymentSession()
        setBypassConfirmDialog(true)
        mutate(`vendor/payment/batch`)
        mutate(`vendor/payment`)
        router.push(`/payments`)
      },
    })
  }

  const viewMenuItems = [
    // { text: 'Edit', icon: <Edit />, onClick: () => setBatchPaymentSession({ dateCompleted: null }) },
    {
      text: 'Download KBB File',
      icon: <NoTransfer />,
      onClick: () =>
        downloadFile(
          batchPaymentSession?.kbbFile,
          `batch-payment-${`00000${batchPaymentSession?.id}`.slice(-5)}-${dayjs(
            batchPaymentSession?.dateCompleted,
          ).format('YYYY-MM-DD')}.kbb`,
        ),
    },
    {
      text: 'Download Email List',
      icon: <Email />,
      onClick: () =>
        downloadEmailList(
          batchPaymentSession?.emailCsvFile,
          `batch-payment-email-list-${`00000${batchPaymentSession?.id}`.slice(-5)}-${dayjs(
            batchPaymentSession?.dateCompleted,
          ).format('YYYY-MM-DD')}.csv`,
        ),
    },
    { text: 'Delete Batch Payment', icon: <Delete />, onClick: deleteBatchPayment },
  ]

  const menuItems = [{ text: 'Delete Batch Payment', icon: <Delete />, onClick: deleteBatchPayment }]

  return (
    <MidScreenContainer
      title={`${id}`?.toLowerCase() === 'new' ? 'NEW BATCH PAYMENT' : `BATCH PAYMENT #${`00000${id}`.slice(-5)}`}
      titleClass="bg-brown-dark text-white"
      isLoading={isVendorAccountsLoading || isBatchPaymentLoading}
      menuItems={batchPayment?.dateCompleted ? viewMenuItems : menuItems}
      showBackButton
      full
      dark
    >
      {batchPaymentSession?.dateCompleted ? (
        <ViewBatchPayments />
      ) : stage === 'select' ? (
        <SelectBatchPayments setStage={setStage} setBypassConfirmDialog={setBypassConfirmDialog} />
      ) : stage === 'review' ? (
        <ReviewBatchPayments setStage={setStage} setBypassConfirmDialog={setBypassConfirmDialog} />
      ) : (
        <div />
      )}
    </MidScreenContainer>
  )
}
