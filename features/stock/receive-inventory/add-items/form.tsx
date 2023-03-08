import { StockObject } from 'lib/types'
import { ChevronRight } from '@mui/icons-material'
import { useState } from 'react'
import { useAppStore } from 'lib/store'
import StockEditDialog from 'features/stock/stock-edit-dialog'

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
      <StockEditDialog item={item} setItem={setItem} />
    </div>
  )
}
