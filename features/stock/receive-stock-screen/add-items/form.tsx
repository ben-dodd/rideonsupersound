import { ChevronRight } from '@mui/icons-material'
import { useState } from 'react'
import { useAppStore } from 'lib/store'
import { StockItemObject } from 'lib/types/stock'
import StockEditForm from 'features/stock/stock-edit-dialog/form'

export default function Form() {
  const { batchReceiveSession, addBatchReceiveItem } = useAppStore()
  const {
    cond = '',
    country = '',
    format = '',
    genre = [],
    isNew = false,
    media = '',
    section = '',
    totalSell = '',
    vendorCut = '',
    doListOnWebsite = true,
  } = batchReceiveSession || {}
  const defaultItem = {
    item: { cond, country, format, genre, isNew, media, section, doListOnWebsite },
    quantity: 1,
    price: { vendorCut, totalSell },
  }
  const [item, setItem] = useState<StockItemObject>(defaultItem?.item)
  return (
    <div>
      <div className="flex justify-end">
        <button
          onClick={() => addBatchReceiveItem({ ...defaultItem, item })}
          disabled={Object.keys(item)?.length === 0}
          className="bg-col2-dark hover:bg-col2 disabled:bg-gray-200 p-2 rounded"
        >
          Add Item <ChevronRight />
        </button>
      </div>
      <StockEditForm item={item} setItem={setItem} />
    </div>
  )
}
