import { tableModeAtom } from '@lib/atoms'
import { useAtom } from 'jotai'

import TableIcon from '@mui/icons-material/TableView'

export default function SaleNavActions() {
  const [tableMode, setTableMode] = useAtom(tableModeAtom)
  return (
    <div className="flex">
      <button
        onClick={() => setTableMode(!tableMode)}
        className={`text-brown-dark hover:text-brown ${
          !tableMode && 'opacity-50'
        }`}
      >
        <TableIcon />
      </button>
    </div>
  )
}
