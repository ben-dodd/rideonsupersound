import { useMemo } from 'react'
import { StockItemSearchObject } from 'lib/types/stock'
import TableContainer from 'components/container/table'
import Table from 'components/table'
import { mapInventoryItem } from 'lib/functions/displayInventory'
import { useStockList } from 'lib/api/stock'
import { useVendors } from 'lib/api/vendor'
import { useRouter } from 'next/router'

interface NumberProps {
  value: number
}

export default function InventoryTable() {
  const { stockList, isStockListLoading } = useStockList()
  const { vendors, isVendorsLoading } = useVendors()
  const router = useRouter()

  const data = useMemo(
    () => stockList?.map?.((t: StockItemSearchObject) => mapInventoryItem(t, vendors)),
    [stockList, vendors],
  )
  const columns = useMemo(() => {
    // const openInventoryDialog = (item:any) => openInventoryModal(item?.row?.original?.id);
    return [
      {
        accessor: 'id',
        Header: 'ID',
        width: 70,
        Cell: (params: any) => (
          <span className="cursor-pointer underline" onClick={() => router.push(`/stock/${params?.value}`)}>
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
        Cell: ({ value }: NumberProps) => (value && !isNaN(value) ? `$${value?.toFixed(2)}` : '-'),
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
  }, [stockList])

  return (
    <TableContainer loading={isVendorsLoading || isStockListLoading}>
      <Table
        color="bg-col2"
        colorLight="bg-col2-light"
        colorDark="bg-col2-dark"
        data={data}
        columns={columns}
        heading={'Stock'}
        pageSize={20}
        sortOptions={[{ id: 'title', desc: false }]}
        downloadCSV={true}
      />
    </TableContainer>
  )
}
