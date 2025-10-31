import MidScreenContainer from 'components/container/mid-screen'
import dynamic from 'next/dynamic'
import Tabs from 'components/navigation/tabs'
import { useCurrentReceiveBatchId, useStockList } from 'lib/api/stock'
import { initBatchReceiveSession, useAppStore } from 'lib/store'
import { Pages, ViewProps } from 'lib/store/types'
import { AutoFixHigh, CollectionsBookmark, DisplaySettings, EventBusy, Print } from '@mui/icons-material'
import { useRouter } from 'next/router'
import { useClerk } from 'lib/api/clerk'
import dayjs from 'dayjs'

// Dynamic imports for code splitting
const ViewStockTable = dynamic(() => import('./view-stock-table'))
const StockArrivals = dynamic(() => import('./stock-arrivals'))
const RecentlySold = dynamic(() => import('./recently-sold'))
const BestSellers = dynamic(() => import('./best-sellers'))
const StockMovementList = dynamic(() => import('./stock-movement-list'))

const StockScreen = () => {
  const { isStockListLoading } = useStockList()
  const {
    pages: {
      stockPage: { tab },
    },
    setPage,
    openView,
    loadBatchReceiveSession,
    openConfirm,
  } = useAppStore()
  const router = useRouter()
  const { clerk } = useClerk()
  const { currentReceiveBatchId } = useCurrentReceiveBatchId()
  const setTab = (tab) => setPage(Pages.stockPage, { tab })
  const handleCreateNewReceiveBatch = () => {
    loadBatchReceiveSession({
      ...initBatchReceiveSession,
      startedByClerkId: clerk?.id,
      dateStarted: dayjs.utc().format(),
    })
    router.push(`/stock/receive/new`)
  }

  const menuItems = [
    {
      text: 'Receive Stock',
      icon: <CollectionsBookmark />,
      onClick: () => {
        if (currentReceiveBatchId) {
          openConfirm({
            open: true,
            title: 'Create New Receive Batch?',
            message:
              'You already have an unfinished receive batch. Do you want to create a new one or continue the current one?',
            yesText: 'Create New Receive Batch',
            altText: 'Continue Current Receive Batch',
            action: handleCreateNewReceiveBatch,
            altAction: () => router.push(`/stock/receive/${currentReceiveBatchId}`),
          })
        } else {
          handleCreateNewReceiveBatch()
        }
        router.push(`/stock/receive/new`)
      },
    },
    { text: 'Return Stock to Vendor', icon: <EventBusy />, onClick: () => openView(ViewProps.returnStockScreen) },
    { text: 'Print Labels', icon: <Print />, onClick: () => openView(ViewProps.labelPrintDialog) },
    { text: 'Bulk Edit Items', icon: <AutoFixHigh />, onClick: null, disabled: true },
    { text: 'Manage Settings', icon: <DisplaySettings />, onClick: null, disabled: true },
  ]

  return (
    <MidScreenContainer isLoading={isStockListLoading} menuItems={menuItems}>
      <div className="flex flex-col h-full">
        <Tabs
          tabs={['View Stock', 'Stock Arrivals', 'Recently Sold', 'Best Sellers', 'Stock Movement']}
          value={tab}
          onChange={setTab}
        />
        <div className="flex-1 overflow-hidden">
          {tab === 0 && <ViewStockTable />}
          {tab === 1 && <StockArrivals />}
          {tab === 2 && <RecentlySold />}
          {tab === 3 && <BestSellers />}
          {tab === 4 && <StockMovementList />}
        </div>
      </div>
    </MidScreenContainer>
  )
}

export default StockScreen
