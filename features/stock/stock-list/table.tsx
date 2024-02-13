import { PaginationState } from '@tanstack/react-table'
import Table from 'components/table'
import { useStockItemList } from 'lib/api/stock'
import { useVendors } from 'lib/api/vendor'
import { priceCentsString } from 'lib/utils'
import { useMemo, useState } from 'react'

const StockListTable = ({ idList }) => {
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
  const paginatedIdList = idList?.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize)

  const { stockItemList = [], isStockItemListLoading = true } = useStockItemList(paginatedIdList)
  const { vendors } = useVendors()
  const data = useMemo(
    () =>
      stockItemList?.map((stockItem) => {
        const { item = {}, price = {}, quantities = {} } = stockItem || {}
        // console.log(stockItem)
        const vendor = vendors?.find((vendor) => vendor?.id === item?.vendorId)
        return {
          id: item?.id,
          // sku: getItemSku(item),
          artist: item?.artist,
          title: item?.title,
          vendor: `[${item?.vendorId}] ${vendor?.name}`,
          section: item?.section,
          format: item?.format,
          sell: priceCentsString(price?.totalSell),
          qty: quantities?.inStock,
          qtyHoldLayby: quantities?.hold + quantities?.layby,
          qtySold: quantities?.sold,
        }
      }),
    [stockItemList, vendors],
  )

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'Stock ID',
        width: 100,
      },
      {
        accessorKey: 'title',
        header: 'Title',
        width: 300,
      },
      {
        accessorKey: 'artist',
        header: 'Artist',
        width: 190,
      },
      { accessorKey: 'vendor', header: 'Vendor', width: 180 },
      { accessorKey: 'section', header: 'Section', width: 100 },
      { accessorKey: 'format', header: 'Format', width: 100 },
      { accessorKey: 'sell', header: 'Sell', width: 80 },
      { accessorKey: 'qty', header: 'QTY', width: 60 },
      { accessorKey: 'qtyHoldLayby', header: 'H/L', width: 60 },
      { accessorKey: 'qtySold', header: 'SOLD', width: 60 },
    ],
    [],
  )
  // console.log(data)
  return (
    <Table
      columns={columns}
      data={data}
      showPagination
      onPaginationChange={setPagination}
      totalRowNum={idList?.length || 0}
    />
  )
}

export default StockListTable
