import { useAtom } from "jotai";
import { useMemo } from "react";
import { showVendorScreenAtom } from "@/lib/atoms";
import { useVendors, useClerks, useContacts } from "@/lib/swr-hooks";
import { VendorObject, ClerkObject, ContactObject } from "@/lib/types";

// Actions
// import { getSaleInformation, getItemsInStock } from "@/lib/data-functions";

// Material UI Components
import Table from "@/components/table";

function VendorsScreen() {
  const [, setShowVendorScreen] = useAtom(showVendorScreenAtom);
  const { vendors } = useVendors();
  const { clerks } = useClerks();
  const { contacts } = useContacts();
  const data = useMemo(
    () =>
      vendors
        ? (vendors || [])
            .filter((v: VendorObject) => !v?.is_deleted)
            .map((v: VendorObject) => {
              // let itemsInStock = getItemsInStock({ inventory, vendorId: id });
              // let saleInformation = getSaleInformation({
              //   vendorId: id,
              //   inventory,
              //   sales,
              //   debits,
              // });
              return {
                id: v?.id,
                name: v?.name || "-",
                vendorContact:
                  (contacts || []).filter(
                    (c: ContactObject) => c?.id === v?.contact_id
                  )[0] || {},
                storeContact:
                  (clerks || []).filter(
                    (c: ClerkObject) => c?.id === v?.clerk_id
                  )[0] || {},
                type: v?.category || "-",
                bankAccountNumber: v?.bank_account_number || "-",
                // totalTake: get(saleInformation, "totalTake", 0),
                // totalOwing: get(saleInformation, "totalOwing", 0),
                // totalDebitAmount: get(saleInformation, "totalDebitAmount", 0),
                // uniqueItemsInStock: Object.keys(itemsInStock || {}).length,
                // totalItemsInStock: Object.values(itemsInStock || {}).reduce(
                //   (sum, item) =>
                //     isNaN(get(item, "quantity", 0))
                //       ? sum
                //       : get(item, "quantity", 0) + sum,
                //   0
                // ),
              };
            })
        : [],
    [vendors, contacts, clerks]
  );

  const columns = useMemo(() => {
    // const openVendorDialog = (item: any) =>
    //   setShowVendorScreen(item?.row?.original?.id);
    return [
      {
        Header: "ID",
        accessor: "id",
        width: 50,
      },
      {
        Header: "Name",
        accessor: "name",
        width: 180,
        Cell: (item: any) => (
          <span
            className="cursor-pointer underline"
            onClick={() => setShowVendorScreen(item?.row?.original?.id)}
          >
            {item?.value || ""}
          </span>
        ),
      },
      {
        Header: "Vendor Contact",
        accessor: "vendorContact",
        width: 150,
        Cell: ({ value }) => value?.name || "-",
      },
      {
        Header: "Staff",
        accessor: "storeContact",
        width: 80,
        Cell: ({ value }) => value?.name || "-",
      },
      { Header: "Type", accessor: "type", width: 100 },
      { Header: "Bank Account #", accessor: "bankAccountNumber", width: 200 },
      // {
      //   Header: "Total Take",
      //   accessor: "totalTake",
      //   width: 100,
      //   Cell: ({ value }) =>
      //     value && !isNaN(value) ? `$${value.toFixed(2)}` : "$0.00",
      // },
      // {
      //   Header: "Total Paid",
      //   accessor: "totalDebitAmount",
      //   width: 100,
      //   Cell: ({ value }) =>
      //     value && !isNaN(value) ? `$${value.toFixed(2)}` : "$0.00",
      // },
      // {
      //   Header: "Total Owing",
      //   accessor: "totalOwing",
      //   width: 120,
      //   Cell: ({ value }) =>
      //     value && !isNaN(value) ? `$${value.toFixed(2)}` : "$0.00",
      // },
      // {
      //   Header: "Unique Items",
      //   accessor: "uniqueItemsInStock",
      //   width: 130,
      // },
      // {
      //   Header: "Total Items",
      //   accessor: "totalItemsInStock",
      //   width: 110,
      // },
    ];
  }, []);

  console.log(data);
  console.log(columns);

  return (
    <div className="table-div">
      <Table
        color="bg-col3"
        colorLight="bg-col3-light"
        colorDark="bg-col3-dark"
        data={data}
        columns={columns}
        heading={"Vendors"}
        pageSize={20}
        sortOptions={[{ id: "name", desc: false }]}
      />
    </div>
  );
}

export default VendorsScreen;
