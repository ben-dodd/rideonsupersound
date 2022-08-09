import { TaskObject } from '@lib/types'
import dayjs from 'dayjs'

export function sortJobs(jobA: TaskObject, jobB: TaskObject) {
  if (jobA?.is_completed && !jobB?.is_completed) return 1
  else if (jobB?.is_completed && !jobA?.is_completed) return -1
  else if (jobA?.is_completed) {
    return dayjs(jobA?.date_completed).isAfter(jobB.date_completed) ? -1 : 1
  } else if (jobA?.is_priority && !jobB?.is_priority) return -1
  else if (jobB?.is_priority && !jobA?.is_priority) return 1
  else return dayjs(jobA?.date_created).isAfter(jobB?.date_created) ? -1 : 1
}
