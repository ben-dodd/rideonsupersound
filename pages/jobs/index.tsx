import { useState } from 'react'
import Tabs from 'components/navigation/tabs'
import TaskDialog from 'features/job/job-dialog'
import JobView from 'features/job/job-view'
import Layout from 'components/layout'
import RestockTaskView from 'features/job/restock-task-view'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'

export default function JobsPage() {
  const [tab, setTab] = useState(0)

  return (
    <>
      <div className={`flex flex-col overflow-x-hidden`}>
        <div className="bg-col10 text-4xl font-bold uppercase text-white p-2 mb-1">Jobs</div>
        <div className="h-main w-full overflow-y-scroll px-2 bg-white">
          <Tabs tabs={['Restocking', 'Mail Orders', 'Other Jobs']} value={tab} onChange={setTab} />
          <div hidden={tab !== 0}>
            <RestockTaskView />
          </div>
          <div hidden={tab !== 1}>
            <JobView filter={(job) => job?.is_post_mail_order} />
          </div>
          <div hidden={tab !== 2}>
            <JobView filter={(job) => !job?.is_post_mail_order} />
          </div>
        </div>
      </div>
      <TaskDialog />
    </>
  )
}

JobsPage.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps = withPageAuthRequired()
