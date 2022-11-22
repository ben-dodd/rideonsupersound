import { saveSystemLog } from 'features/log/lib/functions'
import { clerkAtom, viewAtom } from 'lib/atoms'
import AddCashIcon from '@mui/icons-material/AttachMoney'
import TakeCashIcon from '@mui/icons-material/MoneyOff'
import CloseRegisterIcon from '@mui/icons-material/VpnKey'
import { useAtom } from 'jotai'

export default function SellNavActions() {
  const [view, setView] = useAtom(viewAtom)
  const [clerk] = useAtom(clerkAtom)

  return (
    <div className="flex">
      <button
        className="icon-text-button"
        onClick={() => {
          saveSystemLog('Sell Nav - Return Cash clicked.', clerk?.id)
          setView({ ...view, returnCashDialog: true })
        }}
      >
        <AddCashIcon className="mr-1" />
        Add Cash
      </button>
      <button
        className="icon-text-button"
        onClick={() => {
          saveSystemLog('Sell Nav - Take Cash clicked.', clerk?.id)
          setView({ ...view, takeCashDialog: true })
        }}
      >
        <TakeCashIcon className="mr-1" />
        Take Cash
      </button>
      <button
        className="icon-text-button"
        onClick={() => {
          saveSystemLog('Sell Nav - Close Register clicked.', clerk?.id)
          setView({ ...view, closeRegisterScreen: true })
        }}
      >
        <CloseRegisterIcon className="mr-1" />
        Close Register
      </button>
    </div>
  )
}
