import { receiveStockAtom } from '@/lib/atoms'
import { getItemSkuDisplayName } from '@/lib/data-functions'
import { useInventory, useVendorStockByUid } from '@/lib/swr-hooks'
import { StockObject } from '@/lib/types'
import { useAtom } from 'jotai'
import Select from 'react-select'
import { v4 as uuid } from 'uuid'

export default function Vendor() {
  // const { inventory } = useInventory()
  const [basket, setBasket] = useAtom(receiveStockAtom)
  console.log(basket)
  const { vendorStock } = useVendorStockByUid(basket?.vendor_uuid)
  const addItem = (item: any) => {
    console.log(item?.value)
    const newItem = {
      key: uuid(),
      cond: item?.value?.cond || '',
      is_new: item?.value?.is_new || 0,
      total_sell: parseInt(item?.value?.total_sell) / 100 || '',
      vendor_cut: parseInt(item?.value?.vendor_cut) / 100 || '',
      quantity: '1',
      item: item?.value,
    }
    setBasket({
      ...basket,
      items: basket?.items ? [...basket?.items, newItem] : [newItem],
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
          options={vendorStock
            ?.filter(
              (item: StockObject) =>
                // item?.vendor_id === basket?.vendor_id &&
                !basket?.items?.map((item) => item?.item?.id).includes(item?.id)
            )
            ?.map((item: StockObject) => ({
              value: item,
              label: `${getItemSkuDisplayName(item)} [${item?.format}]`,
            }))}
          onChange={addItem}
        />
      </div>
    </div>
  )
}
