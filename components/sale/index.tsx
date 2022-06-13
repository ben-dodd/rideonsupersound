// Packages
import { useAtom } from 'jotai'

// DB
import { pageAtom, loadedSaleIdAtom, tableModeAtom } from '@/lib/atoms'

// Components
import SaleItemScreen from '@/components/sale-screen/sale-item-screen'
import SaleTable from '@/components/sale/sale-table'
import SaleList from './sale-list'

// REVIEW add filter buttons to table for laybys etc.

export default function SalesScreen() {
  // Atoms
  const [page] = useAtom(pageAtom)
  const [tableMode] = useAtom(tableModeAtom)
  const [loadedSaleId] = useAtom(loadedSaleIdAtom)

  // SWR
  return (
    <div
      className={`flex relative overflow-x-hidden ${
        page !== 'sales' ? 'hidden' : ''
      }`}
    >
      {page === 'sales' && tableMode && <SaleTable />}
      {page === 'sales' && !tableMode && <SaleList />}
      {loadedSaleId[page] && <SaleItemScreen />}
    </div>
  )
}
