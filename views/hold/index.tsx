// Packages
import { useAtom } from 'jotai'

// DB
import {
  loadedHoldIdAtom,
  loadedSaleIdAtom,
  pageAtom,
  viewAtom,
} from '@/lib/atoms'
import CreateCustomerSidebar from 'features/customer/components/sidebar'
import HoldDialog from 'features/hold/components/hold-dialog'
import HoldTable from 'features/hold/components/hold-table'
import SaleItemScreen from 'features/item-sale/components/sale-item-screen'

// Components

export default function HoldsScreen() {
  // Atoms
  const [page] = useAtom(pageAtom)
  const [view] = useAtom(viewAtom)
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
