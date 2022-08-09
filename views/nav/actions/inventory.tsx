import { compactModeAtom, tableModeAtom } from '@lib/atoms'
import { useAtom } from 'jotai'

import TableIcon from '@mui/icons-material/TableView'
import CompactIcon from '@mui/icons-material/ViewCompact'

export default function InventoryNavActions() {
  const [tableMode, setTableMode] = useAtom(tableModeAtom)
  const [compactMode, setCompactMode] = useAtom(compactModeAtom)
  return (
    <div className="flex">
      <button
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
      </button>
    </div>
  )
}
