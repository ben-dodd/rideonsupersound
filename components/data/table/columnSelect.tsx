export const ColumnSelect = ({ table }) => (
  <div className="flex flex-col p-2 text-xs">
    {table.getAllLeafColumns().map((column) => {
      return (
        <div key={column.id} className="py-1">
          <label className="flex">
            <input
              {...{
                type: 'checkbox',
                checked: column.getIsVisible(),
                onChange: column.getToggleVisibilityHandler(),
              }}
            />{' '}
            <div className="ml-1 whitespace-nowrap">{column.columnDef?.header}</div>
          </label>
        </div>
      )
    })}
  </div>
)
