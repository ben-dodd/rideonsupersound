import NewIcon from '@mui/icons-material/AddBox'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'

export default function CustomerNavActions() {
  const { openView } = useAppStore()
  return (
    <div className="flex">
      <button
        className="icon-text-button"
        onClick={() => openView(ViewProps.createCustomer)}
      >
        <NewIcon className="mr-1" />
        New Customer
      </button>
    </div>
  )
}
