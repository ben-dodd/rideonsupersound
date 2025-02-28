// DB
import { useLogs, useVendors } from '@/lib/swr-hooks'
import { VendorObject } from '@/lib/types'

// Functions

// Components
import CreateableSelect from '@/components/_components/inputs/createable-select'

// Icons
import { useAtom } from 'jotai'
import { clerkAtom, receiveStockAtom } from '@/lib/atoms'
import { saveLog, saveVendorToDatabase } from '@/lib/db-functions'

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
            vendor_uuid: vendorObject?.uuid,
          })
        }}
        onCreateOption={async (inputValue: string) => {
          const vendorId = await saveVendorToDatabase({ name: inputValue })
          saveLog(
            {
              log: `Vendor ${inputValue} (${vendorId}) created.`,
              clerk_id: clerk?.id,
            },
            logs,
            mutateLogs
          )
          setBasket({ ...basket, vendor_id: vendorId })
        }}
        options={vendors?.map((val: VendorObject) => ({
          value: val?.id,
          label: val?.name || '',
          uuid: val?.uid,
        }))}
      />
    </div>
  )
}
