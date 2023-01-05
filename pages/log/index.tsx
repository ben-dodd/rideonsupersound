import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import Layout from 'components/layout'
import Tabs from 'components/navigation/tabs'
import { LogView } from 'features/log/log-view'
import { StockMovementView } from 'features/log/stock-movement-view'
import { useState } from 'react'

export default function LogPage() {
  const [tab, setTab] = useState(0)

  return (
    <div className={`flex flex-col overflow-x-hidden`}>
      <div className="bg-col9 text-4xl font-bold uppercase text-white p-2 mb-1">Logs</div>
      <Tabs tabs={['Logs', 'Stock Movement']} value={tab} onChange={setTab} />
      <div hidden={tab !== 0} className="h-main w-full overflow-y-scroll px-2 bg-white">
        <LogView />
      </div>
      <div hidden={tab !== 1} className="h-main w-full overflow-y-scroll px-2 bg-white">
        <StockMovementView />
      </div>
    </div>
  )
}

LogPage.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps = withPageAuthRequired()
