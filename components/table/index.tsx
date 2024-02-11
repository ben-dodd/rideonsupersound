import { useMemo } from 'react'
import { SaleStateTypes } from 'lib/types/sale'
import { useBlockLayout, useFilters, useGlobalFilter, useResizeColumns, useSortBy, useTable } from 'react-table'
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material'

interface TableProps {
  color?: string
  colorLight?: string
  colorDark?: string
  data?: any[]
  columns?: any[]
  showFooter?: boolean
  heading?: string
  onClickRow?: Function
  sortOptions?: any
  hiddenColumns?: string[]
  downloadCSV?: boolean
}

function Table({ color, colorDark, data, columns, showFooter, sortOptions, hiddenColumns }: TableProps) {
  const defaultColumn = useMemo(
    () => ({
      minWidth: 30,
    }),
    [],
  )

  const { getTableProps, getTableBodyProps, headerGroups, footerGroups, prepareRow, rows } = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: {
        sortBy: sortOptions || [],
        hiddenColumns: hiddenColumns || [],
      },
    },
    useBlockLayout,
    useResizeColumns,
    useFilters,
    useGlobalFilter,
    useSortBy,
  )

  return (
    <div className="ml-1">
      <div className="overflow-x-scroll w-full">
        <table {...getTableProps()} className="table-auto w-full text-sm">
          <thead className="sticky">
            {headerGroups.map((headerGroup, i) => (
              <tr key={i} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, i) => (
                  <th
                    key={i}
                    className={`border border-white select-none h-6 ${
                      color ? `${color} hover:${colorDark}` : 'bg-gray-200 hover:bg-gray-400'
                    } text-left px-2 truncate`}
                    {...column.getHeaderProps()}
                  >
                    <div {...column.getSortByToggleProps()} className="flex justify-between">
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
                    </div>
                    <div
                      className={`inline-block w-1 z-10 h-full absolute right-0 top-0 translate-x-1/2 cursor-resize bg-white`}
                      {...column.getResizerProps()}
                    />
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row)
              return (
                <tr
                  key={i}
                  {...row.getRowProps()}
                  className={`${
                    row?.cells[2]?.value === SaleStateTypes.Completed ||
                    row?.cells[5]?.value === 'Audio' ||
                    row?.cells[4]?.value === 'BAND'
                      ? 'bg-blue-100'
                      : row?.cells[2]?.value === SaleStateTypes.Layby ||
                        row?.cells[5]?.value === 'Literature' ||
                        row?.cells[4]?.value === 'LABEL'
                      ? 'bg-yellow-100'
                      : row?.cells[2]?.value === SaleStateTypes.Parked
                      ? 'bg-green-100'
                      : 'bg-gray-100'
                  } ${row?.cells[9]?.value === 0 && 'text-gray-600'} opacity-70 hover:opacity-100 mt-1`}
                >
                  {row.cells.map((cell: any) => {
                    return (
                      <td
                        key={cell?.id}
                        className="border border-white truncate relative pl-2 pr-4 border-r-4"
                        {...cell.getCellProps()}
                      >
                        {cell.render('Cell')}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
          {showFooter && (
            <tfoot>
              {footerGroups.map((group, i) => (
                <tr key={i} {...group.getFooterGroupProps()}>
                  {group.headers.map((column, i) => (
                    <td key={i} {...column.getFooterProps()}>
                      <b>{column.render('Footer')}</b>
                    </td>
                  ))}
                </tr>
              ))}
            </tfoot>
          )}
        </table>
      </div>
    </div>
  )
}

export default Table
