import { flexRender } from '@tanstack/react-table'

export const Header = ({ table, color, colorDark }) => (
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
            {header.isPlaceholder ? null : <div>{flexRender(header.column.columnDef.header, header.getContext())}</div>}
            <div
              {...{
                onDoubleClick: () => header.column.resetSize(),
                onMouseDown: header.getResizeHandler(),
                onTouchStart: header.getResizeHandler(),
                className: `resizer ${header.column.getIsResizing() ? 'isResizing' : ''}`,
              }}
            />
          </th>
        ))}
      </tr>
    ))}
  </thead>
)
