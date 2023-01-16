import dayjs from 'dayjs'
import { useCurrentRegister } from 'lib/api/register'
import CashList from './cash-list'
import CloseRegisterSidebar from './side-bar'
import Loading from 'components/loading'

export default function CloseRegisterScreen() {
  const { currentRegister, isCurrentRegisterLoading } = useCurrentRegister()
  const openedOn = dayjs(currentRegister?.openDate).format('H:mm A, D MMMM YYYY')
  const hasCashList = true
  return (
    <div className="flex items-start overflow-auto w-full h-main">
      {isCurrentRegisterLoading ? (
        <Loading />
      ) : (
        <>
          <div className="w-2/3">
            {hasCashList ? <CashList register={currentRegister} /> : <div>No cash changed.</div>}
          </div>
          <div className="w-1/3 h-main p-2 flex flex-col justify-between shadow-md">
            <CloseRegisterSidebar register={currentRegister} />
          </div>
        </>
      )}
    </div>
  )
}
