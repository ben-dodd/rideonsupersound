import { VendorObject } from 'lib/types'
import CreateableSelect from 'components/inputs/createable-select'
import { logCreateVendor } from 'features/log/lib/functions'
import { createVendorInDatabase } from 'lib/database/create'
import { useAppStore } from 'lib/store'
import { useClerk } from 'lib/api/clerk'
import { useVendors } from 'lib/api/vendor'

export default function SelectVendor() {
  const { receiveStock, setReceiveStock } = useAppStore()
  const { clerk } = useClerk()
  // const { logs, mutateLogs } = useLogs()
  const { vendors } = useVendors()

  return (
    <div>
      <div className="font-bold text-xl mt-4">Select Vendor</div>
      <CreateableSelect
        inputLabel="Select vendor"
        fieldRequired
        value={receiveStock?.vendor_id}
        label={
          vendors?.filter(
            (v: VendorObject) => v?.id === receiveStock?.vendor_id
          )[0]?.name || ''
        }
        onChange={(vendorObject: any) => {
          setReceiveStock({
            vendor_id: parseInt(vendorObject?.value),
          })
        }}
        onCreateOption={async (vendorName: string) => {
          const vendorId = await createVendorInDatabase({ name: vendorName })
          logCreateVendor(clerk, vendorName, vendorId)
          setReceiveStock({ vendor_id: vendorId })
        }}
        options={vendors?.map((val: VendorObject) => ({
          value: val?.id,
          label: val?.name || '',
        }))}
      />
    </div>
  )
}
