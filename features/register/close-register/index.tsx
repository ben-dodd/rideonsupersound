import MidScreenContainer from 'components/container/mid-screen'
import dayjs from 'dayjs'
import { useCurrentRegister } from 'lib/api/register'
import CashList from './cash-list'

export default function CloseRegisterScreen() {
  const { currentRegister, isCurrentRegisterLoading } = useCurrentRegister()
  const openedOn = dayjs(currentRegister?.openDate).format('H:mm A, D MMMM YYYY')
  const hasCashList = true
  return (
    <MidScreenContainer
      title={`Close Register #${currentRegister?.id}`}
      isLoading={isCurrentRegisterLoading}
      titleClass="bg-col1"
    >
      <div className="flex p-2">
        <div className="p-2 flex flex-col justify-between">
          {hasCashList ? <CashList register={currentRegister} /> : <div>No cash changed.</div>}
        </div>
      </div>
    </MidScreenContainer>
  )
}
