import MidScreenContainer from 'components/container/mid-screen'
import Tabs from 'components/navigation/tabs'
import ComingSoon from 'components/placeholders/coming-soon'
import { useSalesForRange } from 'lib/hooks/sales'
import { useAppStore } from 'lib/store'
import { Pages } from 'lib/store/types'
import { useState } from 'react'
import SalesCalendarView from './calendar-view'
import SalesListView from './calendar-view'
import HoldsList from './holds-list'
import LaybysList from './laybys'
import ParkedSalesList from './parked-sales'
import SalesList from './sales-list'

const SalesScreen = () => {
  const { salesPage, setPage } = useAppStore()
  const tab = salesPage?.tab || 0
  const setTab = (tab) => setPage(Pages.salesPage, { tab })
  return (
    <MidScreenContainer title="SALES" titleClass="bg-col5" full={true}>
      <Tabs
        tabs={['Sales List', 'Calendar View', 'Parked Sales', 'Laybys', 'Holds', 'Stats', 'Export Report']}
        value={tab}
        onChange={setTab}
      />
      <div hidden={tab !== 0}>
        <SalesList />
      </div>
      <div hidden={tab !== 1}>
        <SalesCalendarView />
      </div>
      <div hidden={tab !== 2}>
        <ParkedSalesList />
      </div>
      <div hidden={tab !== 3}>
        <LaybysList />
      </div>
      <div hidden={tab !== 4}>
        <HoldsList />
      </div>
      <div hidden={tab !== 5} className="h-contentsm">
        <ComingSoon />
      </div>
      <div hidden={tab !== 6} className="h-contentsm">
        <ComingSoon />
      </div>
    </MidScreenContainer>
  )
}

export default SalesScreen
