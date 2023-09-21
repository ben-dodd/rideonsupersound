import { useStockForVendor } from 'lib/api/stock'
import { getItemSkuDisplayName } from 'lib/functions/displayInventory'
import { useAppStore } from 'lib/store'
import { StockReceiveObject } from 'lib/types/stock'
import Select from 'react-select'

export default function Vendor() {
  const { batchReceiveSession, addBatchReceiveItem } = useAppStore()
  const { vendorStockList } = useStockForVendor(batchReceiveSession?.vendorId)
  console.log(vendorStockList)
  const addItem = (item: any) => {
    console.log(item)
    addBatchReceiveItem(item?.value)
  }
  return (
    <div>
      <div className="helper-text mb-2">{`Add items already in the vendor's inventory.`}</div>
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
