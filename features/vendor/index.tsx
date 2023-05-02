import { AccountBalance, AddCircle, DisplaySettings, Money, TransferWithinAStation } from '@mui/icons-material'
import MidScreenContainer from 'components/container/mid-screen'
import Tabs from 'components/navigation/tabs'
import ComingSoon from 'components/placeholders/coming-soon'
import { useAppStore } from 'lib/store'
import { Pages, ViewProps } from 'lib/store/types'
import React from 'react'
import VendorList from './vendor-list'
import { useRouter } from 'next/router'
import PaymentList from './payment/payment-list'
import { useCurrentVendorBatchPaymentId } from 'lib/api/vendor'

const VendorsScreen = () => {
  const {
    vendorsPage: { tab },
    setPage,
    openView,
  } = useAppStore()
  const router = useRouter()
  const { currentVendorBatchPaymentId } = useCurrentVendorBatchPaymentId()
  const setTab = (tab) => setPage(Pages.vendorsPage, { tab })
  const menuItems = [
    { text: 'New Vendor', icon: <AddCircle />, onClick: () => openView(ViewProps.vendorEditDialog) },
    { text: 'Manually Pay Vendor', icon: <Money />, onClick: () => openView(ViewProps.cashVendorPaymentDialog) },
    {
      text: 'Transfer Credit Between Vendors',
      icon: <TransferWithinAStation />,
      onClick: () => openView(ViewProps.transferVendorPaymentDialog),
    },
    {
      text: currentVendorBatchPaymentId ? 'Continue Batch Payment' : 'Start New Batch Payment',
      icon: <AccountBalance />,
      onClick: () => router.push(`/batch-payment/${currentVendorBatchPaymentId || 'new'}`),
      // onClick: () => openView(ViewProps.batchVendorPaymentDialog),
    },
    { text: 'Manage Settings', icon: <DisplaySettings />, onClick: null, disabled: true },
  ]
  return (
    <MidScreenContainer title="Vendors" isLoading={false} titleClass="bg-col3" full={true} menuItems={menuItems}>
      <Tabs tabs={['Vendor List', 'My Vendors', 'Payments']} value={tab} onChange={setTab} />
      {tab === 0 && <VendorList />}
      {tab === 1 && <ComingSoon />}
      {tab === 2 && <PaymentList />}
    </MidScreenContainer>
  )
}

export default VendorsScreen
