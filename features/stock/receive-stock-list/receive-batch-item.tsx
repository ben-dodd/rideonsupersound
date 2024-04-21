import { useReceiveBatch } from 'lib/api/stock'
// import { useState } from 'react'
import dayjs from 'dayjs'
import { dateTime } from 'lib/types/date'
import { useRouter } from 'next/router'
import StockListItem from '../stock-list-item'

const ReceiveBatchItem = ({ receiveBatchItem }) => {
  const { receiveBatch, isReceiveBatchLoading } = useReceiveBatch(receiveBatchItem?.id)
  // const [expanded, setExpanded] = useState(false)
  const router = useRouter()

  const inProgress = !receiveBatch?.dateCompleted

  return isReceiveBatchLoading ? (
    <div />
  ) : (
    <div className="flex border-b py-4">
      <div className="w-full">
        <div className="flex justify-between">
          <div className="text-lg font-bold">
            <span
              className={inProgress ? 'link-red' : 'link-blue'}
              onClick={() => router.push(`/stock/receive/${receiveBatch?.id}`)}
            >
              {`Batch #${receiveBatch?.id}${inProgress ? ` (In Progress)` : ''}`}
            </span>
            {receiveBatch?.completedByClerkName || receiveBatch?.startedByClerkName
              ? ` - ${receiveBatch?.completedByClerkName || receiveBatch?.startedByClerkName}`
              : ''}
          </div>
          <div>{dayjs(receiveBatch?.dateCompleted || receiveBatch?.dateStarted).format(dateTime)}</div>
        </div>
        <div className="italic">{`${receiveBatch?.vendorName}${
          receiveBatch?.note ? ` - ${receiveBatch?.note}` : ''
        }`}</div>
        {receiveBatch?.batchList?.map((batchItem) => (
          <div key={`${receiveBatch?.id}${batchItem?.key}`} className="flex items-center">
            <div className="text-xl text-red-500 whitespace-nowrap mr-2">{batchItem?.quantity} x</div>
            <StockListItem stockListItem={batchItem} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReceiveBatchItem
