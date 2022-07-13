// Packages
import { useMemo } from 'react'
import { useAtom } from 'jotai'

// DB
import { useInventory, useVendors } from '@/lib/swr-hooks'
import { loadedItemIdAtom } from '@/lib/atoms'
import { StockObject, VendorObject } from '@/lib/types'

// Functions
import { getItemSku } from '@/lib/data-functions'

// Components
import TableContainer from '@/components/_components/container/table'
import ListItem from './list-item'
import List from './list'
import InventoryActionButtons from './action-buttons'

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
