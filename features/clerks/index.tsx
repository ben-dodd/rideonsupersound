import { DisplaySettings, PersonAdd } from '@mui/icons-material'
import dynamic from 'next/dynamic'
import MidScreenContainer from 'components/container/mid-screen'
import Tabs from 'components/navigation/tabs'
import { useAppStore } from 'lib/store'
import { Pages } from 'lib/store/types'
import Tab from 'components/navigation/tabs/tab'
const ComingSoon = dynamic(() => import('components/placeholders/coming-soon'))

const ClerksScreen = () => {
  const isLoading = false
  const {
    pages: {
      ordersPage: { tab },
    },
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
      <Tab selectedTab={tab} tab={0}>
        <ComingSoon />
      </Tab>
      <Tab selectedTab={tab} tab={1}>
        <ComingSoon />
      </Tab>
      <Tab selectedTab={tab} tab={2}>
        <ComingSoon />
      </Tab>
    </MidScreenContainer>
  )
}

export default ClerksScreen
