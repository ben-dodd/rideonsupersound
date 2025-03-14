import { receiveStockAtom } from '@/lib/atoms'
import { StockObject } from '@/lib/types'
import { ChevronRight } from '@mui/icons-material'
import { useAtom } from 'jotai'
import { useState } from 'react'
import { v4 as uuid } from 'uuid'
import InventoryItemForm from '../inventory-item-form'

export default function Form() {
  // State
  const [basket, setBasket] = useAtom(receiveStockAtom)
  const defaultItem = { is_new: 1, do_list_on_website: 1 }
  const [item, setItem] = useState<StockObject>(defaultItem)
  const [clearForm, setClearForm] = useState(true)
  const toggleClearForm = () => setClearForm((clearForm) => !clearForm)
  const addItem = () => {
    setBasket({
      ...basket,
      items: basket?.items
        ? [...basket?.items, { key: uuid(), quantity: '1', item }]
        : [{ key: uuid(), item }],
    })
    if (clearForm) setItem(defaultItem)
  }
  return (
    <div>
      <div className="flex justify-end">
        <div className="flex col-span-2 items-center">
          <input
            type="checkbox"
            className="cursor-pointer"
            checked={!clearForm}
            onChange={toggleClearForm}
          />
          <div className="mx-2">
            Don't clear form
            <br />
            on add
          </div>
        </div>
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
