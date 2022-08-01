import {
  clerkAtom,
  compactModeAtom,
  tableModeAtom,
  viewAtom,
} from '@/lib/atoms'
import { useAtom } from 'jotai'

import { saveSystemLog } from '@/lib/db-functions'

import ReturnIcon from '@mui/icons-material/AssignmentReturn'
import ReceiveIcon from '@mui/icons-material/AssignmentReturned'
import PrintIcon from '@mui/icons-material/Print'

export default function InventoryNavActions() {
  const [tableMode, setTableMode] = useAtom(tableModeAtom)
  const [compactMode, setCompactMode] = useAtom(compactModeAtom)
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
      {/* <button
        onClick={() => setCompactMode(!compactMode)}
        className={`text-brown-dark hover:text-brown mr-2 ${
          !compactMode && 'opacity-50'
        }`}
      >
        <CompactIcon />
      </button>
      <button
        onClick={() => setTableMode(!tableMode)}
        className={`text-brown-dark hover:text-brown mr-2 ${
          !tableMode && 'opacity-50'
        }`}
      >
        <TableIcon />
      </button> */}
    </div>
  )
}
