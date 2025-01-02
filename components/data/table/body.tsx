import { flexRender } from '@tanstack/react-table'
import { memo } from 'react'

export const TableBody = ({ table, showFooter, selectable }) => (
  <>
    <tbody>
      {table.getRowModel().rows.map((row) => (
        <tr
          key={row.id}
          className={`bg-white opacity-70 hover:bg-gray-200 hover:opacity-100 mt-1 ${
            row.getIsSelected() ? 'bg-yellow-300' : ''
          }`}
          onClick={selectable ? row.getToggleSelectedHandler : null}
        >
          {row.getVisibleCells().map((cell) => {
            return (
              <td key={cell?.id} className="relative pl-2 pr-4 truncate border border-y-1 border-gray-200">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            )
          })}
        </tr>
      ))}
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
