import { DisplaySettings, Summarize } from '@mui/icons-material'
import dynamic from 'next/dynamic'
import MidScreenContainer from 'components/container/mid-screen'
import Tabs from 'components/navigation/tabs'
import { useAppStore } from 'lib/store'
import { Pages } from 'lib/store/types'
const SalesCalendarView = dynamic(() => import('./views/calendar-view'))
const HoldsList = dynamic(() => import('./holds-list'))
const ParkedSalesList = dynamic(() => import('./views/parked-sales'))
const LaybysList = dynamic(() => import('./views/laybys'))
const SalesList = dynamic(() => import('./views/sales-list'))
const ComingSoon = dynamic(() => import('components/placeholders/coming-soon'))

const SalesScreen = () => {
  const {
    pages: { salesPage, holdsPage },
    setPage,
  } = useAppStore()
  const tab = salesPage?.tab || 0
  const setTab = (tab) => setPage(Pages.salesPage, { tab })
  // const isFull = !(tab === 4 && holdsPage?.loadedHold)
  const isFull = true
  const menuItems = [
    { text: 'Create Report', icon: <Summarize />, onClick: null },
    { text: 'Manage Settings', icon: <DisplaySettings />, onClick: null },
  ]
  return (
    <MidScreenContainer title="SALES" titleClass="bg-col4" full={isFull} menuItems={menuItems}>
      <Tabs
        tabs={['Sales List', 'Calendar View', 'Parked Sales', 'Laybys', 'Holds', 'Stats']}
        value={tab}
        onChange={setTab}
      />
      {tab === 0 && <SalesList />}
      {tab === 1 && <SalesCalendarView />}
      {tab === 2 && <ParkedSalesList />}
      {tab === 3 && <LaybysList />}
      {tab === 4 && <HoldsList />}
      {tab === 5 && <ComingSoon />}
    </MidScreenContainer>
  )
}

export default SalesScreen
