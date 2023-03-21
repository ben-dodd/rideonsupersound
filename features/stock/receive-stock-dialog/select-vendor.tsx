import { VendorObject } from 'lib/types/vendor'
import CreateableSelect from 'components/inputs/createable-select'
import { useAppStore } from 'lib/store'
import { useVendors, createVendor } from 'lib/api/vendor'

export default function SelectVendor() {
  const { receiveBasket, setReceiveBasket } = useAppStore()
  const { vendors, mutateVendors } = useVendors()

  return (
    <div>
      <div className="font-bold text-xl mt-4">Select Vendor</div>
      <CreateableSelect
        inputLabel="Select vendor"
        value={receiveBasket?.vendorId}
        label={vendors?.find((v: VendorObject) => v?.id === receiveBasket?.vendorId)?.name || ''}
        onChange={(vendorObject: any) => {
          setReceiveBasket({
            vendorId: parseInt(vendorObject?.value),
          })
        }}
        onCreateOption={async (vendorName: string) => {
          const vendorId = await createVendor({ name: vendorName })
          await mutateVendors()
          setReceiveBasket({ vendorId })
        }}
        options={vendors?.map((val: VendorObject) => ({
          value: val?.id,
          label: val?.name || '',
        }))}
      />
    </div>
  )
}
