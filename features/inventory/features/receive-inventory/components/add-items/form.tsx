import InventoryItemForm from 'features/inventory/features/item-stock/components/stock-edit-dialog'
import { StockObject } from 'lib/types'
import { ChevronRight } from '@mui/icons-material'
import { useState } from 'react'
import { useAppStore } from 'lib/store'

export default function Form() {
  const { addReceiveBasketItem } = useAppStore()
  const defaultItem = { isNew: true, doListOnWebsite: true }
  const [item, setItem] = useState<StockObject>(defaultItem)
  return (
    <div>
      <div className="flex justify-end">
        <button
          onClick={() => addReceiveBasketItem(item)}
          disabled={Object.keys(item)?.length === 0}
          className="bg-col2-dark hover:bg-col2 disabled:bg-gray-200 p-2 rounded"
        >
          Add Item <ChevronRight />
        </button>
      </div>
      <InventoryItemForm item={item} setItem={setItem} />
    </div>
  )
}
