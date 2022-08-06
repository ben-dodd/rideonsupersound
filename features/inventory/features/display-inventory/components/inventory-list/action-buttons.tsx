import { useAtom } from 'jotai'
import { clerkAtom, viewAtom } from 'lib/atoms'

import { saveSystemLog } from '@/features/log/lib/functions'
import ReturnIcon from '@mui/icons-material/AssignmentReturn'
import ReceiveIcon from '@mui/icons-material/AssignmentReturned'
import PrintIcon from '@mui/icons-material/Print'

export default function InventoryActionButtons() {
  const [view, setView] = useAtom(viewAtom)
  const [clerk] = useAtom(clerkAtom)
  return (
    <div className="flex">
      <button
        className="icon-text-button"
        onClick={() => {
          saveSystemLog('Inventory Nav - Receive stock clicked.', clerk?.id)
          setView({
            ...view,
            receiveStockScreen: true,
            returnStockScreen: false,
          })
        }}
      >
        <ReceiveIcon className="mr-1" />
        Receive Items
      </button>
      <button
        className="icon-text-button"
        onClick={() => {
          saveSystemLog('Inventory Nav - Return stock clicked.', clerk?.id)
          setView({
            ...view,
            returnStockScreen: true,
            receiveStockScreen: false,
          })
        }}
      >
        <ReturnIcon className="mr-1" />
        Return Items
      </button>
      <button
        className="icon-text-button"
        onClick={() => {
          saveSystemLog('Inventory Nav - Print labels clicked.', clerk?.id)
          setView({ ...view, labelPrintDialog: true })
        }}
      >
        <PrintIcon className="mr-1" />
        Print Labels
      </button>
    </div>
  )
}
