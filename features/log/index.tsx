import MidScreenContainer from 'components/container/mid-screen'
import Tabs from 'components/navigation/tabs'
import { useLogs } from 'lib/api/log'
import { useAppStore } from 'lib/store'
import { Pages } from 'lib/store/types'
import { LogView } from './log-view'
import { StockMovementView } from './stock-movement-view'

const LogsScreen = () => {
  const { isLogsLoading } = useLogs()
  const {
    logsPage: { tab },
    setPage,
  } = useAppStore()
  const setTab = (tab) => setPage(Pages.logsPage, { tab })
  return (
    <MidScreenContainer title="Logs" isLoading={isLogsLoading} titleClass="bg-col9" full={true}>
      <Tabs tabs={['Logs', 'Stock Movement']} value={tab} onChange={setTab} />
      {tab === 0 && <LogView />}
      {tab === 1 && <StockMovementView />}
    </MidScreenContainer>
  )
}

export default LogsScreen
