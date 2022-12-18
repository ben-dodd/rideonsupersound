import { useState } from 'react'
import { ModalButton, VendorObject } from 'lib/types'
import ScreenContainer from 'components/container/screen'
import Tabs from 'components/navigation/tabs'
import GeneralDetails from './general-details'
import VendorItems from './items'
import VendorPayments from './payments'
import VendorSales from './sales'
import { updateVendor, useVendor } from 'lib/api/vendor'
import { useRouter } from 'next/router'

export default function VendorScreen() {
  const router = useRouter()
  const id = router.query
  const { vendor, isVendorLoading } = useVendor(id)
  const [editVendor, setEditVendor]: [VendorObject, Function] = useState(vendor)
  const [tab, setTab] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const buttons: ModalButton[] = [
    {
      type: 'cancel',
      onClick: () => router.back(),
      text: 'CLOSE',
    },
    {
      type: 'ok',
      disabled: isLoading,
      onClick: async () => updateVendor(editVendor, id),
      text: 'SAVE',
    },
  ]

  return (
    <ScreenContainer
      show={true}
      closeFunction={() => router.back()}
      title={vendor?.name}
      loading={isVendorLoading}
      buttons={buttons}
      titleClass="bg-col3"
    >
      <div className="flex flex-col w-full">
        <Tabs
          tabs={['General Details', 'Items', 'Sales', 'Payments']}
          value={tab}
          onChange={setTab}
        />
        <div hidden={tab !== 0}>
          <GeneralDetails
            editVendor={editVendor}
            setEditVendor={setEditVendor}
          />
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
    </ScreenContainer>
  )
}
