import { useAppStore } from 'lib/store'
import { useState } from 'react'
import TextField from 'components/inputs/text-field'
import { getItemDisplayName } from 'lib/functions/displayInventory'
import { StockReceiveObject } from 'lib/types/stock'

export default function Quantities() {
  const { batchReceiveSession, updateBatchReceiveItem } = useAppStore()
  const [bulkChange, setBulkChange] = useState(1)
  const handleBulkChange = (e) => {
    setBulkChange(e.target.value)
    batchReceiveSession?.batchList?.forEach((batchItem: StockReceiveObject) => {
      handleItemChange(batchItem?.key, e)
    })
  }
  const handleItemChange = (key, e) => {
    updateBatchReceiveItem(key, { quantity: parseInt(e?.target?.value) })
  }
  const itemCount = batchReceiveSession?.batchList
    ?.map((batchItem) => batchItem?.quantity)
    ?.reduce?.((acc, batchItemQuantity) => acc + (batchItemQuantity || 0), 0)
  return (
    <div className="w-full">
      <div className="w-full p-2 flex justify-between">
        <div className="font-bold">TOTAL ITEM COUNT</div>
        <div className="font-bold text-2xl">{itemCount}</div>
      </div>
      <div className="w-full border-b bg-green-300 p-2 flex justify-between">
        <div className="font-bold">BULK EDIT</div>
        <TextField
          valueNum={bulkChange}
          inputType="number"
          min={0}
          onChange={(e) => handleBulkChange(e)}
          inputLabel="QUANTITY"
        />
      </div>
      {batchReceiveSession?.batchList?.map((batchItem) => {
        return (
          <div key={batchItem?.key} className="w-full p-2 flex justify-between">
            <div className="font-bold">{getItemDisplayName(batchItem?.item)}</div>
            <TextField
              valueNum={batchItem?.quantity}
              inputType="number"
              min={0}
              onChange={(e) => handleItemChange(batchItem?.key, e)}
            />
          </div>
        )
      })}
    </div>
  )
}
