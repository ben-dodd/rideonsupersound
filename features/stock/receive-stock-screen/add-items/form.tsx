import { ChevronRight } from '@mui/icons-material'
import { useState } from 'react'
import { useAppStore } from 'lib/store'
import StockEditDialog from 'features/stock/stock-edit-dialog'
import { StockItemObject } from 'lib/types/stock'

export default function Form() {
  const { addBatchReceiveSessionItem } = useAppStore()
  const defaultItem = { isNew: true, doListOnWebsite: true }
  const [item, setItem] = useState<StockItemObject>(defaultItem)
  return (
    <div>
      <div className="flex justify-end">
        <button
          onClick={() => addBatchReceiveSessionItem(item)}
          disabled={Object.keys(item)?.length === 0}
          className="bg-col2-dark hover:bg-col2 disabled:bg-gray-200 p-2 rounded"
        >
          Add Item <ChevronRight />
        </button>
      </div>
      <StockEditDialog stockItem={{ item }} />
    </div>
  )
}
