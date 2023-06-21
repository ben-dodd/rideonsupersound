import { AccountBalance } from '@mui/icons-material'
import dayjs from 'dayjs'
import { dateTime } from 'lib/types/date'
import { priceCentsString } from 'lib/utils'
import { useRouter } from 'next/router'

const BatchPaymentListItem = ({ batch }) => {
  const router = useRouter()
  let categoryIcon = <AccountBalance className="text-blue-300" />
  return (
    <div className={`list-item-click text-sm`} onClick={() => router.push(`/payments/batch/${batch?.id}`)}>
      <div className="flex w-full">
        <div className="w-1/12">{categoryIcon}</div>
        <div className="w-2/12">{`000000${batch?.id}`.slice(-6)}</div>
        <div className="w-2/12">{batch?.startedByClerkName ? `Started by ${batch?.startedByClerkName}` : ''}</div>
        <div className="w-6/12">
          {batch?.dateCompleted ? dayjs(batch?.dateCompleted).format(dateTime) : 'In Progress'}
        </div>
        <div className="w-1/12 text-right">{priceCentsString(batch?.totalAmount)}</div>
      </div>
      <div />
    </div>
  )
}

export default BatchPaymentListItem
