import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useState } from "react";

export default function Table({ data, columns }) {
  const [globalFilter, setGlobalFilter] = useState(null);
  const dataColumns = columns?.map((col, i) => {
    return (
      <Column
        key={col.field}
        field={col.field}
        header={col.header}
        body={col.body}
        sortable={col.sortable || false}
        style={col.style || null}
      ></Column>
    );
  });

  return (
    <DataTable
      value={data}
      sortMode="multiple"
      header={() => {
        return (
          <div className="p-d-flex p-jc-between">
            <Button
              type="button"
              icon="pi pi-filter-slash"
              label="Clear"
              className="p-button-outlined"
              onClick={() => setGlobalFilter(null)}
            />
            <span className="p-input-icon-left">
              <i className="pi pi-search" />
              <InputText
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Keyword Search"
              />
            </span>
          </div>
        );
      }}
      globalFilterFields={["clerk", "status"]}
      responsiveLayout="scroll"
      resizableColumns
      columnResizeMode="fit"
      paginator
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
      rows={10}
      rowsPerPageOptions={[10, 20, 50]}
    >
      {dataColumns}
    </DataTable>
  );
}
