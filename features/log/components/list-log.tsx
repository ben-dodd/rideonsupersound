import { ClerkObject, LogObject } from 'lib/types'

type ListItemProps = {
  log: LogObject
  clerks: ClerkObject[]
}

export default function ListLog({ log, clerks }: ListItemProps) {
  return (
    <div className="flex w-full border-b border-yellow-100 py-1 font-mono text-xs text-black">
      <div className="flex flex-col sm:flex-row w-full justify-between">
        <div className="flex flex-col sm:flex-row w-full">
          <div className="font-bold pr-4 text-pink-600 sm:1/6">
            {log?.dateCreated}
          </div>
          <div className="font-bold w-16 text-blue-800 sm:w-1/12">
            {clerks?.find((c: ClerkObject) => c?.id === log?.clerkId)?.name}
          </div>
          <div className="sm:w-3/4">{log?.log}</div>
        </div>
      </div>
    </div>
  )
}
