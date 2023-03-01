import { useState } from 'react'
import { VendorObject } from 'lib/types'
import Tabs from 'components/navigation/tabs'
import GeneralDetails from './general-details'
import VendorItems from './items'
import VendorPayments from './payments'
import VendorSales from './sales'

export default function VendorScreen({ vendor }) {
  const [editVendor, setEditVendor]: [VendorObject, Function] = useState(vendor)
  const [tab, setTab] = useState(0)

  return (
    <div>
      <div className="flex flex-col w-full">
        <div className="flex w-full bg-brown-dark text-white justify-between p-2 h-nav">
          <div className="text-2xl font-bold">{`VENDOR ${vendor?.name}`}</div>
          {/* <div>
          <DropdownMenu items={menuItems} open={menuVisible} setOpen={setMenuVisible} />
          <button onClick={toggleMenu}>
            <Settings />
          </button>
        </div> */}
        </div>
        <div className="flex flex-col w-full h-content overflow-y-scroll px-2 pt-2">
          <Tabs tabs={['General Details', 'Items', 'Sales', 'Payments']} value={tab} onChange={setTab} />
          <div hidden={tab !== 0}>
            <GeneralDetails editVendor={editVendor} setEditVendor={setEditVendor} />
          </div>
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
    </div>
  )
}
