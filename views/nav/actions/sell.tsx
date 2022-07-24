import { useAtom } from 'jotai'
import { clerkAtom, viewAtom } from 'lib/atoms'
// Material UI Icons
import AddCashIcon from '@mui/icons-material/AttachMoney'
import TakeCashIcon from '@mui/icons-material/MoneyOff'
import CloseRegisterIcon from '@mui/icons-material/VpnKey'
import { saveSystemLog } from 'lib/db-functions'

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
