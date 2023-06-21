import { AddBusiness, DisplaySettings, Summarize, UploadFile } from '@mui/icons-material'
import MidScreenContainer from 'components/container/mid-screen'
import Tabs from 'components/navigation/tabs'
import ComingSoon from 'components/placeholders/coming-soon'
import { useAppStore } from 'lib/store'
import { Pages } from 'lib/store/types'

const OrdersScreen = () => {
  const isLoading = false
  const {
    ordersPage: { tab },
    setPage,
  } = useAppStore()
  const setTab = (tab) => setPage(Pages.ordersPage, { tab })
  const menuItems = [
    { text: 'New Wholesaler', icon: <AddBusiness />, onClick: null },
    { text: 'Import Wholesaler Stocklist', icon: <UploadFile />, onClick: null },
    { text: 'Create Report', icon: <Summarize />, onClick: null },
    { text: 'Manage Settings', icon: <DisplaySettings />, onClick: null },
  ]
  return (
    <MidScreenContainer title="ORDERS" isLoading={isLoading} titleClass="bg-col5" full={true} menuItems={menuItems}>
      <Tabs tabs={['Current Orders', 'Order History', 'Wholesaler List']} value={tab} onChange={setTab} />
      {tab === 0 && <ComingSoon />}
      {tab === 1 && <ComingSoon />}
      {tab === 2 && <ComingSoon />}
    </MidScreenContainer>
  )
}

export default OrdersScreen
