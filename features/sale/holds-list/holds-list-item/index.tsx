import { getItemSkuDisplayName } from 'lib/functions/displayInventory'
import { useAppStore } from 'lib/store'
import { Pages } from 'lib/store/types'
import { HoldObject } from 'lib/types/sale'

export default function HoldsListItem({ hold }: { hold: HoldObject }) {
  const { setPage } = useAppStore()
  const openHoldDialog = () => setPage(Pages.holdsPage, { loadedHoldId: hold?.id })
  return (
    <div className={`list-item-compact text-sm`} onClick={openHoldDialog}>
      <div className="w-1/2">{`${getItemSkuDisplayName(hold)}`}</div>
      {/* <div className="w-1/6">{`${dayjs(sale?.dateSaleOpened).format('D MMM YYYY, H:mmA')}`}</div>
      <div className="w-1/2">{`${sale?.itemList}`}</div>
      <div className="w-1/12">{`${clerkName}`}</div> */}
    </div>
  )
}
