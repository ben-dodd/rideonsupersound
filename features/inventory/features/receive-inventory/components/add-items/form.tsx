import InventoryItemForm from 'features/inventory/features/item-stock/components/stock-item-form'
import { receiveStockAtom } from 'lib/atoms'
import { StockObject } from 'lib/types'
import { ChevronRight } from '@mui/icons-material'
import { useAtom } from 'jotai'
import { useState } from 'react'
import { v4 as uuid } from 'uuid'

export default function Form() {
  // State
  const [basket, setBasket] = useAtom(receiveStockAtom)
  const defaultItem = { is_new: 1, do_list_on_website: 1 }
  const [item, setItem] = useState<StockObject>(defaultItem)
  const addItem = () => {
    setBasket({
      ...basket,
      items: basket?.items
        ? [...basket?.items, { key: uuid(), item }]
        : [{ key: uuid(), item }],
    })
    setItem(defaultItem)
  }
  return (
    <div>
      <div className="flex justify-end">
        <button
          onClick={addItem}
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
