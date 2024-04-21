import { useMemo, useReducer, useState } from 'react'
import {
  PaginationState,
  SortingState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { MemoizedTableBody, TableBody } from './body'
import { Pagination } from './pagination'
import { Header } from './header'
import { ColumnSelect } from './columnSelect'
import { ViewColumn } from '@mui/icons-material'
import SearchInput from 'components/inputs/search-input'
import DropdownMenu from 'components/dropdown-menu'

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
  columnSelectable?: boolean
  showPagination?: boolean
  initPagination?: PaginationState
  onPaginationChange?: Function
  initSorting?: SortingState
  onSortingChange?: Function
  initColumnVisibility?: any
  onColumnVisibilityChange?: Function
  searchable?: boolean
  searchValue?: string
  handleSearch?: Function
}

function Table({
  color,
  colorDark,
  data,
  columns,
  showFooter,
  columnSelectable = true,
  showPagination,
  initPagination = { pageIndex: 0, pageSize: 10 },
  onPaginationChange,
  initSorting = [],
  onSortingChange,
  initColumnVisibility = {},
  onColumnVisibilityChange,
  searchable,
  searchValue,
  handleSearch,
}: TableProps) {
  const rerender = useReducer(() => ({}), {})[1]
  const [pagination, setPagination] = useState<PaginationState>(initPagination)
  const [sorting, setSorting] = useState<SortingState>(initSorting)
  const [columnVisibility, setColumnVisibility] = useState(initColumnVisibility)
  const [isColumnSelectOpen, setIsColumnSelectOpen] = useState(false)

  const table = useReactTable({
    columns,
    data,
    // debugAll: true,
    // defaultColumn: {
    //   minSize: 60,
    //   maxSize: 800,
    // },
    columnResizeMode: 'onChange',
    // pageCount: Math.ceil(totalRowNum / pageSize) ?? -1,
    onPaginationChange: (e) => {
      console.log('pagination change', e)
      onPaginationChange && onPaginationChange(e)
      setPagination(e)
    },
    autoResetPageIndex: false,
    onSortingChange: (e) => {
      // console.log('sorting change', e)
      onSortingChange && onSortingChange(e)
      setSorting(e)
    },
    onColumnVisibilityChange: (e) => {
      onColumnVisibilityChange && onColumnVisibilityChange(e)
      setColumnVisibility(e)
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // manualSorting: true,
    // manualPagination: true,
    enableMultiRemove: true,
    enableMultiSort: true,
    state: { pagination, sorting, columnVisibility },
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

  // <div className="rounded-md shadow-md flex overflow-hidden">
  //     {viewModes?.map((mode) => (
  //       <Tooltip key={mode.mode} title={mode.tooltip}>
  //         <div
  //           className={`${
  //             mode.mode === viewMode ? 'bg-blue-500 hover:bg-blue-400' : 'bg-gray-200 hover:bg-gray-300'
  //           } w-30 p-1 overflow-hidden cursor-pointer`}
  //           onClick={() => setViewMode(mode.mode)}
  //         >
  //           {mode.icon}
  //         </div>
  //       </Tooltip>
  //     ))}
  //   </div>

  return (
    <div className="ml-1">
      <div className="overflow-x-scroll w-full">
        <div className="px-2 flex justify-between align-center w-board">
          {searchable && <SearchInput searchValue={searchValue} handleSearch={handleSearch} />}
          {columnSelectable && (
            <div className="px-2 h-full">
              <DropdownMenu icon={<ViewColumn />} dark customMenu={<ColumnSelect table={table} />} />
            </div>
          )}
          {/* <StockFilter stockList={stockList} setSettings={setSetting} filterSettings={filterSettings} /> */}
        </div>
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
