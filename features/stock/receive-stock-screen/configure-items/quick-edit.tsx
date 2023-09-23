import { useAppStore } from 'lib/store'
import { getItemDisplayName } from 'lib/functions/displayInventory'
import { useMemo, useState } from 'react'
import { debounce } from 'lodash'

export default function QuickEdit() {
  const { batchReceiveSession, updateBatchReceiveItemField } = useAppStore()
  const [selectedItem, setSelectedItem] = useState(null)
  const [index, setIndex] = useState(null)
  const handleChange = (e) => {
    console.log('Doing handleChange update', { [e?.target?.id]: e?.target?.value })
    updateBatchReceiveItemField(index, 'item', e.target.id, e.target.value)
  }
  console.log(selectedItem)
  const debouncedHandleChange = useMemo(() => debounce(handleChange, 2000), [])
  return (
    <div className="w-full">
      {batchReceiveSession?.batchList?.map((batchItem) => {
        const { item = {} } = batchItem || {}
        return (
          <div key={batchItem?.key} className="list-item">
            {getItemDisplayName(item)}
          </div>
        )
      })}
    </div>
  )
}
