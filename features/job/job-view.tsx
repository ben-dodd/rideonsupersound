import ListTask from 'features/job/components/list-job'
import { useJobs } from 'lib/api/jobs'
import { TaskObject } from 'lib/types'
import dayjs from 'dayjs'

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

function sortJobs(jobA: TaskObject, jobB: TaskObject) {
  if (jobA?.isCompleted && !jobB?.isCompleted) return 1
  else if (jobB?.isCompleted && !jobA?.isCompleted) return -1
  else if (jobA?.isCompleted) {
    return dayjs(jobA?.dateCompleted).isAfter(jobB.dateCompleted) ? -1 : 1
  } else if (jobA?.isPriority && !jobB?.isPriority) return -1
  else if (jobB?.isPriority && !jobA?.isPriority) return 1
  else return dayjs(jobA?.dateCreated).isAfter(jobB?.dateCreated) ? -1 : 1
}
