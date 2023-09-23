import { useAppStore } from 'lib/store'
import { getItemDisplayName } from 'lib/functions/displayInventory'
import { useMemo, useState } from 'react'
import StockEditForm from 'features/stock/stock-edit-dialog/form'
import { debounce } from 'lodash'

export default function AllDetails() {
  const { batchReceiveSession, updateBatchReceiveItemField } = useAppStore()
  const [selectedItem, setSelectedItem] = useState(null)
  const [index, setIndex] = useState(null)
  const handleChange = (e) => {
    console.log('Doing handleChange update', { [e?.target?.id]: e?.target?.value })
    updateBatchReceiveItemField(index, 'item', e.target.id, e.target.value)
  }
  console.log(selectedItem)
  const debouncedHandleChange = useMemo(() => debounce(handleChange, 2000), [])
  return (batchReceiveSession?.batchList?.map(batchItem => 
    <div key={batchItem?.key} className="flex">
      
    </div>
  )
}
