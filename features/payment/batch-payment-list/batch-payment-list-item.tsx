import { AccountBalance, Delete } from '@mui/icons-material'
import dayjs from 'dayjs'
import { deleteVendorBatchPayment } from 'lib/api/vendor'
import { useAppStore } from 'lib/store'
import { dateTime } from 'lib/types/date'
import { priceCentsString } from 'lib/utils'
import { useRouter } from 'next/router'
import { useSWRConfig } from 'swr'

const BatchPaymentListItem = ({ batch }) => {
  const router = useRouter()
  const { openConfirm } = useAppStore()
  const { mutate } = useSWRConfig()
  const deleteBatchPayment = () => {
    openConfirm({
      open: true,
      title: 'Are you sure?',
      message: 'Are you sure you want to delete this batch payment and all associated transactions?',
      action: () => {
        deleteVendorBatchPayment(batch?.id)
        mutate(`vendor/payment/batch`)
        mutate(`vendor/payment`)
      },
    })
  }
  let categoryIcon = <AccountBalance className="text-blue-300" />
  return (
    <div className={`list-item-compact text-sm`}>
      <div className="flex w-full">
        <div className="w-1/12">{categoryIcon}</div>
        <div className="w-2/12 link-blue" onClick={() => router.push(`/payments/batch/${batch?.id}`)}>
          {`000000${batch?.id}`.slice(-6)}
        </div>
        <div className="w-2/12">{batch?.startedByClerkName ? `Started by ${batch?.startedByClerkName}` : ''}</div>
        <div className="w-3/12">
          {batch?.dateCompleted ? (
            dayjs(batch?.dateCompleted).format(dateTime)
          ) : (
            <span className="font-bold text-yellow-500">In Progress</span>
          )}
        </div>
        <div className="w-2/12">{`${batch?.totalNumVendors} VENDOR${batch?.totalNumVendors === 1 ? '' : 'S'}`}</div>
        <div className="w-1/12 text-right">{priceCentsString(batch?.totalPay)}</div>
        <div className="w-1/12 text-right">
          <button onClick={deleteBatchPayment}>
            <Delete className="hover:text-primary" />
          </button>
        </div>
      </div>
      <div />
    </div>
  )
}

export default BatchPaymentListItem
