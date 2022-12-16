import SaleList from 'features/sale/features/display-sales/components/sale-list'
import SaleTable from 'features/sale/features/display-sales/components/sale-table'
import { useAppStore } from 'lib/store'

// REVIEW add filter buttons to table for laybys etc.

export default function SalesPage() {
  const { tableMode } = useAppStore()
  return (
    <div className={`flex relative overflow-x-hidden`}>
      {tableMode && <SaleTable />}
      {!tableMode && <SaleList />}
    </div>
  )
}
