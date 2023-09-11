import Tabs from 'components/navigation/tabs'
import { useState } from 'react'
import Csv from './csv'
import Discogs from './discogs'
import Form from './form'
import Items from './items'
import Vendor from './vendor'

export default function SelectItems() {
  const [mode, setMode] = useState(0)

  return (
    <div className="w-full">
      <Tabs
        tabs={['Receive Existing Items', 'Add New Items', 'Search Discogs', 'Search GoogleBooks', 'CSV Import']}
        value={mode}
        onChange={setMode}
      />
      <div className="flex w-full border-t pt-2">
        <div className="w-3/5 mr-4">
          <div hidden={mode !== 0}>
            <Vendor />
          </div>
          <div hidden={mode !== 1}>
            <Form />
          </div>
          <div hidden={mode !== 2}>
            <Csv />
          </div>
          <div hidden={mode !== 3}>
            <Discogs />
          </div>
        </div>
        <div className="w-2/5">
          <Items />
        </div>
      </div>
    </div>
  )
}
