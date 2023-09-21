import { getItemSkuDisplayName } from 'lib/functions/displayInventory'
import { useStockList } from 'lib/api/stock'
import { useAppStore } from 'lib/store'
import { StockItemSearchObject } from 'lib/types/stock'
import Select from 'react-select'

export default function Vendor() {
  const { stockList } = useStockList()
  const { batchReceiveSession, addBatchReceiveItem } = useAppStore()
  const addItem = (item: any) => addBatchReceiveItem(item?.value)
  return (
    <div>
      <div className="helper-text mb-2">{`Add items already in the vendor's inventory.`}</div>
      <div className="h-dialog overflow-y-scroll">
        <Select
          className="w-full self-stretch"
          value={null}
          options={stockList
            ?.filter(
              (item: StockItemSearchObject) =>
                item?.vendorId === batchReceiveSession?.vendorId &&
                !batchReceiveSession?.batchList?.map((item) => item?.item?.id).includes(item?.id),
            )
            ?.map((item: StockItemSearchObject) => ({
              value: item,
              label: getItemSkuDisplayName(item),
            }))}
          onChange={addItem}
        />
      </div>
    </div>
  )
}
