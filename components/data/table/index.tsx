import { useMemo, useState } from 'react'
import {
  PaginationState,
  RowSelectionState,
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
import IndeterminateCheckbox from 'components/inputs/indeterminate-check-box'

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
  selectable?: boolean
  setRowSelection?: any
  idField?: string
  onRowSelection?: Function
  initSelection?: any
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
  selectable = false,
  idField = 'id',
  onRowSelection,
  initSelection = {},
}: TableProps) {
  // const rerender = useReducer(() => ({}), {})[1]
  const [pagination, setPagination] = useState<PaginationState>(initPagination)
  const [sorting, setSorting] = useState<SortingState>(initSorting)
  const [columnVisibility, setColumnVisibility] = useState(initColumnVisibility)
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(initSelection)

  const [isColumnSelectOpen, setIsColumnSelectOpen] = useState(false)

  const adminOnlyMenu = menuItems?.filter((menuItem) => !menuItem?.adminOnly)?.length === 0
  const adminOnlyMenuTest = false
  const { me } = useMe()
  const isAdmin = isUserAdmin(me)

  const getColumns = () =>
    selectable
      ? [
          {
            id: 'select',
            header: ({ table }) =>
              isLoading ? (
                <div />
              ) : (
                <IndeterminateCheckbox
                  {...{
                    checked: table.getIsAllPageRowsSelected(),
                    indeterminate: table.getIsSomePageRowsSelected(),
                    onChange: table.getToggleAllPageRowsSelectedHandler(),
                  }}
                />
              ),
            cell: ({ row }) => (
              <div className="px-1">
                <IndeterminateCheckbox
                  {...{
                    checked: row.getIsSelected(),
                    disabled: !row.getCanSelect(),
                    indeterminate: row.getIsSomeSelected(),
                    onChange: row.getToggleSelectedHandler(),
                  }}
                />
              </div>
            ),
            size: 20,
          },
          ...columns,
        ]
      : columns

  const table = useReactTable({
    columns: getColumns(),
    data,
    // debugAll: true,
    defaultColumn: {
      minSize: 5,
      maxSize: 500,
    },
    columnResizeMode: 'onChange',
    // pageCount: Math.ceil(totalRowNum / pageSize) ?? -1,
    onPaginationChange: (e) => {
      // console.log('pagination change', e)
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
    onRowSelectionChange: (e) => {
      onRowSelection && onRowSelection(e)
      setRowSelection(e)
    },
    getRowId: (row) => row?.[idField],
    // manualSorting: true,
    // manualPagination: true,
    enableMultiRemove: true,
    enableMultiSort: true,
    enableRowSelection: true,
    state: { pagination, sorting, columnVisibility, rowSelection },
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
  console.log(rowSelection)

  const columnSizeVars = useMemo(() => {
    const headers = table.getFlatHeaders()
    const colSizes: { [key: string]: number } = {}
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i]!
      colSizes[`--header-${header.id}-size`] = header.getSize()
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize()
    }
    return colSizes
  }, [table.getState().columnSizingInfo, table.getState().columnSizing])

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
            showEdit={showEdit}
          />
          {menuItems && (!adminOnlyMenuTest || adminOnlyMenu || isAdmin) ? (
            <DropdownMenu items={menuItems} dark={dark} />
          ) : (
            <div />
          )}
        </div>
      )}
      <div className="h-content overflow-y-scroll">
        <table
          className="w-full text-sm overflow-x-auto ml-1"
          {...{
            style: {
              ...columnSizeVars, //Define column sizes on the <table> element
              width: table.getTotalSize(),
            },
          }}
        >
          <Header table={table} color={color} colorDark={colorDark} selectable={selectable} />
          {data?.length > 0 && !isLoading && (
            <>
              {/* When resizing any column we will render this special memoized version of our table body */}
              {table.getState().columnSizingInfo.isResizingColumn ? (
                <MemoizedTableBody table={table} showFooter={showFooter} selectable={selectable} />
              ) : (
                <TableBody table={table} showFooter={showFooter} selectable={selectable} />
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
