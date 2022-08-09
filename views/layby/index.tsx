import SaleItemScreen from '@features/sale/features/item-sale/components/sale-item-screen'
import { loadedSaleIdAtom, pageAtom } from '@lib/atoms'
import { useAtom } from 'jotai'
import LaybyTable from '../../features/sale/features/display-laybys/components/layby-table'

// REVIEW add filter buttons to table for laybys etc.

export default function LaybyPage() {
  const [page] = useAtom(pageAtom)
  const [loadedSaleId] = useAtom(loadedSaleIdAtom)
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
