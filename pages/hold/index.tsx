import { useAtom } from 'jotai'

import CreateCustomerSidebar from 'features/customer/components/sidebar'
import HoldTable from 'features/sale/features/display-holds/components/hold-table'
import HoldDialog from 'features/sale/features/hold/components/hold-dialog'
import SaleItemScreen from 'features/sale/features/item-sale/components/sale-item-screen'
import { loadedHoldIdAtom, loadedSaleIdAtom, pageAtom } from 'lib/atoms'

export default function HoldsPage() {
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
