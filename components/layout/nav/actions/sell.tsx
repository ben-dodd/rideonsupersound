import AddCashIcon from '@mui/icons-material/AttachMoney'
import TakeCashIcon from '@mui/icons-material/MoneyOff'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'

export default function SellNavActions() {
  const { openView } = useAppStore()

  return (
    <div className="flex">
      <button className="nav-action-button" onClick={() => openView(ViewProps.returnCashDialog)}>
        <AddCashIcon className="mr-1" />
        <div className="hidden lg:inline">Add Cash</div>
      </button>
      <button className="nav-action-button" onClick={() => openView(ViewProps.takeCashDialog)}>
        <TakeCashIcon className="mr-1" />
        <div className="hidden lg:inline">Take Cash</div>
      </button>
    </div>
  )
}
