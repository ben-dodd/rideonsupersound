import MidScreenContainer from 'components/container/mid-screen'
import Tabs from 'components/navigation/tabs'
import { useStockList } from 'lib/api/stock'
import { useAppStore } from 'lib/store'
import ComingSoon from 'components/placeholders/coming-soon'
import StockList from './stock-list'
import { Pages } from 'lib/store/types'

const InventoryScreen = () => {
  const { stockList, isStockListLoading } = useStockList()
  const {
    stockPage: { tab },
    setSearchBar,
    setPage,
  } = useAppStore()
  const setTab = (tab) => setPage(Pages.stockPage, { tab })
  // const isFull = !(tab === 4 && holdsPage?.loadedHold)

  return (
    <MidScreenContainer title="Stock List" isLoading={isStockListLoading} titleClass="bg-col2" full={true}>
      <Tabs
        tabs={['Stock List', 'Category View', 'Recent Arrivals', 'Recently Sold', 'Sections', 'Category Manager']}
        value={tab}
        onChange={setTab}
      />
      {tab === 0 && <StockList />}
      {tab === 1 && <ComingSoon />}
      {tab === 2 && <ComingSoon />}
      {tab === 3 && <ComingSoon />}
      {tab === 4 && <ComingSoon />}
      {tab === 5 && <ComingSoon />}
      {tab === 6 && <ComingSoon />}
    </MidScreenContainer>
  )
}

export default InventoryScreen
