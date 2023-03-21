import TaskDialog from 'features/job/job-dialog'
import Layout from 'components/layout'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import JobsScreen from 'features/job'
import { useAppStore } from 'lib/store'

export default function JobsPage() {
  const { view } = useAppStore()
  return (
    <div className={`flex relative overflow-x-hidden`}>
      <JobsScreen />
      {view?.taskDialog && <TaskDialog />}
    </div>
  )
}

JobsPage.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps = withPageAuthRequired()
