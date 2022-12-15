import ListTask from 'features/job/components/list-job'
import { useJobs } from 'lib/api/jobs'
import { TaskObject } from 'lib/types'
import { sortJobs } from './lib/functions'

export default function JobView(filter) {
  const { jobs, isJobsLoading } = useJobs()
  return isJobsLoading ? (
    <div className="w-full flex h-full">
      <div className="loading-icon" />
    </div>
  ) : (
    jobs
      ?.filter(filter)
      ?.sort(sortJobs)
      ?.map((task: TaskObject) => <ListTask task={task} key={task?.id} />)
  )
}
