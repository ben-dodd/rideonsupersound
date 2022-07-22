// Packages
import { useAtom } from 'jotai'

// DB
import { loadedSaleIdAtom, pageAtom } from '@/lib/atoms'
import SaleItemScreen from 'features/item-sale/components/sale-item-screen'
import LaybyTable from '../../features/display-laybys/components/layby-table'

// Components

// REVIEW add filter buttons to table for laybys etc.

export default function LaybyScreen() {
  // Atoms
  const [page] = useAtom(pageAtom)
  const [loadedSaleId] = useAtom(loadedSaleIdAtom)

  // SWR
  return (
    <div
      className={`flex relative overflow-x-hidden ${
        page !== 'laybys' ? 'hidden' : ''
      }`}
    >
      {' '}
      {page === 'laybys' && <LaybyTable />}
      {loadedSaleId[page] && <SaleItemScreen />}
    </div>
  )
}
