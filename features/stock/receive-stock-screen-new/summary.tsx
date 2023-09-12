import CreateableSelect from 'components/inputs/createable-select'
import { createVendor, useVendors } from 'lib/api/vendor'
import { useAppStore } from 'lib/store'
import { VendorObject } from 'lib/types/vendor'

const BatchReceiveSummary = () => {
  const { batchReceiveSession, setBatchReceiveSession } = useAppStore()
  const { vendors, mutateVendors } = useVendors()
  return (
    <div className="flex items-start">
      <div className="w-1/2">
        <div className="font-bold mt-4">Select Vendor</div>
        <CreateableSelect
          className="w-full"
          value={batchReceiveSession?.vendorId}
          label={vendors?.find((v: VendorObject) => v?.id === batchReceiveSession?.vendorId)?.name || ''}
          onChange={(vendorObject: any) => {
            setBatchReceiveSession({
              vendorId: parseInt(vendorObject?.value),
            })
          }}
          onCreateOption={async (vendorName: string) => {
            const vendorId = await createVendor({ name: vendorName })
            await mutateVendors()
            setBatchReceiveSession({ vendorId })
          }}
          options={vendors?.map((val: VendorObject) => ({
            value: val?.id,
            label: val?.name || '',
          }))}
        />
      </div>
      <div />
      {/* <div className="mx-2 w-full">
        <div className="text-red-400 text-2xl font-bold text-right">
          {paymentList?.filter((v) => isNaN(parseFloat(v?.payAmount)))?.length > 0
            ? `CHECK PAY ENTRIES`
            : `PAY ${priceCentsString(totalPay)}\nto ${totalNumVendors} VENDOR${totalNumVendors === 1 ? '' : 'S'}`}
        </div>
        <SearchInput searchValue={search} handleSearch={(e) => setSearch(e?.target?.value)} />
      </div> */}
    </div>
  )
}

export default BatchReceiveSummary
