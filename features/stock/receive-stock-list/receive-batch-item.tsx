import { useReceiveBatch } from 'lib/api/stock'
import { useState } from 'react'
import StockListItem from '../stock-list/stock-list-item'
import dayjs from 'dayjs'

const ReceiveBatchItem = ({ receiveBatchItem }) => {
  const { receiveBatch } = useReceiveBatch(receiveBatchItem?.id)
  console.log(receiveBatch)
  const [expanded, setExpanded] = useState(false)

  const toggleExpand = () => {
    setExpanded(!expanded)
  }

  const { batch = {}, stockMovements = [] } = receiveBatch || {}
  return (
    <div className="list-item-compact border-b">
      <div className="w-full">
        <div className="flex justify-between">
          <div className="text-lg font-bold">Batch ID {batch?.id}</div>
          <div>{dayjs(batch?.dateCompleted).format('D MMMM YYYY, h:mma')}</div>
        </div>
        {stockMovements?.map((stockMovement) => (
          <div key={stockMovement?.id} className="flex items-center">
            <div className="text-xl text-red-500 whitespace-nowrap">{stockMovement?.quantity} x</div>
            <StockListItem stockListItem={{ id: stockMovement?.stockId }} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReceiveBatchItem
