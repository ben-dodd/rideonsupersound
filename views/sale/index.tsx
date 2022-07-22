// Packages
import { useAtom } from 'jotai'

// DB
import { loadedSaleIdAtom, pageAtom, tableModeAtom } from '@/lib/atoms'
import SaleList from 'features/display-sales/components/sale-list'
import SaleTable from 'features/display-sales/components/sale-table'
import SaleItemScreen from 'features/item-sale/components/sale-item-screen'

// Components

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
