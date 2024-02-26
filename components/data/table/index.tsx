import { useMemo, useReducer, useState } from 'react'
import { PaginationState, SortingState, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { MemoizedTableBody, TableBody } from './body'
import { Pagination } from './pagination'
import { Header } from './header'

interface TableProps {
  color?: string
  colorLight?: string
  colorDark?: string
  data?: any[]
  columns?: any[]
  heading?: string
  onClickRow?: Function
  sortOptions?: any
  hiddenColumns?: string[]
  downloadCSV?: boolean
  // View options
  showFooter?: boolean
  showPagination?: boolean
  initPagination?: PaginationState
  onPaginationChange?: Function
  initSorting?: SortingState
  onSortingChange?: Function
  totalRowNum?: number
}

function Table({
  color,
  colorDark,
  data,
  columns,
  showFooter,
  showPagination,
  initPagination = { pageIndex: 0, pageSize: 10 },
  onPaginationChange,
  initSorting = [],
  onSortingChange,
  totalRowNum,
}: TableProps) {
  const rerender = useReducer(() => ({}), {})[1]
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>(initPagination)
  const [sorting, setSorting] = useState<SortingState>(initSorting)
  const [tableData, setTableData] = useState(data || [])
  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  )

  const table = useReactTable({
    columns,
    data: tableData,
    // debugAll: true,
    // defaultColumn: {
    //   minSize: 60,
    //   maxSize: 800,
    // },
    columnResizeMode: 'onChange',
    pageCount: Math.ceil(totalRowNum / pageSize) ?? -1,
    onPaginationChange: (e) => {
      console.log('pagination change', e)
      onPaginationChange && onPaginationChange(e)
      setPagination(e)
    },
    autoResetPageIndex: true,
    onSortingChange: (e) => {
      console.log('sorting change', e)
      onSortingChange && onSortingChange(e)
      setSorting(e)
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
    manualPagination: true,
    enableMultiRemove: true,
    enableMultiSort: true,
    state: { pagination, sorting },
    // meta: {
    //   updateData: (rowIndex: number, columnId: string, value: string) => {
    //     setTableData((old) =>
    //       old.map((row, index) => {
    //         if (index === rowIndex) {
    //           return {
    //             ...old[rowIndex],
    //             [columnId]: value,
    //           }
    //         }
    //         return row
    //       }),
    //     )
    //   },
    // },
  })

  const columnSizeVars = useMemo(() => {
    const headers = table.getFlatHeaders()
    const colSizes: { [key: string]: number } = {}
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i]!
      colSizes[`--header-${header.id}-size`] = header.getSize()
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize()
    }
    return colSizes
  }, [table.getState().columnSizingInfo])
  // Give our default column cell renderer editing superpowers!

  return (
    <div className="ml-1">
      <div className="overflow-x-scroll w-full">
        <table
          className="table-fixed w-full text-sm"
          {...{
            style: {
              ...columnSizeVars, //Define column sizes on the <table> element
              width: table.getTotalSize(),
            },
          }}
        >
          <Header table={table} color={color} colorDark={colorDark} />
          {/* When resizing any column we will render this special memoized version of our table body */}
          {table.getState().columnSizingInfo.isResizingColumn ? (
            <MemoizedTableBody table={table} showFooter={showFooter} />
          ) : (
            <TableBody table={table} showFooter={showFooter} />
          )}
        </table>
        {showPagination && <Pagination table={table} />}
      </div>
      <button onClick={() => rerender()} className="border p-2">
        Rerender
      </button>
    </div>
  )
}

export default Table
