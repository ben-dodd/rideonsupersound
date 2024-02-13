import { memo, useMemo, useReducer, useState } from 'react'
import { PaginationState, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

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
  totalRowNum,
}: TableProps) {
  const rerender = useReducer(() => ({}), {})[1]
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>(initPagination)
  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  )

  const table = useReactTable({
    columns,
    data,
    defaultColumn: {
      minSize: 60,
      maxSize: 800,
    },
    columnResizeMode: 'onChange',
    pageCount: Math.ceil(totalRowNum / pageSize) ?? -1,
    onPaginationChange: (e) => {
      onPaginationChange && onPaginationChange(e)
      setPagination(e)
    },
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    state: { pagination },
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
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

  return (
    <div className="ml-1">
      <div className="overflow-x-scroll w-full">
        <table
          className="table-auto w-full text-sm"
          {...{
            style: {
              ...columnSizeVars, //Define column sizes on the <table> element
              width: table.getTotalSize(),
            },
          }}
        >
          <thead className="sticky">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    {...{
                      className: `border border-white select-none h-6 ${
                        color ? `${color} hover:${colorDark}` : 'bg-gray-200 hover:bg-gray-400'
                      } text-left px-2 truncate`,
                      style: {
                        width: `calc(var(--header-${header?.id}-size) * 1px)`,
                      },
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <div>{flexRender(header.column.columnDef.header, header.getContext())}</div>
                    )}
                    <div
                      {...{
                        onDoubleClick: () => header.column.resetSize(),
                        onMouseDown: header.getResizeHandler(),
                        onTouchStart: header.getResizeHandler(),
                        className: `resizer ${header.column.getIsResizing() ? 'isResizing' : ''}`,
                      }}
                    />
                    {/* <div {...column.getSortByToggleProps()} className="flex justify-between">
                      <div>{column.render('Header')}</div>
                      <div>
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <div className="ml-1">
                              <ArrowDropDown />
                            </div>
                          ) : (
                            <div className="ml-1">
                              <ArrowDropUp />
                            </div>
                          )
                        ) : (
                          <div />
                        )}
                      </div>
                    </div> */}
                    {/* <div
                      className={`inline-block w-1 z-10 h-full absolute right-0 top-0 translate-x-1/2 cursor-resize bg-white`}
                      {...column.getResizerProps()}
                    /> */}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          {/* When resizing any column we will render this special memoized version of our table body */}
          {table.getState().columnSizingInfo.isResizingColumn ? (
            <MemoizedTableBody table={table} showFooter={showFooter} />
          ) : (
            <TableBody table={table} showFooter={showFooter} />
          )}
        </table>
        {showPagination && (
          <div className="flex items-center gap-2">
            <button
              className="border rounded p-1"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              {'<<'}
            </button>
            <button
              className="border rounded p-1"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {'<'}
            </button>
            <button className="border rounded p-1" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              {'>'}
            </button>
            <button
              className="border rounded p-1"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              {'>>'}
            </button>
            <span className="flex items-center gap-1">
              <div>Page</div>
              <strong>
                {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </strong>
            </span>
            <span className="flex items-center gap-1">
              | Go to page:
              <input
                type="number"
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0
                  table.setPageIndex(page)
                }}
                className="border p-1 rounded w-16"
              />
            </span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value))
              }}
            >
              {[10, 30, 50, 100, 200, 500, 1000].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <button onClick={() => rerender()} className="border p-2">
        Rerender
      </button>
    </div>
  )
}

const TableBody = ({ table, showFooter }) => (
  <>
    <tbody>
      {table.getRowModel().rows.map((row) => {
        // console.log(row.getVisibleCells())
        return (
          <tr
            key={row.id}
            className="bg-gray-100 opacity-70 hover:opacity-100 mt-1"
            // className={`${
            //   row?.cells[2]?.value === SaleStateTypes.Completed ||
            //   row?.cells[5]?.value === 'Audio' ||
            //   row?.cells[4]?.value === 'BAND'
            //     ? 'bg-blue-100'
            //     : row?.cells[2]?.value === SaleStateTypes.Layby ||
            //       row?.cells[5]?.value === 'Literature' ||
            //       row?.cells[4]?.value === 'LABEL'
            //     ? 'bg-yellow-100'
            //     : row?.cells[2]?.value === SaleStateTypes.Parked
            //     ? 'bg-green-100'
            //     : 'bg-gray-100'
            // } ${row?.cells[9]?.value === 0 && 'text-gray-600'} opacity-70 hover:opacity-100 mt-1`}
          >
            {row.getVisibleCells().map((cell) => {
              return (
                <td key={cell?.id} className="border border-white truncate relative pl-2 pr-4 border-r-4">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              )
            })}
          </tr>
        )
      })}
    </tbody>
    {showFooter && (
      <tfoot>
        {table.getFooterGroups().map((footerGroup) => (
          <tr key={footerGroup.id}>
            {footerGroup.headers.map((header) => (
              <th key={header.id}>
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.footer, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </tfoot>
    )}
  </>
)

//special memoized wrapper for our table body that we will use during column resizing
const MemoizedTableBody = memo(
  TableBody,
  (prev, next) => prev.table.options.data === next.table.options.data,
) as typeof TableBody

export default Table
