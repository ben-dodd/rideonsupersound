import MidScreenContainer from 'components/container/mid-screen'
import dynamic from 'next/dynamic'
import Tabs from 'components/navigation/tabs'
import { useCurrentReceiveBatchId, useStockList } from 'lib/api/stock'
import { initBatchReceiveSession, useAppStore } from 'lib/store'
import { Pages, ViewProps } from 'lib/store/types'
import { AutoFixHigh, CollectionsBookmark, DisplaySettings, EventBusy, Print } from '@mui/icons-material'
import { useRouter } from 'next/router'
import ReceiveStockList from './receive-stock-list'
import StockMovementList from './stock-movement-list'
import { useClerk } from 'lib/api/clerk'
import dayjs from 'dayjs'
import Tab from 'components/navigation/tabs/tab'
import ViewStockTable from './view-stock-table'
import EditStockTable from './edit-stock-table'
const ComingSoon = dynamic(() => import('components/placeholders/coming-soon'))

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

  // const isFull = !(tab === 4 && holdsPage?.loadedHold)
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
    <MidScreenContainer
      title="Stock"
      isLoading={isStockListLoading}
      titleClass="bg-col2"
      full={true}
      menuItems={menuItems}
    >
      <div className="flex justify-between">
        <Tabs
          tabs={['View Stock', 'Edit Stock', 'Stock Arrivals', 'Recently Sold', 'Best Sellers', 'Stock Movement']}
          value={tab}
          onChange={setTab}
        />
      </div>
      <Tab selectedTab={tab} tab={0}>
        <ViewStockTable />
      </Tab>
      <Tab selectedTab={tab} tab={1}>
        <EditStockTable />
      </Tab>
      <Tab selectedTab={tab} tab={2}>
        <ReceiveStockList />
      </Tab>
      <Tab selectedTab={tab} tab={3}>
        <ComingSoon />
      </Tab>
      <Tab selectedTab={tab} tab={4}>
        <ComingSoon />
      </Tab>
      <Tab selectedTab={tab} tab={5}>
        <StockMovementList />
      </Tab>
    </MidScreenContainer>
  )
}

export default StockScreen
