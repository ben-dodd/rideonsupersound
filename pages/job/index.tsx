import { useAtom } from 'jotai'
import { useState } from 'react'

import { pageAtom } from 'lib/atoms'

import Tabs from 'components/navigation/tabs'
import TaskDialog from '../../features/job/components/job-dialog'
import JobView from './job-view'
import RestockTaskView from './restock-task-view'

export default function JobsPage() {
  const [page] = useAtom(pageAtom)
  const [tab, setTab] = useState(0)

  return (
    <>
      <div
        className={`flex flex-col overflow-x-hidden ${
          page !== 'jobs' ? 'hidden' : ''
        }`}
      >
        <div className="bg-col10 text-4xl font-bold uppercase text-white p-2 mb-1">
          Jobs
        </div>
        <div className="h-menu w-full overflow-y-scroll px-2 bg-white">
          <Tabs
            tabs={['Restocking', 'Mail Orders', 'Other Jobs']}
            value={tab}
            onChange={setTab}
          />
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
