import { flexRender } from '@tanstack/react-table'
import { memo } from 'react'

export const TableBody = ({ table, showFooter }) => (
  <>
    <tbody>
      {table.getRowModel().rows.map((row) => {
        // console.log(row.getVisibleCells())
        return (
          <tr
            key={row.id}
            className="bg-white opacity-70 hover:bg-gray-200 hover:opacity-100 mt-1"
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
                <td key={cell?.id} className="relative pl-2 pr-4 truncate border border-y-1 border-gray-200">
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
export const MemoizedTableBody = memo(
  TableBody,
  (prev, next) => prev.table.options.data === next.table.options.data,
) as typeof TableBody
