import { DisplaySettings, Summarize } from '@mui/icons-material'
import MidScreenContainer from 'components/container/mid-screen'
import Tabs from 'components/navigation/tabs'
import ComingSoon from 'components/placeholders/coming-soon'
import { useSalesForRange } from 'lib/hooks/sales'
import { useAppStore } from 'lib/store'
import { Pages } from 'lib/store/types'
import { useState } from 'react'
import SalesCalendarView from './views/calendar-view'
import SalesListView from './views/calendar-view'
import HoldsList from './holds-list'
import LaybysList from './views/laybys'
import ParkedSalesList from './views/parked-sales'
import SalesList from './views/sales-list'

const SalesScreen = () => {
  const { salesPage, holdsPage, setPage } = useAppStore()
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
