import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material'
import { flexRender } from '@tanstack/react-table'
import Filter from '../filter'

const columnIsFiltered = (value) => {
  if (!value) return false
  if (Array.isArray(value)) {
    if (value.every((val) => val === null || val === undefined || val === '')) {
      return false
    }
  }
  return true
}

export const Header = ({ table, color, colorDark, enableColumnResizing = true }) => (
  <thead className="sticky top-0 z-10 bg-white">
    {table.getHeaderGroups().map((headerGroup) => (
      <tr key={headerGroup.id}>
        {headerGroup.headers.map((header) => (
          <th
            key={header.id}
            colSpan={header.colSpan}
            {...{
              className: `select-none`,
              style: {
                width: `calc(var(--header-${header?.id}-size) * 1px)`,
              },
            }}
          >
            {header.isPlaceholder ? null : (
              <div
                {...{
                  className: header.column.getCanSort()
                    ? `flex justify-between items-center cursor-pointer h-8 ${
                        color
                          ? `${color} hover:${colorDark}`
                          : columnIsFiltered(header.column.getFilterValue())
                          ? 'bg-blue-200 hover:bg-blue-400'
                          : 'bg-gray-200 hover:bg-gray-400'
                      } text-left px-2 truncate`
                    : '',
                  onClick: header.column.getToggleSortingHandler(),
                }}
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
                {{
                  asc: (
                    <div className="ml-1 p-0">
                      <ArrowDropDown />
                    </div>
                  ),
                  desc: (
                    <div className="ml-1 p-0">
                      <ArrowDropUp />
                    </div>
                  ),
                }[header.column.getIsSorted() as string] ?? null}
              </div>
            )}
            {header.column.getCanFilter() ? (
              <div>
                <Filter column={header.column} />
              </div>
            ) : (
              <div className="h-8 mb-1" />
            )}
            {enableColumnResizing && (
              <div
                {...{
                  onDoubleClick: () => header.column.resetSize(),
                  onMouseDown: header.getResizeHandler(),
                  onTouchStart: header.getResizeHandler(),
                  className: `resizer ${header.column.getIsResizing() ? 'isResizing' : ''}`,
                }}
              />
            )}
          </th>
        ))}
      </tr>
    ))}
  </thead>
)
