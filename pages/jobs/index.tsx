import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import Layout from 'components/layout'
import JobsScreen from 'features/job'
import { useAppStore } from 'lib/store'
import dynamic from 'next/dynamic'

const TaskDialog = dynamic(() => import('features/job/job-dialog'))

function JobsPage() {
  const { view } = useAppStore()
  return (
    <div className={`flex relative overflow-x-hidden`}>
      <JobsScreen />
      {view?.taskDialog && <TaskDialog />}
    </div>
  )
}

JobsPage.getLayout = (page) => <Layout>{page}</Layout>

export default withPageAuthRequired(JobsPage)
