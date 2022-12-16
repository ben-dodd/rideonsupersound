import { saveSystemLog } from 'features/log/lib/functions'
import ReturnIcon from '@mui/icons-material/AssignmentReturn'
import ReceiveIcon from '@mui/icons-material/AssignmentReturned'
import PrintIcon from '@mui/icons-material/Print'
import { useClerk } from 'lib/api/clerk'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'

export default function InventoryActionButtons() {
  const { clerk } = useClerk()
  const { openView, closeView } = useAppStore()
  return (
    <div className="flex">
      <button
        className="icon-text-button"
        onClick={() => {
          saveSystemLog('Inventory Nav - Receive stock clicked.', clerk?.id)
          openView(ViewProps.receiveStockScreen)
          closeView(ViewProps.returnStockScreen)
        }}
      >
        <ReceiveIcon className="mr-1" />
        Receive Items
      </button>
      <button
        className="icon-text-button"
        onClick={() => {
          saveSystemLog('Inventory Nav - Return stock clicked.', clerk?.id)
          openView(ViewProps.returnStockScreen)
          closeView(ViewProps.receiveStockScreen)
        }}
      >
        <ReturnIcon className="mr-1" />
        Return Items
      </button>
      <button
        className="icon-text-button"
        onClick={() => {
          saveSystemLog('Inventory Nav - Print labels clicked.', clerk?.id)
          openView(ViewProps.labelPrintDialog)
        }}
      >
        <PrintIcon className="mr-1" />
        Print Labels
      </button>
    </div>
  )
}
