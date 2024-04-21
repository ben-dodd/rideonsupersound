import { useAppStore } from 'lib/store'
import SectionPanel from 'components/container/section-panel'
import { ListAlt } from '@mui/icons-material'
import dayjs from 'dayjs'
import { dateSimple } from 'lib/types/date'
import StockListItem from '../stock-list-item'

export default function ViewReceiveBatch() {
  const { batchReceiveSession } = useAppStore()
  // const { vendor, isVendorLoading } = useVendor(`${batchReceiveSession?.vendorId}`)

  return (
    <div>
      <div className="flex justify-between p-2">
        <div>
          <div className="text-2xl">{`RECEIVE BATCH #${`00000${batchReceiveSession?.id}`?.slice(-5)}`}</div>
          <div>{`${batchReceiveSession?.itemCount} item${
            batchReceiveSession?.itemCount === 1 ? '' : 's'
          } received from ${batchReceiveSession?.vendorName} by ${batchReceiveSession?.completedByClerkName} on ${dayjs(
            batchReceiveSession?.dateCompleted,
          ).format(dateSimple)}`}</div>
        </div>
        <div className="px-4"></div>
      </div>

      <SectionPanel icon={<ListAlt />} title="Items" collapsible={false}>
        {batchReceiveSession?.batchList?.map((receiveItem) => (
          <div key={receiveItem?.item?.id} className="flex items-center">
            <div className="text-xl text-red-500 whitespace-nowrap">{receiveItem?.quantity} x</div>
            <StockListItem stockListItem={receiveItem} />
          </div>
        ))}
      </SectionPanel>
    </div>
  )
}
