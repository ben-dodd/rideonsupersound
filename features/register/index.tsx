import { CloudDownload, CloudUpload, DisplaySettings, Summarize } from '@mui/icons-material'
import MidScreenContainer from 'components/container/mid-screen'
import Tabs from 'components/navigation/tabs'
import ComingSoon from 'components/placeholders/coming-soon'
import { useAppStore } from 'lib/store'
import { ViewProps, Pages } from 'lib/store/types'

const RegistersScreen = () => {
  const isLoading = false
  const {
    registersPage: { tab },
    setPage,
    openView,
  } = useAppStore()
  const setTab = (tab) => setPage(Pages.registersPage, { tab })
  const menuItems = [
    { text: 'Take Cash from Till', icon: <CloudUpload />, onClick: () => openView(ViewProps.takeCashDialog) },
    { text: 'Return Cash to Till', icon: <CloudDownload />, onClick: () => openView(ViewProps.returnCashDialog) },
    { text: 'Create Report', icon: <Summarize />, onClick: null },
    { text: 'Manage Settings', icon: <DisplaySettings />, onClick: null },
  ]
  return (
    <MidScreenContainer title="REGISTERS" isLoading={isLoading} titleClass="bg-col6" full={true} menuItems={menuItems}>
      <Tabs tabs={['Registers', 'Banking']} value={tab} onChange={setTab} />
      {tab === 0 && <ComingSoon />}
      {tab === 1 && <ComingSoon />}
    </MidScreenContainer>
  )
}

export default RegistersScreen
