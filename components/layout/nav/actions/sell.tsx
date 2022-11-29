import { saveSystemLog } from 'features/log/lib/functions'
import AddCashIcon from '@mui/icons-material/AttachMoney'
import TakeCashIcon from '@mui/icons-material/MoneyOff'
import CloseRegisterIcon from '@mui/icons-material/VpnKey'
import { useClerk } from 'lib/api/clerk'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'

export default function SellNavActions() {
  const { clerk } = useClerk()
  const { openView } = useAppStore()

  return (
    <div className="flex">
      <button
        className="icon-text-button"
        onClick={() => {
          saveSystemLog('Sell Nav - Return Cash clicked.', clerk?.id)
          openView(ViewProps.returnCashDialog)
        }}
      >
        <AddCashIcon className="mr-1" />
        Add Cash
      </button>
      <button
        className="icon-text-button"
        onClick={() => {
          saveSystemLog('Sell Nav - Take Cash clicked.', clerk?.id)
          openView(ViewProps.takeCashDialog)
        }}
      >
        <TakeCashIcon className="mr-1" />
        Take Cash
      </button>
      <button
        className="icon-text-button"
        onClick={() => {
          saveSystemLog('Sell Nav - Close Register clicked.', clerk?.id)
          openView(ViewProps.closeRegisterScreen)
        }}
      >
        <CloseRegisterIcon className="mr-1" />
        Close Register
      </button>
    </div>
  )
}
