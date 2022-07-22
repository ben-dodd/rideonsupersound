// Packages
import { useAtom } from 'jotai'
import { useMemo } from 'react'

// DB
import { loadedItemIdAtom } from '@/lib/atoms'
import { useInventory, useVendors } from '@/lib/swr-hooks'
import { StockObject, VendorObject } from '@/lib/types'

// Functions

// Components
import TableContainer from '@/components/container/table'
import Table from '@/components/table'

interface NumberProps {
  value: number
}

export default function InventoryTable() {
  // SWR
  const { inventory, isInventoryLoading } = useInventory()
  const { vendors, isVendorsLoading } = useVendors()

  // Atoms
  const [loadedItemId, setLoadedItemId] = useAtom(loadedItemIdAtom)

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
  const columns = useMemo(() => {
    // const openInventoryDialog = (item:any) => openInventoryModal(item?.row?.original?.id);
    return [
      {
        accessor: 'id',
        Header: 'ID',
        width: 70,
        Cell: (params: any) => (
          <span
            className="cursor-pointer underline"
            onClick={() =>
              setLoadedItemId({
                ...loadedItemId,
                inventory: params?.row?.original?.id,
              })
            }
          >
            {params?.value}
          </span>
        ),
      },
      {
        accessor: 'title',
        Header: 'Title',
        width: 250,
      },
      {
        accessor: 'artist',
        Header: 'Artist',
        width: 230,
      },
      {
        accessor: 'vendor',
        Header: 'Vendor',
        width: 210,
      },
      {
        accessor: 'section',
        Header: 'Section',
        width: 80,
      },
      // {
      //   accessor: "media",
      //   Header: "Media Type",
      //   width: 70,
      // },
      {
        accessor: 'format',
        Header: 'Format',
        width: 100,
      },
      {
        accessor: 'sell',
        Header: 'Sell',
        width: 90,
        Cell: ({ value }: NumberProps) =>
          value && !isNaN(value) ? `$${value?.toFixed(2)}` : '-',
      },
      // {
      //   accessor: "profitMargin",
      //   Header: "Margin",
      //   width: 80,
      //   Cell: ({ value }: NumberProps) =>
      //     value && !isNaN(value) ? `${value?.toFixed(1)}%` : "-",
      // },
      {
        accessor: 'quantity',
        Header: 'QTY',
        width: 53,
      },
      // {
      //   accessor: "quantityReceived",
      //   Header: "REC",
      //   width: 53,
      // },
      {
        accessor: 'quantityHoldLayby',
        Header: 'H/L',
        width: 53,
      },
      // {
      //   accessor: "quantityReturned",
      //   Header: "RET",
      //   width: 53,
      // },
      {
        accessor: 'quantitySold',
        Header: 'SOLD',
        width: 64,
      },
    ]
  }, [inventory])

  return (
    <TableContainer loading={isVendorsLoading || isInventoryLoading}>
      <Table
        color="bg-col2"
        colorLight="bg-col2-light"
        colorDark="bg-col2-dark"
        data={data}
        columns={columns}
        heading={'Inventory'}
        pageSize={20}
        sortOptions={[{ id: 'title', desc: false }]}
        downloadCSV={true}
      />
    </TableContainer>
  )
}
