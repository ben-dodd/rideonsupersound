// DB
import { useClerks } from '@/lib/swr-hooks'
import { LogObject, ClerkObject } from '@/lib/types'
import dayjs from 'dayjs'

type ListItemProps = {
  log: LogObject
}

export default function ListLog({ log }: ListItemProps) {
  // SWR
  const { clerks } = useClerks()

  return (
    <div className="flex w-full border-b border-yellow-100 py-1 font-mono text-xs text-black">
      <div className="flex flex-col sm:flex-row w-full justify-between">
        <div className="flex flex-col sm:flex-row w-full">
          <div className="font-bold pr-4 text-pink-600 sm:1/6">
            {dayjs(log?.date_created)?.format('D MMMM YYYY, h:mma')}
          </div>
          <div className="font-bold w-16 text-blue-800 sm:w-1/12">
            {
              clerks?.filter((c: ClerkObject) => c?.id === log?.clerk_id)[0]
                ?.name
            }
          </div>
          <div className="sm:w-3/4">{log?.log}</div>
        </div>
      </div>
    </div>
  )
}
