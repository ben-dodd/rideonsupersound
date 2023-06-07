import dayjs from 'dayjs'
import { useCurrentRegister } from 'lib/api/register'
import CashList from './cash-list'
import SidebarContainer from 'components/container/side-bar'
import { dateTime } from 'lib/types/date'

export default function CloseRegisterSidebar() {
  const { currentRegister, isCurrentRegisterLoading } = useCurrentRegister()
  const openedOn = dayjs(currentRegister?.openDate).format(dateTime)
  const hasCashList = true
  return (
    <SidebarContainer title="CASH RECEIPTS" show>
      <div className="flex p-2 h-content overflow-y-scroll">
        <div className="p-2 flex flex-col justify-between">
          {hasCashList ? <CashList register={currentRegister} /> : <div>No cash changed.</div>}
        </div>
      </div>
    </SidebarContainer>
  )
}
