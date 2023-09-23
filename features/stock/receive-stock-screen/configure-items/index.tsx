import Tabs from 'components/navigation/tabs'
import { useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Bolt,
  BrokenImage,
  Category,
  Filter9Plus,
  Info,
  PriceChange,
  Save,
} from '@mui/icons-material'
import { saveReceiveBatch } from 'lib/api/stock'
import { useAppStore } from 'lib/store'
import { useSWRConfig } from 'swr'
import { useRouter } from 'next/router'
import AllDetails from './all-details'
import QuickEdit from './quick-edit'
import FormatSection from './format-section'
import Condition from './condition'
import Price from './price'
import Quantities from './quantities'

export default function ConfigureItems({ setStage, setBypassConfirmDialog }) {
  const [mode, setMode] = useState(0)
  const { batchReceiveSession } = useAppStore()
  const { mutate } = useSWRConfig()
  const router = useRouter()

  return (
    <div className="w-full">
      <div className="flex justify-between p-2">
        <div>
          <div className="text-2xl">CONFIGURE ITEMS</div>
          <div className="help-text max-w-50">
            <p>Use the options below to prices, quantities, and other details.</p>
            <p>
              Click <b>REVIEW ITEMS</b> to go to the final check.
            </p>
          </div>
        </div>
        <div className="px-4">
          <div className="icon-text-button-highlight" onClick={() => setStage('review')}>
            REVIEW ITEMS <ArrowRight />
          </div>
          <div className="icon-text-button" onClick={() => setStage('add')}>
            BACK TO ADD ITEMS <ArrowLeft />
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
        tabs={['Edit By Item', 'Quick Edit', 'Format/Section', 'Condition', 'Pricing', 'Quantities']}
        icons={[
          <Info key={0} />,
          <Bolt key={1} />,
          <Category key={3} />,
          // <TravelExplore key={2} />,
          <BrokenImage key={4} />,
          <PriceChange key={5} />,
          <Filter9Plus key={6} />,
        ]}
        value={mode}
        onChange={setMode}
      />
      <div className="flex w-full border-t pt-2">
        <div hidden={mode !== 0} className="w-full">
          <AllDetails />
        </div>
        <div hidden={mode !== 1} className="w-full">
          <QuickEdit />
        </div>
        <div hidden={mode !== 2} className="w-full">
          <FormatSection />
        </div>
        <div hidden={mode !== 3}>
          <Condition />
        </div>
        <div hidden={mode !== 4}>
          <Price />
        </div>
        <div hidden={mode !== 5}>
          <Quantities />
        </div>
      </div>
    </div>
  )
}
