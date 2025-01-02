import { AddCircle, DisplaySettings } from '@mui/icons-material'
import dynamic from 'next/dynamic'
import MidScreenContainer from 'components/container/mid-screen'
import { useAppStore } from 'lib/store'
import { Pages, ViewProps } from 'lib/store/types'
const VendorList = dynamic(() => import('./vendor-list'))
const ComingSoon = dynamic(() => import('components/placeholders/coming-soon'))

const VendorsScreen = () => {
  const {
    pages: {
      vendorsPage: { tab },
    },
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
      <VendorList />
    </MidScreenContainer>
  )
}

export default VendorsScreen
