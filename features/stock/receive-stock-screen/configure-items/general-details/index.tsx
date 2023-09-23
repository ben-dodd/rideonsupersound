import { useAppStore } from 'lib/store'
import GeneralDetailsBatchItem from './batch-item'

export default function GeneralDetails() {
  const { batchReceiveSession } = useAppStore()
  return (
    <div>
      {batchReceiveSession?.batchList?.map((batchItem) => (
        <GeneralDetailsBatchItem key={batchItem?.key} batchItem={batchItem} />
      ))}
    </div>
  )
}
