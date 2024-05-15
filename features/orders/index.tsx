import { AddBusiness, DisplaySettings, Summarize, UploadFile } from '@mui/icons-material'
import dynamic from 'next/dynamic'
import MidScreenContainer from 'components/container/mid-screen'
import Tabs from 'components/navigation/tabs'
import { useAppStore } from 'lib/store'
import { Pages } from 'lib/store/types'
import Tab from 'components/navigation/tabs/tab'
const ComingSoon = dynamic(() => import('components/placeholders/coming-soon'))

const OrdersScreen = () => {
  const isLoading = false
  const {
    pages: {
      ordersPage: { tab },
    },
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
      <Tab selectedTab={tab} tab={0}>
        <ComingSoon />
      </Tab>
      <Tab selectedTab={tab} tab={1}>
        <ComingSoon />
      </Tab>
      <Tab selectedTab={tab} tab={2}>
        <ComingSoon />
      </Tab>
    </MidScreenContainer>
  )
}

export default OrdersScreen
