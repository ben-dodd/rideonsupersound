import { AddCircle, DisplaySettings } from '@mui/icons-material'
import MidScreenContainer from 'components/container/mid-screen'
import Tabs from 'components/navigation/tabs'
import ComingSoon from 'components/placeholders/coming-soon'
import { useAppStore } from 'lib/store'
import { Pages, ViewProps } from 'lib/store/types'
import VendorList from './vendor-list'

const VendorsScreen = () => {
  const {
    vendorsPage: { tab },
    setPage,
    openView,
  } = useAppStore()
  const setTab = (tab) => setPage(Pages.vendorsPage, { tab })
  const menuItems = [
    { text: 'New Vendor', icon: <AddCircle />, onClick: () => openView(ViewProps.vendorEditDialog) },
    { text: 'Manage Settings', icon: <DisplaySettings />, onClick: null, disabled: true },
  ]
  return (
    <MidScreenContainer title="Vendors" isLoading={false} titleClass="bg-col3" full={true} menuItems={menuItems}>
      <Tabs tabs={['Vendor List', 'My Vendors']} value={tab} onChange={setTab} />
      {tab === 0 && <VendorList />}
      {tab === 1 && <ComingSoon />}
    </MidScreenContainer>
  )
}

export default VendorsScreen
