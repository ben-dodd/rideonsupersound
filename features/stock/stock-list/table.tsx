import Table from 'components/data/table'
import { EditCell } from 'components/data/table/editCell'
import dayjs from 'dayjs'
import { getItemSku } from 'lib/functions/displayInventory'
import { useAppStore } from 'lib/store'
import { Pages } from 'lib/store/types'
import { dateSlash } from 'lib/types/date'
import { priceCentsString } from 'lib/utils'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

const StockListTable = ({ data }) => {
  const router = useRouter()
  const {
    stockPage: { filters, visibleColumns },
    setPage,
  } = useAppStore()
  const [pagination, setPagination] = useState(filters?.pagination)
  const [sorting, setSorting] = useState(filters?.sorting)
  const [columnVisibility, setColumnVisibility] = useState(visibleColumns)

  // Handle sort, pagination and filter changes
  // Do not add filters or setFilters to dependencies
  useEffect(() => {
    const newFilters = { pagination, sorting }
    // onChangeFilters(newFilters)
    setPage(Pages.stockPage, { filters: newFilters })
    // const paginatedIdList = idList?.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize)
  }, [pagination, sorting])

  useEffect(() => {
    setPage(Pages.stockPage, { visibleColumns: columnVisibility })
  }, [columnVisibility])

  // useEffect(() => {
  //   console.log('changing new sorting', sorting)
  //   const newFilters = { ...filters, sorting }
  //   changeFilters(newFilters)
  //   setPage(Pages.stockPage, newFilters)
  // }, [sorting])

  // const paginatedIdList = idList?.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize)
  // const { stockItemList = [], isStockItemListLoading = true } = useStockItemList(paginatedIdList)
  // const { vendors } = useVendors()
  // const data = useMemo(
  //   () =>
  //     stockItemList?.map((stockItem) => {
  //       const { item = {}, price = {}, quantities = {} } = stockItem || {}
  //       // console.log(stockItem)
  //       const vendor = vendors?.find((vendor) => vendor?.id === item?.vendorId)
  //       return { ...item, ...price, ...quantities, vendorName: vendor?.name }
  //     }),
  //   [stockItemList, vendors],
  // )
  console.log(data)

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
            accessorKey: 'format',
            header: 'Format',
            size: 100,
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
            // footer: (info) => {
            //   console.log(info)
            //   return 50
            // },
          },
        ],
      },
      {
        header: 'Quantities',
        columns: [
          { accessorKey: 'quantities.inStock', header: 'QTY', size: 60 },
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
            accessorKey: 'lastMovements.modified',
            header: 'Last Modified',
            cell: (info) => dayjs(info?.getValue()).format(dateSlash),
            size: 120,
          },
        ],
      },
    ],
    [],
  )
  // console.log(data)
  return (
    <Table
      columns={columns}
      data={data}
      showPagination
      initPagination={filters?.pagination}
      onPaginationChange={setPagination}
      initSorting={filters?.sorting}
      onSortingChange={setSorting}
      initColumnVisibility={visibleColumns}
      onColumnVisibilityChange={setColumnVisibility}
    />
  )
}

export default StockListTable
