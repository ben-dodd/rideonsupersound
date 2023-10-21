import { DisplaySettings, PersonAdd } from '@mui/icons-material'
import MidScreenContainer from 'components/container/mid-screen'
import Tabs from 'components/navigation/tabs'
import ComingSoon from 'components/placeholders/coming-soon'
import { useAppStore } from 'lib/store'
import { Pages } from 'lib/store/types'

const ClerksScreen = () => {
  const isLoading = false
  const {
    ordersPage: { tab },
    setPage,
  } = useAppStore()
  const setTab = (tab) => setPage(Pages.ordersPage, { tab })
  const menuItems = [
    { text: 'New Clerk', icon: <PersonAdd />, onClick: null },
    { text: 'Manage Settings', icon: <DisplaySettings />, onClick: null },
  ]
  return (
    <MidScreenContainer title="CLERKS" isLoading={isLoading} titleClass="bg-col5" full={true} menuItems={menuItems}>
      <Tabs tabs={['Clerks', 'Schedule']} value={tab} onChange={setTab} />
      {tab === 0 && <ComingSoon />}
      {tab === 1 && <ComingSoon />}
      {tab === 2 && <ComingSoon />}
    </MidScreenContainer>
  )
}

export default ClerksScreen
