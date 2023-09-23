import { useAppStore } from 'lib/store'
import { getItemDisplayName } from 'lib/functions/displayInventory'
import { useState } from 'react'
import StockEditForm from 'features/stock/stock-edit-dialog/form'

export default function AllDetails() {
  const { batchReceiveSession, updateBatchReceiveItem } = useAppStore()
  const [selectedItemKey, setSelectedItemKey] = useState(null)
  const [item, setItem] = useState(
    batchReceiveSession?.batchList?.find((batchItem) => batchItem?.key === selectedItemKey) || {},
  )
  const handleSetItem = (newItem) => {
    setItem(newItem)
    updateBatchReceiveItem(selectedItemKey, { item: newItem })
  }
  return (
    <div className="flex">
      <div className="w-3/5">
        {selectedItemKey ? (
          <StockEditForm item={item} setItem={handleSetItem} />
        ) : (
          <div className="w-full h-full justify-center items-center">
            <div className="text-2xl w-50">Select an item to edit from the list on the right</div>
          </div>
        )}
      </div>
      <div className="w-2/5 ml-2 h-content overflow-y-scroll">
        {batchReceiveSession?.batchList?.map((batchItem, i) => (
          <div
            key={batchItem?.key}
            className={batchItem?.key === selectedItemKey ? 'list-item-selected' : 'list-item-click'}
            onClick={() => {
              // Save previously selected item
              if (selectedItemKey) {
                updateBatchReceiveItem(selectedItemKey, { item })
              }
              // Load clicked item
              setSelectedItemKey(batchItem?.key)
              setItem(batchItem?.item)
            }}
          >
            {getItemDisplayName(batchItem?.item)}
          </div>
        ))}
      </div>
    </div>
  )
}
