import TableIcon from '@mui/icons-material/TableView'
import CompactIcon from '@mui/icons-material/ViewCompact'
import { useAppStore } from 'lib/store'

export default function InventoryNavActions() {
  const { compactMode, tableMode, toggleTableMode, toggleCompactMode } =
    useAppStore()
  return (
    <div className="flex">
      <button
        onClick={toggleCompactMode}
        className={`text-brown-dark hover:text-brown mr-2 ${
          !compactMode && 'opacity-50'
        }`}
      >
        <CompactIcon />
      </button>
      <button
        onClick={toggleTableMode}
        className={`text-brown-dark hover:text-brown mr-2 ${
          !tableMode && 'opacity-50'
        }`}
      >
        <TableIcon />
      </button>
    </div>
  )
}
