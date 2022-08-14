import { getItemSkuDisplayName } from '@features/inventory/features/display-inventory/lib/functions'
import { receiveStockAtom } from '@lib/atoms'
import { useInventory } from '@lib/database/read'
import { StockObject } from '@lib/types'
import { useAtom } from 'jotai'
import Select from 'react-select'
import { v4 as uuid } from 'uuid'

export default function Vendor() {
  const { inventory } = useInventory()
  const [basket, setBasket] = useAtom(receiveStockAtom)
  const addItem = (item: any) => {
    setBasket({
      ...basket,
      items: basket?.items
        ? [...basket?.items, { key: uuid(), item: item?.value }]
        : [{ key: uuid(), item: item?.value }],
    })
  }
  return (
    <div>
      <div className="helper-text mb-2">
        Add items already in the vendor's inventory.
      </div>
      <div className="h-dialog overflow-y-scroll">
        <Select
          className="w-full self-stretch"
          value={null}
          options={inventory
            ?.filter(
              (item: StockObject) =>
                item?.vendor_id === basket?.vendor_id &&
                !basket?.items?.map((item) => item?.item?.id).includes(item?.id)
            )
            ?.map((item: StockObject) => ({
              value: item,
              label: getItemSkuDisplayName(item),
            }))}
          onChange={addItem}
        />
      </div>
    </div>
  )
}
