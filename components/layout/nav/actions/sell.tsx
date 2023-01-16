import AddCashIcon from '@mui/icons-material/AttachMoney'
import TakeCashIcon from '@mui/icons-material/MoneyOff'
import CloseRegisterIcon from '@mui/icons-material/VpnKey'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'
import { useRouter } from 'next/router'

export default function SellNavActions() {
  const { openView } = useAppStore()
  const router = useRouter()

  return (
    <div className="flex">
      <button className="icon-text-button" onClick={() => openView(ViewProps.returnCashDialog)}>
        <AddCashIcon className="mr-1" />
        Add Cash
      </button>
      <button className="icon-text-button" onClick={() => openView(ViewProps.takeCashDialog)}>
        <TakeCashIcon className="mr-1" />
        Take Cash
      </button>
      <button className="icon-text-button" onClick={() => router.push('/register/close')}>
        <CloseRegisterIcon className="mr-1" />
        Close Register
      </button>
    </div>
  )
}
