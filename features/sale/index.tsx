import MidScreenContainer from 'components/container/mid-screen'
import Tabs from 'components/navigation/tabs'
import { useSalesForRange } from 'lib/hooks/sales'
import { useAppStore } from 'lib/store'
import { Pages } from 'lib/store/types'
import { useState } from 'react'
import SalesCalendarView from './calendar-view'
import SalesListView from './calendar-view'
import SalesList from './sales-list'

const SalesScreen = () => {
  const { salesPage, setPage } = useAppStore()
  const tab = salesPage?.tab || 0
  const setTab = (tab) => setPage(Pages.salesPage, { tab })
  return (
    <MidScreenContainer title="SALES" titleClass="bg-col5" full={true}>
      <Tabs
        tabs={['Sales List', 'Parked Sales', 'Laybys', 'Holds', 'Calendar View', 'Stats', 'Export Report']}
        value={tab}
        onChange={setTab}
      />
      <div hidden={tab !== 0}>
        <SalesList />
      </div>
      <div hidden={tab !== 4}>
        <SalesCalendarView />
      </div>
    </MidScreenContainer>
  )
}

export default SalesScreen
