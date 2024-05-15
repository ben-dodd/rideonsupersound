import MidScreenContainer from 'components/container/mid-screen'
import PaymentList from './payment-list'
import { AccountBalance, Money, TransferWithinAStation } from '@mui/icons-material'
import { useCurrentVendorBatchPaymentId } from 'lib/api/vendor'
import { Pages, ViewProps } from 'lib/store/types'
import { useAppStore } from 'lib/store'
import { useRouter } from 'next/router'
import { useClerk } from 'lib/api/clerk'
import dayjs from 'dayjs'
import Tabs from 'components/navigation/tabs'
import BatchPaymentList from './batch-payment-list'

const PaymentsScreen = () => {
  const {
    pages: {
      paymentsPage: { tab },
    },
    openView,
    openConfirm,
    resetBatchPaymentSession,
    setBatchPaymentSession,
    setPage,
  } = useAppStore()
  const { clerk } = useClerk()
  const router = useRouter()
  const { currentVendorBatchPaymentId } = useCurrentVendorBatchPaymentId()
  const setTab = (tab) => setPage(Pages.paymentsPage, { tab })
  const handleCreateNewBatchPayment = () => {
    resetBatchPaymentSession(),
      setBatchPaymentSession({ startedByClerkId: clerk?.id, dateStarted: dayjs.utc().format() })
    router.push(`/payments/batch/new`)
  }
  const menuItems = [
    { text: 'Manually Pay Vendor', icon: <Money />, onClick: () => openView(ViewProps.cashVendorPaymentDialog) },
    {
      text: 'Transfer Credit Between Vendors',
      icon: <TransferWithinAStation />,
      onClick: () => openView(ViewProps.transferVendorPaymentDialog),
    },
    {
      // text: currentVendorBatchPaymentId ? 'Continue Batch Payment' : 'Start New Batch Payment',
      text: 'Start New Batch Payment',
      icon: <AccountBalance />,
      onClick: () => {
        if (currentVendorBatchPaymentId) {
          openConfirm({
            open: true,
            title: 'Create New Batch Payment?',
            message:
              'You already have an unfinished batch payment. Do you want to create a new one or continue the current one?',
            yesText: 'Create New Batch Payment',
            altText: 'Continue Current Batch Payment',
            action: handleCreateNewBatchPayment,
            altAction: () => router.push(`/payments/batch/${currentVendorBatchPaymentId}`),
          })
        } else {
          handleCreateNewBatchPayment()
        }
      },
    },
  ]
  const isLoading = false
  return (
    <MidScreenContainer title="Payments" isLoading={isLoading} titleClass="bg-col4" full={true} menuItems={menuItems}>
      <Tabs tabs={['Payment List', 'Batch Payments']} value={tab} onChange={setTab} />
      {tab === 0 && <PaymentList />}
      {tab === 1 && <BatchPaymentList />}
    </MidScreenContainer>
  )
}

export default PaymentsScreen
