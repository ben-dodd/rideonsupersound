import { useState } from 'react'
import { useAtom } from 'jotai'

// DB
import { useClerks, useJobs } from '@/lib/swr-hooks'
import { TaskObject, ClerkObject } from '@/lib/types'
import { clerkAtom } from '@/lib/atoms'
import { completeTask } from '@/lib/db-functions'
import dayjs from 'dayjs'
import { mysqlDate } from '@/lib/data-functions'

type ListItemProps = {
  task: TaskObject
}

export default function ListJob({ task }: ListItemProps) {
  // SWR
  const { clerks } = useClerks()
  const { jobs, mutateJobs } = useJobs()

  // Atoms
  const [clerk] = useAtom(clerkAtom)

  // State
  const [checked, setChecked] = useState(task?.is_completed)

  return (
    <div
      className={`flex w-full border-b border-yellow-100 py-1 text-sm${
        task?.is_completed
          ? ' bg-gray-200 text-gray-600'
          : task?.is_priority
          ? ' bg-red-100 text-black font-bold'
          : ' text-black'
      }`}
    >
      <div className="flex flex-col sm:flex-row w-full justify-between">
        <div className="flex w-2/12">
          <div className="mx-2 w-1/12">
            <input
              className="cursor-pointer"
              type="checkbox"
              checked={checked}
              disabled={checked}
              onChange={() => {
                setChecked(!checked)
                const otherJobs = jobs?.filter(
                  (t: TaskObject) => t?.id !== task?.id
                )
                const completedTask = {
                  ...task,
                  date_completed: dayjs.utc().format('YYYY-MM-DD HH:mm:ss'),
                  completed_by_clerk_id: clerk?.id,
                  is_completed: true,
                }
                mutateJobs([...otherJobs, completedTask], false)
                completeTask(completedTask)
              }}
            />
          </div>
          <div className="font-bold pr-4 text-pink-600">
            {dayjs(task?.date_created).format('D MMMM YYYY, h:mm A')}
          </div>
        </div>
        <div className={`w-4/12 ${checked ? 'line-through' : ''}`}>
          {task?.description}
        </div>
        {/*<div className="grid grid-cols-3 w-2/5">
          <div className="text-blue-800">{`Created by ${
            clerks?.filter(
              (c: ClerkObject) => c?.id === task?.created_by_clerk_id
            )[0]?.name
          }`}</div>*/}
        <div className="w-3/12">
          {task?.assigned_to ? (
            <div>{`Assigned to ${task?.assigned_to}`}</div>
          ) : (
            <div />
          )}
        </div>
        <div className="w-3/12 text-right">
          {task?.completed_by_clerk_id
            ? `Completed by ${
                clerks?.filter(
                  (c: ClerkObject) => c?.id === task?.completed_by_clerk_id
                )[0]?.name
              } (${dayjs(task?.date_completed).format('D MMMM YYYY, h:mm A')})`
            : ''}
        </div>
      </div>
    </div>
  )
}
