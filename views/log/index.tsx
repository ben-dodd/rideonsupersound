import { useState } from 'react'
// Packages
import { useAtom } from 'jotai'

// DB
import Tabs from '@/components/navigation/tabs'
import { pageAtom } from '@/lib/atoms'
import { useLogs, useStockMovements } from '@/lib/swr-hooks'
import { LogObject, StockMovementObject } from '@/lib/types'
import ListLog from 'features/log/components/list-log'
import ListStockMovement from 'features/log/components/list-stock-movement'

// Components

export default function LogPage() {
  // SWR
  const { logs, isLogsLoading } = useLogs()
  const { stockMovements, isStockMovementsLoading } = useStockMovements(200)

  // Atoms
  const [page] = useAtom(pageAtom)
  const [tab, setTab] = useState(0)

  return (
    <div
      className={`flex flex-col overflow-x-hidden ${
        page !== 'logs' ? 'hidden' : ''
      }`}
    >
      <div className="bg-col9 text-4xl font-bold uppercase text-white p-2 mb-1">
        Logs
      </div>
      <Tabs tabs={['Logs', 'Stock Movement']} value={tab} onChange={setTab} />
      <div
        hidden={tab !== 0}
        className="h-menu w-full overflow-y-scroll px-2 bg-white"
      >
        {isLogsLoading ? (
          <div className="w-full flex h-full">
            <div className="loading-icon" />
          </div>
        ) : (
          logs?.map((log: LogObject) => <ListLog log={log} key={log?.id} />)
        )}
      </div>
      <div
        hidden={tab !== 1}
        className="h-menu w-full overflow-y-scroll px-2 bg-white"
      >
        {isStockMovementsLoading ? (
          <div className="w-full flex h-full">
            <div className="loading-icon" />
          </div>
        ) : (
          stockMovements?.map((sm: StockMovementObject) => (
            <ListStockMovement sm={sm} key={sm?.id} />
          ))
        )}
      </div>
    </div>
  )
}
