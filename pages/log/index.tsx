import Tabs from 'components/navigation/tabs'
import { pageAtom } from 'lib/atoms'
import { useAtom } from 'jotai'
import { useState } from 'react'
import { LogView } from './log-view'
import { StockMovementView } from './stock-movement-view'

export default function LogPage() {
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
        <LogView />
      </div>
      <div
        hidden={tab !== 1}
        className="h-menu w-full overflow-y-scroll px-2 bg-white"
      >
        <StockMovementView />
      </div>
    </div>
  )
}
