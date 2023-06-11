import MidScreenContainer from 'components/container/mid-screen'
import PaymentList from './payment-list'
import { AccountBalance, Money, TransferWithinAStation } from '@mui/icons-material'
import { useCurrentVendorBatchPaymentId } from 'lib/api/vendor'
import { ViewProps } from 'lib/store/types'
import { useAppStore } from 'lib/store'
import { useRouter } from 'next/router'

const PaymentsScreen = () => {
  const { openView } = useAppStore()
  const router = useRouter()
  const { currentVendorBatchPaymentId } = useCurrentVendorBatchPaymentId()
  const menuItems = [
    { text: 'Manually Pay Vendor', icon: <Money />, onClick: () => openView(ViewProps.cashVendorPaymentDialog) },
    {
      text: 'Transfer Credit Between Vendors',
      icon: <TransferWithinAStation />,
      onClick: () => openView(ViewProps.transferVendorPaymentDialog),
    },
    {
      text: currentVendorBatchPaymentId ? 'Continue Batch Payment' : 'Start New Batch Payment',
      icon: <AccountBalance />,
      onClick: () => router.push(`/payments/batch/${currentVendorBatchPaymentId || 'new'}`),
    },
  ]
  const isLoading = false
  return (
    <MidScreenContainer title="Payments" isLoading={isLoading} titleClass="bg-col4" full={true} menuItems={menuItems}>
      <PaymentList />
    </MidScreenContainer>
  )
}

export default PaymentsScreen
