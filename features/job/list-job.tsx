import { useState } from 'react'
import { ClerkObject, TaskObject } from 'lib/types'
import dayjs from 'dayjs'
import { completeTask } from 'lib/functions/job'
import { useClerk, useClerks } from 'lib/api/clerk'
import { useJobs } from 'lib/api/jobs'
import { dateTime } from 'lib/types/date'
import CheckBox from 'components/inputs/check-box'

type ListItemProps = {
  task: TaskObject
}

export default function ListJob({ task }: ListItemProps) {
  const { clerks } = useClerks()
  const { jobs, mutateJobs } = useJobs()
  const { clerk } = useClerk()
  const [checked, setChecked] = useState(task?.isCompleted)

  return (
    <div
      className={`flex w-full border-b border-yellow-100 py-1 text-sm${
        task?.isCompleted
          ? ' bg-gray-200 text-gray-600'
          : task?.isPriority
          ? ' bg-red-100 text-black font-bold'
          : ' text-black'
      }`}
    >
      <div className="flex flex-col sm:flex-row w-full justify-between">
        <div className="flex w-2/12">
          <div className="mx-2 w-1/12">
            <CheckBox
              value={checked}
              disabled={checked}
              onChange={() => {
                setChecked(!checked)
                const otherJobs = jobs?.filter((t: TaskObject) => t?.id !== task?.id)
                const completedTask = {
                  ...task,
                  dateCompleted: dayjs.utc().format(),
                  completedByClerkId: clerk?.id,
                  isCompleted: true,
                }
                mutateJobs([...otherJobs, completedTask], false)
                completeTask(completedTask)
              }}
            />
          </div>
          <div className="font-bold pr-4 text-pink-600">{dayjs(task?.dateCreated).format(dateTime)}</div>
        </div>
        <div className={`w-4/12 ${checked ? 'line-through' : ''}`}>{task?.description}</div>
        {/*<div className="grid grid-cols-3 w-2/5">
          <div className="text-blue-800">{`Created by ${
            clerks?.find(
              (c: ClerkObject) => c?.id === task?.created_by_clerk_id
            )?.name
          }`}</div>*/}
        <div className="w-3/12">{task?.assignedTo ? <div>{`Assigned to ${task?.assignedTo}`}</div> : <div />}</div>
        <div className="w-3/12 text-right">
          {task?.completedByClerkId
            ? `Completed by ${clerks?.find((c: ClerkObject) => c?.id === task?.completedByClerkId)?.name} (${dayjs(
                task?.dateCompleted,
              ).format(dateTime)})`
            : ''}
        </div>
      </div>
    </div>
  )
}
