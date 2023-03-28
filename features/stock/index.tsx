import MidScreenContainer from 'components/container/mid-screen'
import Tabs from 'components/navigation/tabs'
import { useStockList } from 'lib/api/stock'
import { useAppStore } from 'lib/store'
import ComingSoon from 'components/placeholders/coming-soon'
import StockList from './stock-list'
import { Pages, ViewProps } from 'lib/store/types'
import { AutoFixHigh, CollectionsBookmark, DisplaySettings, EventBusy, Print } from '@mui/icons-material'

const StockScreen = () => {
  const { stockList, isStockListLoading } = useStockList()
  const {
    stockPage: { tab },
    setSearchBar,
    setPage,
    openView,
  } = useAppStore()
  const setTab = (tab) => setPage(Pages.stockPage, { tab })
  // const isFull = !(tab === 4 && holdsPage?.loadedHold)
  const menuItems = [
    { text: 'Receive Stock', icon: <CollectionsBookmark />, onClick: () => openView(ViewProps.receiveStockScreen) },
    { text: 'Return Stock to Vendor', icon: <EventBusy />, onClick: () => openView(ViewProps.returnStockScreen) },
    { text: 'Print Labels', icon: <Print />, onClick: () => openView(ViewProps.labelPrintDialog) },
    { text: 'Bulk Edit Items', icon: <AutoFixHigh />, onClick: null, disabled: true },
    { text: 'Manage Settings', icon: <DisplaySettings />, onClick: null, disabled: true },
  ]

  return (
    <MidScreenContainer
      title="Stock List"
      isLoading={isStockListLoading}
      titleClass="bg-col2"
      full={true}
      menuItems={menuItems}
    >
      <Tabs tabs={['Stock List', 'Recent Arrivals', 'Recently Sold']} value={tab} onChange={setTab} />
      {tab === 0 && <StockList />}
      {tab === 1 && <ComingSoon />}
      {tab === 2 && <ComingSoon />}
    </MidScreenContainer>
  )
}

export default StockScreen
