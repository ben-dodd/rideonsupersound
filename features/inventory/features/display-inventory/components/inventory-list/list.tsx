import { useAtom } from 'jotai'

// DB
import { useInventory, useVendors } from 'lib/database/read'

// Components
import MidScreenContainer from '@/components/container/mid-screen'
import { compactModeAtom } from 'lib/atoms'
import { StockObject } from 'lib/types'
import { useMemo } from 'react'
import { mapInventoryItem } from '../../lib/functions'
import InventoryActionButtons from './action-buttons'
import CompactListItem from './compact-list-item'
import ListItem from './list-item'

export default function List() {
  // SWR
  const { inventory, isInventoryLoading } = useInventory()
  const { vendors, isVendorsLoading } = useVendors()
  const [compactMode] = useAtom(compactModeAtom)

  // Constants
  const data = useMemo(
    () =>
      inventory
        ?.filter(
          (t: StockObject) =>
            !t?.is_deleted && !t?.is_gift_card && !t?.is_misc_item
        )
        .map((t: StockObject) => mapInventoryItem(t, vendors)),
    [inventory, vendors]
  )

  return (
    <MidScreenContainer
      title={'Inventory'}
      titleClass={'bg-col2'}
      isLoading={isInventoryLoading || isVendorsLoading}
      actionButtons={<InventoryActionButtons />}
    >
      <div className="flex">
        <div>ARTIST</div>
      </div>
      <div>
        {inventory
          ?.filter((i) => i?.quantity > 0)
          ?.slice(0, 50)
          ?.map((i) =>
            compactMode ? (
              <CompactListItem key={i?.id} item={i} />
            ) : (
              <ListItem key={i?.id} item={i} />
            )
          )}
      </div>
    </MidScreenContainer>
  )
}
