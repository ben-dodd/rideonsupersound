import { Check, Close } from '@mui/icons-material'
import Table from 'components/data/table'
import { EditCell } from 'components/data/table/editCell'
import Loading from 'components/placeholders/loading'
import { useAllStockMovements, useStockList } from 'lib/api/stock'
import { getItemSku } from 'lib/functions/displayInventory'
import { getProfitMargin, getProfitMarginString } from 'lib/functions/pay'
import { filterInventory } from 'lib/functions/sell'
import { collateStockList } from 'lib/functions/stock'
import { useAppStore } from 'lib/store'
import { Pages } from 'lib/store/types'
import { priceCentsString } from 'lib/utils'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

const EditStockTable = () => {
  const router = useRouter()
  const {
    pages: {
      stockPage: {
        filter: { edit: filters },
        searchBar: { edit: searchBar },
      },
    },
    setPageFilter,
    setSearchBar,
  } = useAppStore()

  const { stockList = [], isStockListLoading = true } = useStockList()
  const { stockMovements = [], isStockMovementsLoading = true } = useAllStockMovements()
  const filteredStockList = stockList?.filter((stockItem) => filterInventory(stockItem, searchBar))

  const collatedStockList = useMemo(
    () => collateStockList(filteredStockList, stockMovements),
    [filteredStockList, stockMovements],
  )
  const [pagination, setPagination] = useState(filters?.pagination)
  const [sorting, setSorting] = useState(filters?.sorting)
  const [columnVisibility, setColumnVisibility] = useState(filters?.visibleColumns)
  const handleSearch = (e) => setSearchBar(Pages.stockPage, e.target.value, 'edit')

  // Handle sort, pagination and filter changes
  // Do not add filters or setFilters to dependencies
  useEffect(() => {
    setPageFilter(Pages.stockPage, { pagination, sorting }, 'edit')
  }, [pagination, setPageFilter, sorting])

  useEffect(() => {
    setPageFilter(Pages.stockPage, { visibleColumns: columnVisibility }, 'edit')
  }, [columnVisibility, setPageFilter])

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'Stock ID',
        cell: (info) => (
          <span className="link-blue" onClick={() => router.push(`/stock/${info.getValue()}`)}>
            {getItemSku(info.row?.original)}
          </span>
        ),
        size: 100,
        minSize: 1,
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
      { accessorKey: 'quantities.inStock', header: 'QTY', size: 60 },
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
      initColumnVisibility={filters?.visibleColumns}
      onColumnVisibilityChange={setColumnVisibility}
      searchValue={searchBar}
      handleSearch={handleSearch}
    />
  )
}

export default EditStockTable
