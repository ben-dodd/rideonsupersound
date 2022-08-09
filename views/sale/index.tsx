import SaleList from '@features/sale/features/display-sales/components/sale-list'
import SaleTable from '@features/sale/features/display-sales/components/sale-table'
import SaleItemScreen from '@features/sale/features/item-sale/components/sale-item-screen'
import { loadedSaleIdAtom, pageAtom, tableModeAtom } from '@lib/atoms'
import { useAtom } from 'jotai'

// REVIEW add filter buttons to table for laybys etc.

export default function SalesPage() {
  const [page] = useAtom(pageAtom)
  const [tableMode] = useAtom(tableModeAtom)
  const [loadedSaleId] = useAtom(loadedSaleIdAtom)
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
