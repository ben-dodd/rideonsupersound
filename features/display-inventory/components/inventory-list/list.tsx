import { useAtom } from 'jotai'

// DB
import { useInventory, useVendors } from 'lib/database/read'

// Components
import MidScreenContainer from '@/components/container/mid-screen'
import { compactModeAtom } from 'lib/atoms'
import { StockObject, VendorObject } from 'lib/types'
import { useMemo } from 'react'
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
        .map((t: StockObject) => ({
          id: t?.id,
          title: t?.title || '-',
          artist: t?.artist || '-',
          vendor: `[${('000' + t?.vendor_id || '').slice(-3)}] ${
            vendors?.filter((v: VendorObject) => v?.id === t?.vendor_id)?.[0]
              ?.name
          }`,
          section: `${t?.section || ''}${
            t?.section && t?.country === 'New Zealand' ? '/' : ''
          }${t?.country === 'New Zealand' ? 'NZ' : ''}`,
          media: t?.media || '-',
          format: t?.format || '-',
          cost: t?.vendor_cut ? t?.vendor_cut / 100 : 0,
          store:
            t?.vendor_cut && t?.total_sell
              ? (t.total_sell - t.vendor_cut) / 100
              : 0,
          sell: t?.total_sell ? t?.total_sell / 100 : 0,
          profitMargin:
            t?.total_sell && t?.vendor_cut && t?.total_sell > 0
              ? ((t?.total_sell - t?.vendor_cut) / t?.total_sell) * 100
              : 0,
          quantity: t?.quantity || 0,
          quantityReceived: t?.quantity_received || 0,
          quantityHoldLayby:
            (t?.quantity_layby +
              t?.quantity_hold +
              t?.quantity_unlayby +
              t?.quantity_unhold) *
              -1 || 0,
          quantityReturned: Math.abs(t?.quantity_returned || 0),
          quantitySold: Math.abs(t?.quantity_sold || 0),
        })),
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
