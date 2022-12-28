import { VendorObject } from 'lib/types'
import CreateableSelect from 'components/inputs/createable-select'
import { logCreateVendor } from 'lib/functions/log'
import { useAppStore } from 'lib/store'
import { useClerk } from 'lib/api/clerk'
import { useVendors } from 'lib/api/vendor'

export default function SelectVendor() {
  const { receiveBasket, setReceiveBasket } = useAppStore()
  const { clerk } = useClerk()
  // const { logs, mutateLogs } = useLogs()
  const { vendors } = useVendors()

  return (
    <div>
      <div className="font-bold text-xl mt-4">Select Vendor</div>
      <CreateableSelect
        inputLabel="Select vendor"
        fieldRequired
        value={receiveBasket?.vendorId}
        label={
          vendors?.find((v: VendorObject) => v?.id === receiveBasket?.vendorId)
            ?.name || ''
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