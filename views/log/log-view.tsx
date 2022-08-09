import ListLog from '@features/log/components/list-log'
import { useClerks, useLogs } from '@lib/database/read'
import { LogObject } from '@lib/types'

export function LogView() {
  const { clerks } = useClerks()
  const { logs, isLogsLoading } = useLogs()
  return isLogsLoading ? (
    <div className="w-full flex h-full">
      <div className="loading-icon" />
    </div>
  ) : (
    logs?.map((log: LogObject) => (
      <ListLog log={log} clerks={clerks} key={log?.id} />
    ))
  )
}
