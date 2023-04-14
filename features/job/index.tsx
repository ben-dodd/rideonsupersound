import { NewReleases } from '@mui/icons-material'
import MidScreenContainer from 'components/container/mid-screen'
import Tabs from 'components/navigation/tabs'
import { useJobs } from 'lib/api/jobs'
import { useAppStore } from 'lib/store'
import { Pages, ViewProps } from 'lib/store/types'
import JobView from './job-view'
import RestockTaskView from './restock-task-view'

const JobsScreen = () => {
  const { isJobsLoading } = useJobs()
  const {
    jobsPage: { tab },
    setPage,
    openView,
  } = useAppStore()
  const setTab = (tab) => setPage(Pages.jobsPage, { tab })
  const menuItems = [{ text: 'New Job', icon: <NewReleases />, onClick: () => openView(ViewProps.taskDialog) }]
  return (
    <MidScreenContainer title="Jobs" isLoading={isJobsLoading} titleClass="bg-col8" full={true} menuItems={menuItems}>
      <Tabs tabs={['Restocking', 'Mail Orders', 'Other Jobs']} value={tab} onChange={setTab} />
      {tab === 0 && <RestockTaskView />}
      {tab === 1 && <JobView filter={(job) => job?.isPostMailOrder} />}
      {tab === 2 && <JobView filter={(job) => !job?.isPostMailOrder} />}
    </MidScreenContainer>
  )
}

export default JobsScreen
