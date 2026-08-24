import { Check, Close } from '@mui/icons-material'
import Table from 'components/data/table'
import Loading from 'components/placeholders/loading'
import dayjs from 'dayjs'
import { useStockListPaginated } from 'lib/api/stock'
import { getItemSku } from 'lib/functions/displayInventory'
import { getProfitMarginString } from 'lib/functions/pay'
import { useAppStore } from 'lib/store'
import { Pages } from 'lib/store/types'
import { dateSlash } from 'lib/types/date'
import { priceCentsString } from 'lib/utils'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'

const ViewStockTable = () => {
  const router = useRouter()
  const {
    pages: {
      stockPage: {
        filter: { list: filters },
        searchBar: { list: searchBar },
      },
    },
    setPageFilter,
    setSearchBar,
  } = useAppStore()

  const [pagination, setPagination] = useState(filters?.pagination || { pageIndex: 0, pageSize: 50 })
  const [sorting, setSorting] = useState(filters?.sorting || [{ id: 'dateModified', desc: true }])
  const [columnVisibility, setColumnVisibility] = useState(filters?.columnVisibility)

  const sortBy = sorting?.[0]?.id || 'dateModified'
  const sortDir = sorting?.[0]?.desc ? 'desc' : 'asc'

  const { stockPage, isStockPageLoading } = useStockListPaginated({
    page: pagination.pageIndex,
    pageSize: pagination.pageSize,
    sortBy,
    sortDir,
    search: searchBar || '',
  })

  const stockList = stockPage?.rows || []
  const totalCount = stockPage?.totalCount || 0
  const pageCount = Math.ceil(totalCount / pagination.pageSize)

  const handleSearch = (e) => setSearchBar(Pages.stockPage, e.target.value, 'list')

  const handlePaginationChange = (updater) => {
    const next = typeof updater === 'function' ? updater(pagination) : updater
    setPagination(next)
    setPageFilter(Pages.stockPage, { pagination: next }, 'list')
  }

  const handleSortingChange = (updater) => {
    const next = typeof updater === 'function' ? updater(sorting) : updater
    setSorting(next)
    setPageFilter(Pages.stockPage, { sorting: next }, 'list')
    // Reset to first page when sort changes
    setPagination((p) => ({ ...p, pageIndex: 0 }))
  }

  const handleColumnVisibilityChange = (updater) => {
    const next = typeof updater === 'function' ? updater(columnVisibility) : updater
    setColumnVisibility(next)
    setPageFilter(Pages.stockPage, { visibleColumns: next }, 'list')
  }

  const columns = useMemo(
    () => [
      {
        header: 'Details',
        columns: [
          {
            accessorKey: 'id',
            header: 'Stock ID',
            cell: (info) => (
              <span className="link-blue" onClick={() => router.push(`/stock/${info.getValue()}`)}>
                {getItemSku(info.row?.original)}
              </span>
            ),
            size: 100,
          },
          { accessorKey: 'title', header: 'Title', size: 300, sortDescFirst: false },
          { accessorKey: 'artist', header: 'Artist', size: 190, sortDescFirst: false },
          {
            header: 'Vendor',
            accessorKey: 'vendorName',
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
          { accessorKey: 'media', header: 'Media', size: 100 },
          { accessorKey: 'format', header: 'Format', size: 100 },
          { accessorKey: 'genre', header: 'Genre', size: 100 },
          {
            accessorKey: 'isNew',
            header: 'Is New?',
            size: 50,
            cell: (info) => (info?.getValue() ? <Check /> : <Close className="text-red-500" />),
          },
          { accessorKey: 'cond', header: 'Condition', size: 50 },
          {
            accessorKey: 'needsRestock',
            header: 'Needs Restock?',
            size: 50,
            cell: (info) => (info?.getValue() ? <Check /> : ''),
          },
        ],
      },
      {
        header: 'Prices',
        columns: [
          {
            accessorKey: 'totalSell',
            header: 'Sell',
            cell: (info) => <div className="text-blue-500">{priceCentsString(info?.getValue())}</div>,
            size: 80,
          },
          {
            accessorKey: 'vendorCut',
            header: 'Vendor Cut',
            cell: (info) => <div className="text-red-500">{priceCentsString(info?.getValue())}</div>,
            size: 80,
          },
          {
            header: 'Store Cut',
            accessorKey: 'storeCut',
            cell: (info) => (
              <div className="text-green-500">
                {priceCentsString(info?.row?.original?.totalSell - info?.row?.original?.vendorCut)}
              </div>
            ),
            enableSorting: false,
            size: 80,
          },
          {
            header: 'Margin',
            accessorKey: 'margin',
            cell: (info) => getProfitMarginString(info?.row?.original),
            enableSorting: false,
            size: 80,
          },
        ],
      },
      {
        header: 'Quantities',
        columns: [
          { accessorKey: 'quantities.inStock', header: 'QTY', size: 60, enableSorting: false },
          { accessorKey: 'quantities.received', header: 'REC', size: 60, enableSorting: false },
          { accessorKey: 'quantities.returned', header: 'RET', size: 60, enableSorting: false },
          { accessorKey: 'quantities.holdLayby', header: 'H/L', size: 60, enableSorting: false },
          { accessorKey: 'quantities.sold', header: 'SOLD', size: 60, enableSorting: false },
        ],
      },
      {
        header: 'Actions',
        columns: [
          {
            accessorKey: 'lastMovements.sold',
            header: 'Last Sold',
            cell: (info) => (info?.getValue() ? dayjs(info?.getValue()).format(dateSlash) : ''),
            size: 80,
            enableSorting: false,
          },
          {
            accessorKey: 'lastMovements.received',
            header: 'Last Received',
            cell: (info) => (info?.getValue() ? dayjs(info?.getValue()).format(dateSlash) : ''),
            size: 80,
            enableSorting: false,
          },
          {
            accessorKey: 'lastMovements.returned',
            header: 'Last Returned',
            cell: (info) => (info?.getValue() ? dayjs(info?.getValue()).format(dateSlash) : ''),
            size: 80,
            enableSorting: false,
          },
          {
            accessorKey: 'lastMovements.modified',
            header: 'Last Modified',
            cell: (info) => (info?.getValue() ? dayjs(info?.getValue()).format(dateSlash) : ''),
            size: 80,
          },
        ],
      },
    ],
    [],
  )

  return isStockPageLoading ? (
    <Loading />
  ) : (
    <Table
      columns={columns}
      data={stockList}
      showPagination
      searchable
      doServerSideFiltering
      pageCount={pageCount}
      initPagination={pagination}
      onPaginationChange={handlePaginationChange}
      initSorting={sorting}
      onSortingChange={handleSortingChange}
      initColumnVisibility={filters?.visibleColumns}
      onColumnVisibilityChange={handleColumnVisibilityChange}
      searchValue={searchBar}
      handleSearch={handleSearch}
    />
  )
}

export default ViewStockTable