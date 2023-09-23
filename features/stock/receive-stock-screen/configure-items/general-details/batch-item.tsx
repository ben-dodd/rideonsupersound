import { useAppStore } from 'lib/store'
import { useState } from 'react'

const GeneralDetailsBatchItem = ({ batchItem }) => {
  const { updateBatchReceiveItem } = useAppStore()
  const [expanded, setExpanded] = useState(false)
  return <div></div>
}

export default GeneralDetailsBatchItem
