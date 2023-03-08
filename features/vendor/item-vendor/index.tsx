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
  const { sales = [], payments = [], items = [] } = vendor || {}
  console.log(vendor)

  return (
    <MidScreenContainer title={`VENDOR ${vendor?.name}`} titleClass="bg-brown-dark text-white" showBackButton full dark>
      <div className="flex">
        <div className="w-1/4 px-2">
          <GeneralDetails vendor={vendor} />
        </div>
        <div className="w-3/4 px-2">
          <Tabs tabs={['Sales', 'Payments', 'Stock']} value={tab} onChange={setTab} />
          <div hidden={tab !== 0}>
            <VendorSales sales={sales} />
          </div>
          <div hidden={tab !== 1}>
            <VendorPayments payments={payments} />
          </div>
          <div hidden={tab !== 2}>
            <VendorItems items={items} />
          </div>
        </div>
      </div>
    </MidScreenContainer>
  )
}
