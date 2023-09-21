import { useReceiveBatch } from 'lib/api/stock'
import { useState } from 'react'
import StockListItem from '../stock-list/stock-list-item'
import dayjs from 'dayjs'
import { dateTime } from 'lib/types/date'
import { useRouter } from 'next/router'

const ReceiveBatchItem = ({ receiveBatchItem }) => {
  const { receiveBatch } = useReceiveBatch(receiveBatchItem?.id)
  const [expanded, setExpanded] = useState(false)
  const router = useRouter()

  const toggleExpand = () => {
    setExpanded(!expanded)
  }

  return (
    <div className="flex border-b py-4">
      <div className="w-full">
        <div className="flex justify-between">
          <div className="text-lg font-bold">
            <span className="link-blue" onClick={() => router.push(`/stock/receive/${receiveBatch?.id}`)}>
              Batch ID {receiveBatch?.id}
            </span>
            {receiveBatch?.completedByClerkName ? ` - ${receiveBatch?.completedByClerkName}` : ''}
          </div>
          <div>{dayjs(receiveBatch?.dateCompleted).format(dateTime)}</div>
        </div>
        <div className="italic">{receiveBatch?.note}</div>
        {receiveBatch?.batchList?.map((batchItem) => (
          <div key={`${receiveBatch?.id}${batchItem?.key}`} className="flex items-center">
            <div className="text-xl text-red-500 whitespace-nowrap">{batchItem?.quantity} x</div>
            <StockListItem stockListItem={batchItem?.item} stockPrice={batchItem?.price} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReceiveBatchItem
