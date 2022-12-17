ay // Packages
import { useEffect, useMemo, useState } from 'react'
import { ModalButton, VendorObject } from 'lib/types'

// Components
import ScreenContainer from 'components/container/screen'
import Tabs from 'components/navigation/tabs'
import { getVendorDetails } from '../lib/functions'
import GeneralDetails from './general-details'
import VendorItems from './items'
import VendorPayments from './payments'
import VendorSales from './sales'
import { useVendors } from 'lib/api/vendor'
import { useClerks } from 'lib/api/clerk'
import { useCustomers } from 'lib/api/customer'
import { useStockList } from 'lib/api/stock'

export default function VendorScreen() {
  // Atoms
  // const [loadedVendorId, setLoadedVendorId] = useAtom(loadedVendorIdAtom)
  // const [page] = useAtom(pageAtom)

  // SWR
  const { vendors, mutateVendors, isVendorsLoading } = useVendors()
  const { isClerksLoading } = useClerks()
  const { isCustomersLoading } = useCustomers()
  const { inventory, isInventoryLoading } = useStockList()
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
        vendors?.find((v: VendorObject) => v?.id === loadedVendorId[page])
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
          const newVendorId = await createVendorInDatabase(vendor)
          setLoadedVendorId({ ...loadedVendorId, [page]: 0 })
          setVendor(null)
          setIsLoading(false)
        } else {
          let otherVendors = vendors?.filter(
            (i: VendorObject) => i?.id !== vendor?.id
          )
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
