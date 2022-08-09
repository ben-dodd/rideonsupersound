// DB
import { useLogs, useVendors } from '@lib/database/read'
import { VendorObject } from '@lib/types'

// Functions

// Components
import CreateableSelect from '@components/inputs/createable-select'

// Icons
import { logCreateVendor } from '@features/log/lib/functions'
import { clerkAtom, receiveStockAtom } from '@lib/atoms'
import { createVendorInDatabase } from '@lib/database/create'
import { useAtom } from 'jotai'

export default function SelectVendor() {
  const [basket, setBasket] = useAtom(receiveStockAtom)
  const [clerk] = useAtom(clerkAtom)
  const { logs, mutateLogs } = useLogs()
  const { vendors } = useVendors()

  return (
    <div>
      <div className="font-bold text-xl mt-4">Select Vendor</div>
      <CreateableSelect
        inputLabel="Select vendor"
        fieldRequired
        value={basket?.vendor_id}
        label={
          vendors?.filter((v: VendorObject) => v?.id === basket?.vendor_id)[0]
            ?.name || ''
        }
        onChange={(vendorObject: any) => {
          setBasket({
            ...basket,
            vendor_id: parseInt(vendorObject?.value),
          })
        }}
        onCreateOption={async (vendorName: string) => {
          const vendorId = await createVendorInDatabase({ name: vendorName })
          logCreateVendor(clerk, vendorName, vendorId)
          setBasket({ ...basket, vendor_id: vendorId })
        }}
        options={vendors?.map((val: VendorObject) => ({
          value: val?.id,
          label: val?.name || '',
        }))}
      />
    </div>
  )
}
