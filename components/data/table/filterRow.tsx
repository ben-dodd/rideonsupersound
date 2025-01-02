const TableFilterRow = ({ table, showFilter }) => {
  return (
    <div
      className={`overflow-hidden transition-all ease-in-out duration-300 ${showFilter ? 'max-h-40' : 'max-h-0'}`}
      // style={{ display: 'table-row' }}
    >
      {table.getHeaderGroups().map((headerGroup) =>
        headerGroup.headers.map((header) => (
          <td
            key={header.id}
            {...{
              className: `border border-white select-none h-8 text-left px-2 truncate`,
              style: {
                // left: header.getStart(),
                width: `calc(var(--header-${header?.id}-size) * 1px)`,
              },
            }}
          >
            filter
          </td>
        )),
      )}
    </div>
  )
}

export default TableFilterRow
