import Table from 'components/table'
import { useStockItemList } from 'lib/api/stock'
import { useVendors } from 'lib/api/vendor'
import { useAppStore } from 'lib/store'
import { Pages } from 'lib/store/types'
import { priceCentsString } from 'lib/utils'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

const StockListTable = ({ idList }) => {
  const router = useRouter()
  const {
    stockPage: { pagination: storedPagination },
    setPage,
  } = useAppStore()
  console.log(storedPagination)
  const [{ pageIndex, pageSize }, setPagination] = useState(storedPagination)
  useEffect(() => {
    setPage(Pages.stockPage, { pagination: { pageIndex, pageSize } })
  }, [pageIndex, pageSize, setPage])
  const paginatedIdList = idList?.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize)

  const { stockItemList = [], isStockItemListLoading = true } = useStockItemList(paginatedIdList)
  const { vendors } = useVendors()
  const data = useMemo(
    () =>
      stockItemList?.map((stockItem) => {
        const { item = {}, price = {}, quantities = {} } = stockItem || {}
        // console.log(stockItem)
        const vendor = vendors?.find((vendor) => vendor?.id === item?.vendorId)
        return { ...item, ...price, ...quantities, vendorName: vendor?.name }
      }),
    [stockItemList, vendors],
  )

  console.log(data)

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'Stock ID',
        cell: (info) => (
          <span className="link-blue" onClick={() => router.push(`/stock/${info.getValue()}`)}>
            {info.getValue()}
          </span>
        ),
        size: 100,
      },
      {
        accessorKey: 'title',
        header: 'Title',
        size: 300,
      },
      {
        accessorKey: 'artist',
        header: 'Artist',
        size: 190,
      },
      {
        header: 'Vendor',
        cell: (info) => {
          const row = info?.row?.original
          return (
            <span className="link-blue" onClick={() => router.push(`/vendors/${row?.vendorId}`)}>
              {`[${row?.vendorId}] ${row?.vendorName}`}
            </span>
          )
        },
        size: 180,
      },
      { accessorKey: 'section', header: 'Section', size: 100 },
      { accessorKey: 'format', header: 'Format', size: 100 },
      {
        accessorKey: 'totalSell',
        header: 'Sell',
        cell: (info) => priceCentsString(info?.getValue()),
        size: 80,
        footer: (info) => {
          console.log(info)
          return 50
        },
      },
      { accessorKey: 'inStock', header: 'QTY', size: 60 },
      {
        header: 'H/L',
        cell: (info) => {
          const row = info?.row?.original
          return row?.hold || 0 + row?.layby || 0
        },
        size: 60,
      },
      { accessorKey: 'sold', header: 'SOLD', size: 60 },
    ],
    [],
  )
  // console.log(data)
  return (
    <Table
      columns={columns}
      data={data}
      showPagination
      initPagination={storedPagination}
      onPaginationChange={setPagination}
      totalRowNum={idList?.length || 0}
      showFooter
    />
  )
}

export default StockListTable
