import LoadMoreButton from 'components/button/load-more-button'
import ListLog from 'features/log/list-log'
import { useLogs } from 'lib/api/log'
import { LogObject } from 'lib/types'
import { useState } from 'react'

export function LogView() {
  const [limit, setLimit] = useState(50)
  const { logs, isLogsLoading } = useLogs(limit)
  return isLogsLoading ? (
    <div className="w-full flex h-full">
      <div className="loading-icon" />
    </div>
  ) : (
    <div className="px-2">
      {logs?.map((log: LogObject) => (
        <ListLog log={log} key={log?.id} />
      ))}
      <LoadMoreButton onClick={() => setLimit((limit) => limit + 50)} />
    </div>
  )
}
