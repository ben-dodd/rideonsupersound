import { useState } from 'react'
// Packages
import { useAtom } from 'jotai'

// DB
import Tabs from 'components/navigation/tabs'
import ListLog from 'features/log/components/list-log'
import ListStockMovement from 'features/log/components/list-stock-movement'
import { pageAtom } from 'lib/atoms'
import {
  useClerks,
  useLogs,
  useStockDisplayMin,
  useStockMovements,
} from 'lib/database/read'
import { LogObject, StockMovementObject } from 'lib/types'

// Components

export default function LogPage() {
  // SWR
  const { logs, isLogsLoading } = useLogs()
  const { clerks } = useClerks()
  const { stockMovements, isStockMovementsLoading } = useStockMovements(200)
  const { stockDisplay } = useStockDisplayMin()

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
          logs?.map((log: LogObject) => (
            <ListLog log={log} clerks={clerks} key={log?.id} />
          ))
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
            <ListStockMovement
              sm={sm}
              clerks={clerks}
              stockDisplay={stockDisplay}
              key={sm?.id}
            />
          ))
        )}
      </div>
    </div>
  )
}
