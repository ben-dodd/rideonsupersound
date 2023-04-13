import { getItemSkuDisplayName } from 'lib/functions/displayInventory'
import { useAppStore } from 'lib/store'
import { Pages } from 'lib/store/types'
import { HoldObject } from 'lib/types/sale'
import dayjs from 'dayjs'

export default function HoldsListItem({ hold }: { hold: HoldObject }) {
  const { setPage } = useAppStore()
  const openHoldDialog = () => setPage(Pages.holdsPage, { loadedHold: hold?.id })
  const daysSinceHold = dayjs().diff(hold?.dateFrom, 'day')
  const overdue = daysSinceHold >= hold?.holdPeriod
  const nearOverdue = !overdue && daysSinceHold >= hold?.holdPeriod - 7
  const singleDay = Math.abs(daysSinceHold - hold?.holdPeriod) === 1
  return (
    <div className={`list-item-compact text-sm`} onClick={openHoldDialog}>
      <div className={`w-1/2`}>{`${getItemSkuDisplayName(hold)}`}</div>
      <div className="w-1/4">{`Held for ${hold?.customerName}`}</div>
      <div className={`w-1/4 ${nearOverdue ? 'text-yellow-700' : overdue ? 'text-red-700' : ''}`}>
        {overdue
          ? daysSinceHold === hold?.holdPeriod
            ? `Due Today`
            : `${daysSinceHold - hold?.holdPeriod} Day${singleDay ? '' : 's'} Overdue`
          : `${hold?.holdPeriod - daysSinceHold} Day${singleDay ? '' : 's'} Remaining`}
      </div>
    </div>
  )
}
