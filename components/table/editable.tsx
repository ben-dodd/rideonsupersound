import { useMemo, useState, useEffect } from "react";

// Material UI Components
import {
  useTable,
  usePagination,
  useResizeColumns,
  useBlockLayout,
  useSortBy,
} from "react-table";

const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateData,
}) => {
  // Keep and update the state of the cell
  const [value, setValue] = useState(initialValue);
  const onChange = (e) => {
    setValue(e.target.value);
  };

  // Only update the external data when the input is blurred
  const onBlur = () => {
    updateData(index, id, value);
  };

  // If the initial value is changed externally, sync it up with our state
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return <input value={value} onChange={onChange} onBlur={onBlur} />;
};

interface TableProps {
  color?: string;
  data?: any[];
  columns?: any[];
  updateData?: Function;
  skipPageReset?: boolean;
  showFooter?: boolean;
  heading?: string;
  sortOptions?: any;
}

function EditableTable({
  color,
  data,
  columns,
  updateData,
  skipPageReset,
  showFooter,
  heading,
  sortOptions,
}: TableProps) {
  const defaultColumn = useMemo(
    () => ({
      Cell: EditableCell,
      minWidth: 30,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    prepareRow,
    page,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      autoResetPage: !skipPageReset,
      updateData,
      initialState: { pageSize: 10, sortBy: sortOptions || [] },
    },
    useBlockLayout,
    useResizeColumns,
    useSortBy,
    usePagination
  );

  return (
    <div className="ml-1">
      <div
        className={`flex justify-between items-center px-2 mb-1 shadow-lg ${
          color ? `bg-${color}` : ""
        }`}
      >
        {heading ? (
          <div className={`text-4xl font-bold uppercase`}>{heading}</div>
        ) : (
          <div />
        )}
      </div>
      <div className="overflow-x-scroll w-full">
        <table {...getTableProps()} className="table-auto w-full">
          <thead className="sticky">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    className={`border border-white ${
                      color
                        ? `bg-${color} hover:bg-${color}-dark`
                        : "bg-gray-500 hover:bg-gray-800"
                    } hover:shadow text-left px-2 truncate`}
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                  >
                    {column.render("Header")}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " ↓"
                          : " ↑"
                        : ""}
                    </span>
                    <div
                      className="inline-block w-1 z-10 h-full absolute right-0 top-0 translate-x-1/2 cursor-resize"
                      {...column.getResizerProps()}
                    />
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              let rowProps = row.getRowProps();
              return (
                <tr {...rowProps}>
                  {row.cells.map((cell) => {
                    return (
                      <td
                        className="border border-gray-200 border p-1 truncate"
                        {...cell.getCellProps()}
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
          {showFooter && (
            <tfoot>
              {footerGroups.map((group) => (
                <tr {...group.getFooterGroupProps()}>
                  {group.headers.map((column) => (
                    <td {...column.getFooterProps()}>
                      <b>{column.render("Footer")}</b>
                    </td>
                  ))}
                </tr>
              ))}
            </tfoot>
          )}
        </table>
      </div>
      {/*<div className="flex justify-end items-center py-2">
        <span>
          Page{" "}
          <strong>
            {get(state, "pageIndex", 0) + 1} of {pageOptions.length}
          </strong>
        </span>
        <button
          className="icon-button"
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        >
          <MdFirstPage />
        </button>
        <button
          className="icon-button"
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          <MdNavigateBefore />
        </button>
        <button
          className="icon-button"
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          <MdNavigateNext />
        </button>
        <button
          className="icon-button"
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        >
          <MdLastPage />
        </button>
      </div>*/}
    </div>
  );
}

export default EditableTable;
