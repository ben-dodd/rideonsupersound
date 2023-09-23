import { useStockForVendor } from 'lib/api/stock'
import { getItemSkuDisplayName } from 'lib/functions/displayInventory'
import { useAppStore } from 'lib/store'
import { StockReceiveObject } from 'lib/types/stock'
import { useState } from 'react'
import Select from 'react-select'

export default function Vendor() {
  const { batchReceiveSession, addBatchReceiveItem } = useAppStore()
  const { vendorStockList } = useStockForVendor(batchReceiveSession?.vendorId)
  const [duplicateItem, setDuplicateItem] = useState(false)
  console.log(duplicateItem)
  const addItem = (item: any) => {
    const newItem = item?.value
    if (duplicateItem) {
      console.log(newItem)
      delete newItem?.item?.id
    }
    addBatchReceiveItem(newItem)
  }
  return (
    <div>
      <div className="helper-text mb-2">{`Add items already in the vendor's inventory.`}</div>

      <div className="flex items-center py-4">
        <input
          type="checkbox"
          className="cursor-pointer"
          checked={duplicateItem}
          onChange={(e) => setDuplicateItem(e.target.checked ? true : false)}
        />
        <div className="ml-4 text-sm">
          <div className="font-bold">Duplicate Vendor Item</div>
          <div className="italic">
            Use this if you want to add a different price or condition to the other items like this in stock
          </div>
        </div>
      </div>
      <div className="h-dialog overflow-y-scroll">
        <Select
          className="w-full self-stretch"
          value={null}
          options={vendorStockList
            ?.filter(
              (vendorItem: StockReceiveObject) =>
                !batchReceiveSession?.batchList?.map((batchItem) => batchItem?.item?.id).includes(vendorItem?.item?.id),
            )
            ?.map((vendorItem: StockReceiveObject) => ({
              value: vendorItem,
              label: getItemSkuDisplayName(vendorItem?.item),
            }))}
          onChange={addItem}
        />
      </div>
    </div>
  )
}
