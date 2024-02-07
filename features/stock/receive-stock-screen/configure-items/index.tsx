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
import dynamic from 'next/dynamic'
import Loading from 'components/placeholders/loading'
import Tab from 'components/navigation/tabs/tab'
const AllDetails = dynamic(() => import('./all-details'), { loading: () => <Loading /> })
const QuickEdit = dynamic(() => import('./quick-edit'), { loading: () => <Loading /> })
const FormatSection = dynamic(() => import('./format-section'), { loading: () => <Loading /> })
const Condition = dynamic(() => import('./condition'), { loading: () => <Loading /> })
const Price = dynamic(() => import('./price'), { loading: () => <Loading /> })
const Quantities = dynamic(() => import('./quantities'), { loading: () => <Loading /> })

export default function ConfigureItems({ setStage, setBypassConfirmDialog }) {
  const [selectedTab, setSelectedTab] = useState(0)
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
        value={selectedTab}
        onChange={setSelectedTab}
      />
      <div className="flex w-full border-t pt-2">
        <Tab tab={0} selectedTab={selectedTab}>
          <AllDetails />
        </Tab>
        <Tab tab={1} selectedTab={selectedTab}>
          <QuickEdit />
        </Tab>
        <Tab tab={2} selectedTab={selectedTab}>
          <FormatSection />
        </Tab>
        <Tab tab={3} selectedTab={selectedTab}>
          <Condition />
        </Tab>
        <Tab tab={4} selectedTab={selectedTab}>
          <Price />
        </Tab>
        <Tab tab={5} selectedTab={selectedTab}>
          <Quantities />
        </Tab>
      </div>
    </div>
  )
}
