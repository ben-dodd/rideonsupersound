import TableContainer from 'components/container/table'
import { useStockList } from 'lib/api/stock'
import { useVendors } from 'lib/api/vendor'
import List from './list'

export default function InventoryList() {
  // SWR
  const { inventory, isInventoryLoading } = useStockList()
  const { vendors, isVendorsLoading } = useVendors()

  // Todo add filters
  // Add view screen
  // Add quick edit option
  // Add download data options

  return (
    <TableContainer loading={isInventoryLoading || isVendorsLoading}>
      <List />
    </TableContainer>
  )
}
