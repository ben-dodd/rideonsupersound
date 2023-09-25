import { useAppStore } from 'lib/store'
import { useMemo, useState } from 'react'
import { debounce } from 'lodash'
import ComingSoon from 'components/placeholders/coming-soon'

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
  return <ComingSoon />
  // <div className="w-full">
  //   {batchReceiveSession?.batchList?.map((batchItem) => {
  //     const { item = {} } = batchItem || {}
  //     return (
  //       <div key={batchItem?.key} className="list-item">
  //         {getItemDisplayName(item)}
  //       </div>
  //     )
  //   })}
  // </div>
}
