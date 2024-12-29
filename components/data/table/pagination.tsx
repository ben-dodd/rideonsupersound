import { FirstPage, KeyboardArrowLeft, KeyboardArrowRight, LastPage } from '@mui/icons-material'

export const Pagination = ({ table }) => {
  const disablePrev = !table.getCanPreviousPage()
  const disableNext = !table.getCanNextPage()
  return (
    <div className="flex items-center gap-2 pt-2">
      <button
        className={`${disablePrev ? 'text-gray-400' : ''}`}
        onClick={() => table.setPageIndex(0)}
        disabled={disablePrev}
      >
        <FirstPage />
      </button>
      <button
        className={`${disablePrev ? 'text-gray-400' : ''}`}
        onClick={() => table.previousPage()}
        disabled={disablePrev}
      >
        <KeyboardArrowLeft />
      </button>
      <button
        className={`${disableNext ? 'text-gray-400' : ''}`}
        onClick={() => table.nextPage()}
        disabled={disableNext}
      >
        <KeyboardArrowRight />
      </button>
      <button
        className={`${disableNext ? 'text-gray-400' : ''}`}
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        disabled={disableNext}
      >
        <LastPage />
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
        {[10, 20, 30, 50, 100, 200, 500].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            Show {pageSize}
          </option>
        ))}
      </select>
    </div>
  )
}
