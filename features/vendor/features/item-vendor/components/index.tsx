// Packages
import { useAtom } from 'jotai'
import { useEffect, useMemo, useState } from 'react'

// DB
import { loadedVendorIdAtom, pageAtom } from '@lib/atoms'
import {
  useClerks,
  useCustomers,
  useInventory,
  useSalesJoined,
  useVendorPayments,
  useVendors,
} from '@lib/database/read'
import { ModalButton, VendorObject } from '@lib/types'

// Components
import ScreenContainer from '@components/container/screen'
import Tabs from '@components/navigation/tabs'
import { getVendorDetails } from '@lib/data-functions'
import { saveVendorToDatabase, updateVendorInDatabase } from '@lib/db-functions'
import GeneralDetails from './general-details'
import VendorItems from './items'
import VendorPayments from './payments'
import VendorSales from './sales'

export default function VendorScreen() {
  // Atoms
  const [loadedVendorId, setLoadedVendorId] = useAtom(loadedVendorIdAtom)
  const [page] = useAtom(pageAtom)

  // SWR
  const { vendors, mutateVendors, isVendorsLoading } = useVendors()
  const { isClerksLoading } = useClerks()
  const { isCustomersLoading } = useCustomers()
  const { inventory, isInventoryLoading } = useInventory()
  const { sales, isSalesLoading } = useSalesJoined()
  const { vendorPayments, isVendorPaymentsLoading } = useVendorPayments()

  // State
  const [vendor, setVendor]: [VendorObject, Function] = useState({})
  const [tab, setTab] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // Load
  useEffect(() => {
    if (loadedVendorId[page] < 0) {
      // New vendor
      setVendor({})
    } else {
      setVendor(
        vendors?.filter((v: VendorObject) => v?.id === loadedVendorId[page])[0]
      )
    }
    setTab(0)
  }, [loadedVendorId[page]])

  // Constants
  const vendorDetails = useMemo(
    () =>
      getVendorDetails(inventory, sales, vendorPayments, loadedVendorId[page]),
    [inventory, sales, vendorPayments, loadedVendorId[page]]
  )

  const buttons: ModalButton[] = [
    {
      type: 'cancel',
      onClick: () => setLoadedVendorId({ ...loadedVendorId, [page]: 0 }),
      text: 'CLOSE',
    },
    {
      type: 'ok',
      disabled: isLoading,
      onClick: async () => {
        if (loadedVendorId[page] < 0) {
          setIsLoading(true)
          const newVendorId = await saveVendorToDatabase(vendor)
          mutateVendors([...vendors, { ...vendor, id: newVendorId }])
          setLoadedVendorId({ ...loadedVendorId, [page]: 0 })
          setVendor(null)
          setIsLoading(false)
        } else {
          let otherVendors = vendors?.filter(
            (i: VendorObject) => i?.id !== vendor?.id
          )
          mutateVendors([...otherVendors, vendor], false)
          updateVendorInDatabase(vendor)
          setLoadedVendorId({ ...loadedVendorId, [page]: 0 })
          setVendor(null)
        }
      },
      text: 'SAVE',
    },
  ]

  return (
    <ScreenContainer
      show={loadedVendorId[page]}
      closeFunction={() => setLoadedVendorId({ ...loadedVendorId, [page]: 0 })}
      title={loadedVendorId[page] < 0 ? 'New Vendor' : vendor?.name}
      loading={
        isSalesLoading ||
        isClerksLoading ||
        isVendorsLoading ||
        isCustomersLoading ||
        isInventoryLoading ||
        isVendorPaymentsLoading
      }
      buttons={buttons}
      titleClass="bg-col3"
    >
      <div className="flex flex-col w-full">
        <Tabs
          tabs={
            loadedVendorId[page] < 0
              ? ['General Details']
              : ['General Details', 'Items', 'Sales', 'Payments']
          }
          value={tab}
          onChange={setTab}
        />
        <div hidden={tab !== 0}>
          <GeneralDetails
            vendor={vendor}
            setVendor={setVendor}
            vendorDetails={vendorDetails}
          />
        </div>
        <div hidden={tab !== 1}>
          <VendorItems />
        </div>
        <div hidden={tab !== 2}>
          <VendorSales vendor={vendor} vendorDetails={vendorDetails} />
        </div>
        <div hidden={tab !== 3}>
          <VendorPayments vendor={vendor} />
        </div>
      </div>
    </ScreenContainer>
  )
}
