import { useMemo } from 'react'
import { StockObject } from 'lib/types'
import TableContainer from 'components/container/table'
import Table from 'components/table'
import { mapInventoryItem } from '../../lib/functions'
import { useStockList } from 'lib/api/stock'
import { useVendors } from 'lib/api/vendor'

interface NumberProps {
  value: number
}

export default function InventoryTable() {
  const { inventory, isInventoryLoading } = useStockList()
  const { vendors, isVendorsLoading } = useVendors()

  // // Atoms
  // const [loadedItemId, setLoadedItemId] = useAtom(loadedItemIdAtom)

  // Constants
  const data = useMemo(
    () =>
      inventory
        ?.filter(
          (t: StockObject) => !t?.isDeleted && !t?.isGiftCard && !t?.isMiscItem
        )
        .map((t: StockObject) => mapInventoryItem(t, vendors)),
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
            onClick={
              () => null
              // setLoadedItemId({
              //   ...loadedItemId,
              //   inventory: params?.row?.original?.id,
              // })
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
