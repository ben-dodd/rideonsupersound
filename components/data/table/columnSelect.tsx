export const ColumnSelect = ({ table }) => (
  <div className="flex">
    {table.getAllLeafColumns().map((column) => {
      return (
        <div key={column.id} className="px-1">
          <label>
            <input
              {...{
                type: 'checkbox',
                checked: column.getIsVisible(),
                onChange: column.getToggleVisibilityHandler(),
              }}
            />{' '}
            {column.columnDef?.header}
          </label>
        </div>
      )
    })}
  </div>
)
