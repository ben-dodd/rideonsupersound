import MidScreenContainer from 'components/container/mid-screen'
import Tabs from 'components/navigation/tabs'
import { useCurrentReceiveBatchId, useStockList } from 'lib/api/stock'
import { useAppStore } from 'lib/store'
import ComingSoon from 'components/placeholders/coming-soon'
import StockList from './stock-list'
import { Pages, ViewProps } from 'lib/store/types'
import { AutoFixHigh, CollectionsBookmark, DisplaySettings, EventBusy, Print } from '@mui/icons-material'
import { useRouter } from 'next/router'
import ReceiveStockList from './receive-stock-list'
import StockMovementList from './stock-movement-list'
import { useClerk } from 'lib/api/clerk'
import dayjs from 'dayjs'

const StockScreen = () => {
  const { stockList, isStockListLoading } = useStockList()
  const {
    stockPage: { tab },
    setSearchBar,
    setPage,
    openView,
    setBatchReceiveSession,
    resetBatchReceiveSession,
    openConfirm,
  } = useAppStore()
  const router = useRouter()
  const { clerk } = useClerk()
  const { currentReceiveBatchId } = useCurrentReceiveBatchId()
  const setTab = (tab) => setPage(Pages.stockPage, { tab })
  const handleCreateNewReceiveBatch = () => {
    resetBatchReceiveSession()
    setBatchReceiveSession({ startedByClerkId: clerk?.id, dateStarted: dayjs.utc().format() })
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
      <Tabs
        tabs={['Stock List', 'Stock Arrivals', 'Recently Sold', 'Best Sellers', 'Stock Movement']}
        value={tab}
        onChange={setTab}
      />
      {tab === 0 && <StockList />}
      {tab === 1 && <ReceiveStockList />}
      {tab === 2 && <ComingSoon />}
      {tab === 3 && <ComingSoon />}
      {tab === 4 && <StockMovementList />}
    </MidScreenContainer>
  )
}

export default StockScreen
