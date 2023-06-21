import MidScreenContainer from 'components/container/mid-screen'
import PaymentList from './payment-list'
import { AccountBalance, Money, TransferWithinAStation } from '@mui/icons-material'
// import { useCurrentVendorBatchPaymentId } from 'lib/api/vendor'
import { Pages, ViewProps } from 'lib/store/types'
import { useAppStore } from 'lib/store'
import { useRouter } from 'next/router'
import { useClerk } from 'lib/api/clerk'
import dayjs from 'dayjs'
import Tabs from 'components/navigation/tabs'
import BatchPaymentList from './batch-payment-list'

const PaymentsScreen = () => {
  const {
    paymentsPage: { tab },
    openView,
    setBatchPaymentSession,
    setPage,
  } = useAppStore()
  const { clerk } = useClerk()
  const router = useRouter()
  // const { currentVendorBatchPaymentId } = useCurrentVendorBatchPaymentId()
  const setTab = (tab) => setPage(Pages.paymentsPage, { tab })
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
        // if (!currentVendorBatchPaymentId)
        setBatchPaymentSession({ startedByClerkId: clerk?.id, dateStarted: dayjs.utc().format() })
        router.push(`/payments/batch/new`)
        // router.push(`/payments/batch/${currentVendorBatchPaymentId || 'new'}`)
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
