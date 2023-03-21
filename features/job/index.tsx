import MidScreenContainer from 'components/container/mid-screen'
import Tabs from 'components/navigation/tabs'
import { useJobs } from 'lib/api/jobs'
import { useAppStore } from 'lib/store'
import { Pages } from 'lib/store/types'
import JobView from './job-view'
import RestockTaskView from './restock-task-view'

const JobsScreen = () => {
  const { isJobsLoading } = useJobs()
  const {
    jobsPage: { tab },
    setPage,
  } = useAppStore()
  const setTab = (tab) => setPage(Pages.jobsPage, { tab })
  return (
    <MidScreenContainer title="Jobs" isLoading={isJobsLoading} titleClass="bg-col10" full={true}>
      <Tabs tabs={['Restocking', 'Mail Orders', 'Other Jobs']} value={tab} onChange={setTab} />
      {tab === 0 && <RestockTaskView />}
      {tab === 1 && <JobView filter={(job) => job?.isPostMailOrder} />}
      {tab === 2 && <JobView filter={(job) => !job?.isPostMailOrder} />}
    </MidScreenContainer>
  )
}

export default JobsScreen
