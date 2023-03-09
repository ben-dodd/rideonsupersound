import { AccountBalance, AddCircle, DisplaySettings, Money, TransferWithinAStation } from '@mui/icons-material'
import MidScreenContainer from 'components/container/mid-screen'
import Tabs from 'components/navigation/tabs'
import ComingSoon from 'components/placeholders/coming-soon'
import { useAppStore } from 'lib/store'
import { Pages } from 'lib/store/types'
import React from 'react'
import VendorList from './vendor-list'

const VendorsScreen = () => {
  const {
    vendorsPage: { tab },
    setPage,
  } = useAppStore()
  const setTab = (tab) => setPage(Pages.vendorsPage, { tab })
  const menuItems = [
    { text: 'New Vendor', icon: <AddCircle />, onClick: null },
    { text: 'Manually Pay Vendor', icon: <Money />, onClick: null },
    { text: 'Transfer Credit Between Vendors', icon: <TransferWithinAStation />, onClick: null },
    { text: 'Start New Batch Payment', icon: <AccountBalance />, onClick: null },
    { text: 'Manage Settings', icon: <DisplaySettings />, onClick: null },
  ]
  return (
    <MidScreenContainer title="Vendors" isLoading={false} titleClass="bg-col3" full={true} menuItems={menuItems}>
      <Tabs tabs={['Vendor List', 'Balance Sheet']} value={tab} onChange={setTab} />
      {tab === 0 && <VendorList />}
      {tab === 1 && <ComingSoon />}
    </MidScreenContainer>
  )
}

export default VendorsScreen
