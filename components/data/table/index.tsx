import { useState } from 'react'
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
import TableActions from './table-actions'
import BackButton from 'components/button/back-button'
import DropdownMenu from 'components/dropdown-menu'
import { useMe } from 'lib/api/clerk'
import { isUserAdmin } from 'lib/functions/user'
import Loading from 'components/placeholders/loading'

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
  showFilters?: boolean
  showEdit?: boolean
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
  title?: string
  titleClass?: string
  menuItems?: any[]
  full?: boolean
  dark?: boolean
  showBackButton?: boolean
  isLoading?: boolean
}

function Table({
  color,
  colorDark,
  data,
  columns,
  showFooter,
  columnSelectable = false,
  showFilters = true,
  showEdit = false,
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
  title,
  titleClass,
  menuItems,
  full = true,
  dark = false,
  showBackButton = false,
  isLoading = false,
}: TableProps) {
  // const rerender = useReducer(() => ({}), {})[1]
  const [pagination, setPagination] = useState<PaginationState>(initPagination)
  const [sorting, setSorting] = useState<SortingState>(initSorting)
  const [columnVisibility, setColumnVisibility] = useState(initColumnVisibility)
  const [isColumnSelectOpen, setIsColumnSelectOpen] = useState(false)

  const adminOnlyMenu = menuItems?.filter((menuItem) => !menuItem?.adminOnly)?.length === 0
  const adminOnlyMenuTest = false
  const { me } = useMe()
  const isAdmin = isUserAdmin(me)

  const table = useReactTable({
    columns,
    data,
    // debugAll: true,
    // defaultColumn: {
    //   minSize: 5,
    //   maxSize: 500,
    // },
    // columnResizeMode: 'onChange',
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

  // const [showFilterBar, setShowFilterBar] = useState(false)
  // const toggleFilters = () => setShowFilterBar((filters) => !filters)

  const saveEdit = () => null
  const [openFilter, setOpenFilter] = useState(false)
  const openFilters = () => setOpenFilter(true)

  // const columnSizeVars = useMemo(() => {
  //   const headers = table.getFlatHeaders()
  //   const colSizes: { [key: string]: number } = {}
  //   for (let i = 0; i < headers.length; i++) {
  //     const header = headers[i]!
  //     colSizes[`--header-${header.id}-size`] = header.getSize()
  //     colSizes[`--col-${header.column.id}-size`] = header.column.getSize()
  //   }
  //   return colSizes
  // }, [table.getState().columnSizingInfo, table.getState().columnSizing])
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
    <div className={`h-main w-full ${full ? '' : 'sm:w-boardMainSmall lg:w-boardMain'}`}>
      {title && (
        <div
          className={`${titleClass} text-2xl font-bold uppercase p-2 flex justify-between items-center border-b h-header sticky z-30`}
        >
          <div className="flex items-center">
            {showBackButton && <BackButton dark={dark} />}
            {title}
          </div>
          <TableActions
            table={table}
            searchable={searchable}
            saveEdit={saveEdit}
            searchValue={searchValue}
            handleSearch={handleSearch}
            showFilters={showFilters}
            showEdit={showEdit}
            openFilters={openFilters}
          />
          {menuItems && (!adminOnlyMenuTest || adminOnlyMenu || isAdmin) ? (
            <DropdownMenu items={menuItems} dark={dark} />
          ) : (
            <div />
          )}
        </div>
      )}
      <div className="h-content overflow-y-scroll">
        <table className="w-full text-sm overflow-x-auto ml-1">
          <Header table={table} color={color} colorDark={colorDark} />
          {data?.length > 0 && !isLoading && (
            <>
              {/* When resizing any column we will render this special memoized version of our table body */}
              {table.getState().columnSizingInfo.isResizingColumn ? (
                <MemoizedTableBody table={table} showFooter={showFooter} />
              ) : (
                <TableBody table={table} showFooter={showFooter} />
              )}
            </>
          )}
        </table>
        {showPagination && data?.length > 0 && !isLoading && <Pagination table={table} />}
        {data?.length === 0 && <div className="p-2 font-bold">No Rows Found</div>}
        {isLoading && <Loading />}
      </div>
    </div>
  )
}

export default Table
