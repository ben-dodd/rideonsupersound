import { useState } from 'react'
import Tabs from 'components/navigation/tabs'
import VendorItems from './items'
import VendorPayments from './payments'
import VendorSales from './sales'
import { VendorObject } from 'lib/types/vendor'
import MidScreenContainer from 'components/container/mid-screen'
import GeneralDetails from './general-details'

export default function VendorScreen({ vendor }: { vendor: VendorObject }) {
  const [tab, setTab] = useState(0)
  console.log(vendor)

  return (
    <MidScreenContainer title={`VENDOR ${vendor?.name}`} titleClass="bg-brown-dark text-white" showBackButton full>
      <div className="flex">
        <div className="w-1/3 px-2">
          <GeneralDetails vendor={vendor} />
        </div>
        <div className="w-2/3">
          <Tabs tabs={['Items', 'Sales', 'Payments']} value={tab} onChange={setTab} />
          <div hidden={tab !== 1}>
            <VendorItems />
          </div>
          <div hidden={tab !== 2}>
            <VendorSales />
          </div>
          <div hidden={tab !== 3}>
            <VendorPayments />
          </div>
        </div>
      </div>
    </MidScreenContainer>
  )
}
