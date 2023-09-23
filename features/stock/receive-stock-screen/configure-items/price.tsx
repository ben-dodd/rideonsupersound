import { useAppStore } from 'lib/store'
import { useState } from 'react'
import { getItemDisplayName } from 'lib/functions/displayInventory'
import ChangePriceForm from 'features/stock/change-price-form'

export default function Price() {
  const { batchReceiveSession, updateBatchReceiveItemField } = useAppStore()
  const [bulkChange, setBulkChange] = useState({})
  const handleBulkChange = (e, field) => {
    setBulkChange({ ...bulkChange, [field]: e.target.value })
    batchReceiveSession?.batchList?.forEach((batchItem, index) => {
      handleItemChange(index, e, field)
    })
  }
  const handleItemChange = (index, e, field) => {
    updateBatchReceiveItemField(index, 'price', field, e.target.value)
  }
  return (
    <div className="w-full">
      <div className="w-full border-b bg-green-300 p-2">
        <div className="font-bold">BULK EDIT</div>
        <ChangePriceForm className="grid grid-cols-4 gap-2" obj={bulkChange} setObj={setBulkChange} />
      </div>
      {batchReceiveSession?.batchList?.map((batchItem, index) => {
        return (
          <div key={batchItem?.key} className="p-2">
            <div className="font-bold">{getItemDisplayName(batchItem?.item)}</div>
            <ChangePriceForm className="grid grid-cols-4 gap-2" obj={batchItem?.price} setObj={handleItemChange} />
          </div>
        )
      })}
    </div>
  )
}
