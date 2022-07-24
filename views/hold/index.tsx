// Packages
import { useAtom } from 'jotai'

// DB
import CreateCustomerSidebar from '@/features/customer/components/sidebar'
import HoldTable from '@/features/display-holds/components/hold-table'
import HoldDialog from '@/features/hold/components/hold-dialog'
import SaleItemScreen from '@/features/item-sale/components/sale-item-screen'
import { loadedHoldIdAtom, loadedSaleIdAtom, pageAtom } from 'lib/atoms'

// Components

export default function HoldsPage() {
  // Atoms
  const [page] = useAtom(pageAtom)
  const [loadedHoldId] = useAtom(loadedHoldIdAtom)
  const [loadedSaleId] = useAtom(loadedSaleIdAtom)
  return (
    <div
      className={`flex relative overflow-x-hidden ${
        page !== 'holds' ? 'hidden' : ''
      }`}
    >
      {page === 'holds' && <HoldTable />}
      {loadedHoldId?.holds && <HoldDialog />}
      {loadedSaleId?.holds && <SaleItemScreen />}
      <CreateCustomerSidebar />
    </div>
  )
}
