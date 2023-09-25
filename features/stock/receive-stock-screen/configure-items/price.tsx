import { useAppStore } from 'lib/store'
import { useState } from 'react'
import { getItemDisplayName } from 'lib/functions/displayInventory'
import { getPriceSuggestionText } from 'lib/functions/discogs'

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
        <div className="grid grid-cols-5"></div>
      </div>
      {batchReceiveSession?.batchList?.map((batchItem, index) => {
        console.log(batchItem)
        return (
          <div key={batchItem?.key} className="p-2">
            <div className="font-bold">{getItemDisplayName(batchItem?.item)}</div>
            <div className="grid grid-cols-6 gap-2">
              <div className="col-span-2">
                {batchItem?.item?.discogsItem?.priceSuggestions ? (
                  <div className="bg-green-200 border p-2">
                    <div className="text-xs mt-2 mb-2">SUGGESTED DISCOGS PRICE</div>
                    <div className="font-bold">{getPriceSuggestionText(batchItem?.item)}</div>
                  </div>
                ) : (
                  <div />
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
