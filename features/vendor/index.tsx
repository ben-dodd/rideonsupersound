import { AddCircle, DisplaySettings } from '@mui/icons-material'
import dynamic from 'next/dynamic'
import MidScreenContainer from 'components/container/mid-screen'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'
import VendorTable from './vendor-table'
const VendorList = dynamic(() => import('./vendor-list'))

const VendorsScreen = () => {
  const { openView } = useAppStore()
  const menuItems = [
    { text: 'New Vendor', icon: <AddCircle />, onClick: () => openView(ViewProps.vendorEditDialog) },
    { text: 'Manage Settings', icon: <DisplaySettings />, onClick: null, disabled: true },
  ]
  return (
    <MidScreenContainer title="Vendors" isLoading={false} titleClass="bg-col3" full={true} menuItems={menuItems}>
      {/* <VendorList /> */}
      <VendorTable />
    </MidScreenContainer>
  )
}

export default VendorsScreen
