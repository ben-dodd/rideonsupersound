import { Check, Close } from '@mui/icons-material'
import Table from 'components/data/table'
import { EditCell } from 'components/data/table/editCell'
import Loading from 'components/placeholders/loading'
import dayjs from 'dayjs'
import { useAllStockMovements, useStockList } from 'lib/api/stock'
import { getItemSku } from 'lib/functions/displayInventory'
import { getProfitMargin, getProfitMarginString } from 'lib/functions/pay'
import { filterInventory } from 'lib/functions/sell'
import { collateStockList } from 'lib/functions/stock'
import { useAppStore } from 'lib/store'
import { Pages } from 'lib/store/types'
import { dateSlash } from 'lib/types/date'
import { priceCentsString } from 'lib/utils'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

const ViewStockTable = () => {
  const router = useRouter()
  const {
    stockPage: { filters, visibleColumns },
    setPage,
  } = useAppStore()

  const {
    stockPage: { searchBar, filters: storedFilters },
    setSearchBar,
  } = useAppStore()
  console.log(storedFilters)

  const { stockList = [], isStockListLoading = true } = useStockList()
  const { stockMovements = [], isStockMovementsLoading = true } = useAllStockMovements()
  const filteredStockList = stockList?.filter((stockItem) => filterInventory(stockItem, searchBar))

  const collatedStockList = useMemo(
    () => collateStockList(filteredStockList, stockMovements),
    [filteredStockList, stockMovements],
  )
  const [pagination, setPagination] = useState(filters?.pagination)
  const [sorting, setSorting] = useState(filters?.sorting)
  const [columnVisibility, setColumnVisibility] = useState(visibleColumns)
  const handleSearch = (e) => setSearchBar(Pages.stockPage, e.target.value)

  // Handle sort, pagination and filter changes
  // Do not add filters or setFilters to dependencies
  useEffect(() => {
    const newFilters = { pagination, sorting }
    setPage(Pages.stockPage, { filters: newFilters })
  }, [pagination, setPage, sorting])

  useEffect(() => {
    setPage(Pages.stockPage, { visibleColumns: columnVisibility })
  }, [columnVisibility, setPage])

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
          {
            accessorKey: 'title',
            header: 'Title',
            cell: EditCell,
            size: 300,
            sortDescFirst: false,
          },
          {
            accessorKey: 'artist',
            header: 'Artist',
            cell: EditCell,
            // meta: {
            //   type: 'date',
            // },
            size: 190,
            sortDescFirst: false,
          },
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
          {
            accessorKey: 'section',
            header: 'Section',
            // cell: EditCell,
            // meta: {
            //   type: 'select',
            //   options: [
            //     { value: 'NOI', label: 'Noise/Drone' },
            //     { value: 'EXP', label: 'Art Rock/Experimental' },
            //     { value: 'LOU', label: 'Lounge/Moog/Spaceage' },
            //   ],
            // },
            size: 100,
          },
          {
            accessorKey: 'media',
            header: 'Media',
            size: 100,
          },
          {
            accessorKey: 'format',
            header: 'Format',
            size: 100,
          },
          {
            accessorKey: 'genre',
            header: 'Genre',
            size: 100,
          },
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
            cell: (info) => priceCentsString(info?.getValue()),
            size: 80,
          },
          {
            accessorKey: 'vendorCut',
            header: 'Vendor Cut',
            cell: (info) => priceCentsString(info?.getValue()),
            size: 80,
          },
          {
            header: 'Store Cut',
            accessorKey: 'storeCut',
            cell: (info) => priceCentsString(info?.row?.original?.totalSell - info?.row?.original?.vendorCut),
            sortingFn: (rowA, rowB) =>
              rowA?.original?.totalSell -
              rowA?.original?.vendorCut -
              (rowB?.original?.totalSell - rowB?.original?.vendorCut),
            size: 80,
          },
          {
            header: 'Margin',
            accessorKey: 'margin',
            cell: (info) => getProfitMarginString(info?.row?.original),
            sortingFn: (rowA, rowB) => getProfitMargin(rowA?.original) - getProfitMargin(rowB?.original),
            size: 80,
          },
        ],
      },
      {
        header: 'Quantities',
        columns: [
          { accessorKey: 'quantities.inStock', header: 'QTY', size: 60 },
          { accessorKey: 'quantities.received', header: 'REC', size: 60 },
          { accessorKey: 'quantities.returned', header: 'RET', size: 60 },
          {
            accessorKey: 'quantities.holdLayby',
            header: 'H/L',
            size: 60,
          },
          {
            accessorKey: 'quantities.sold',
            header: 'SOLD',
            size: 60,
          },
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
          },
          {
            accessorKey: 'lastMovements.received',
            header: 'Last Received',
            cell: (info) => (info?.getValue() ? dayjs(info?.getValue()).format(dateSlash) : ''),
            size: 80,
          },
          {
            accessorKey: 'lastMovements.returned',
            header: 'Last Returned',
            cell: (info) => (info?.getValue() ? dayjs(info?.getValue()).format(dateSlash) : ''),
            size: 80,
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
  // console.log(data)
  return isStockListLoading || isStockMovementsLoading ? (
    <Loading />
  ) : (
    <Table
      columns={columns}
      data={collatedStockList}
      showPagination
      searchable
      initPagination={filters?.pagination}
      onPaginationChange={setPagination}
      initSorting={filters?.sorting}
      onSortingChange={setSorting}
      initColumnVisibility={visibleColumns}
      onColumnVisibilityChange={setColumnVisibility}
      searchValue={searchBar}
      handleSearch={handleSearch}
    />
  )
}

export default ViewStockTable
