import Tabs from 'components/navigation/tabs'
import { useState } from 'react'
import Csv from './csv'
import Discogs from './discogs'
import Form from './form'
import Items from './items'
import Vendor from './vendor'
import { ArrowLeft, ArrowRight, Save } from '@mui/icons-material'
import { saveReceiveBatch } from 'lib/api/stock'
import { useAppStore } from 'lib/store'
import { useSWRConfig } from 'swr'
import { useRouter } from 'next/router'
import Clothing from './clothing'
import GoogleBooks from './googleBooks'

export default function AddReceiveItems({ setStage, setBypassConfirmDialog }) {
  const [mode, setMode] = useState(0)
  const { batchReceiveSession } = useAppStore()
  const { mutate } = useSWRConfig()
  const router = useRouter()

  return (
    <div className="w-full">
      <div className="flex justify-between p-2">
        <div className="text-2xl">ADD ITEMS</div>
        <div className="px-4">
          <div className="icon-text-button-highlight" onClick={() => setStage('add')}>
            REVIEW ITEMS <ArrowRight />
          </div>
          <div className="icon-text-button" onClick={() => setStage('setup')}>
            BACK TO SETUP <ArrowLeft />
          </div>
          <div
            className="icon-text-button"
            onClick={() => {
              saveReceiveBatch(batchReceiveSession).then((savedBatchPayment) => {
                mutate(`vendor/payment/batch/${savedBatchPayment?.id}`, savedBatchPayment)
                setBypassConfirmDialog(true)
                router.push('/stock')
              })
            }}
          >
            SAVE AND CLOSE <Save />
          </div>
        </div>
      </div>
      <Tabs
        tabs={[
          'Receive Existing Items',
          'Add New Items',
          'Clothing',
          'Search Discogs',
          'Search GoogleBooks',
          'CSV Import',
        ]}
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
            <Clothing />
          </div>
          <div hidden={mode !== 3}>
            <Discogs />
          </div>
          <div hidden={mode !== 4}>
            <GoogleBooks />
          </div>
          <div hidden={mode !== 5}>
            <Csv />
          </div>
        </div>
        <div className="w-2/5">
          <Items />
        </div>
      </div>
    </div>
  )
}
