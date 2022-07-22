// Packages

// DB
import { useInventory, useVendors } from '@/lib/swr-hooks'

// Functions

// Components
import TableContainer from '@/components/container/table'
import List from './list'

export default function InventoryList() {
  // SWR
  const { inventory, isInventoryLoading } = useInventory()
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
