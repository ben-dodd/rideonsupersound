// Packages
import { useMemo } from "react";

// DB
import { useClerks, useVendors, useVendorPayments } from "@/lib/swr-hooks";
import { ClerkObject, VendorPaymentObject, VendorObject } from "@/lib/types";

// Functions
import { nzDate, fDateTime } from "@/lib/data-functions";

// Components
import TableContainer from "@/components/container/table";
import Table from "@/components/table";

export default function PaymentTable() {
  // SWR
  const { vendors, isVendorsLoading } = useVendors();
  const { vendorPayments, isVendorPaymentsLoading } = useVendorPayments();
  const { clerks, isClerksLoading } = useClerks();

  // Constants
  const data = useMemo(
    () =>
      vendorPayments?.map((v: VendorPaymentObject) => ({
        date: v?.date,
        vendor_id: v?.vendor_id,
        amount: v?.amount,
        type: v?.type,
        clerk: clerks?.filter((c: ClerkObject) => c?.id === v?.clerk_id)[0]
          ?.name,
      })),
    [vendorPayments, clerks]
  );

  const columns = useMemo(
    () => [
      {
        Header: "Date",
        accessor: "date",
        width: 270,
        Cell: (item: any) =>
          item ? <div>{fDateTime(item?.value)}</div> : <div />,
        sortType: (rowA: VendorPaymentObject, rowB: VendorPaymentObject) => {
          const a = nzDate(rowA?.date);
          const b = nzDate(rowB?.date);
          return a > b ? 1 : b > a ? -1 : 0;
        },
      },
      {
        Header: "Vendor",
        accessor: "vendor_id",
        Cell: ({ value }) =>
          vendors?.filter((v: VendorObject) => v?.id === value)[0]?.name || "",
      },
      {
        Header: "Amount",
        accessor: "amount",
        width: 100,
        Cell: ({ value }) =>
          value && !isNaN(value) ? `$${(value / 100)?.toFixed(2)}` : "N/A",
      },
      { Header: "Clerk", accessor: "clerk" },
      { Header: "Type", accessor: "type" },
    ],
    [vendors]
  );

  return (
    <TableContainer
      loading={isVendorsLoading || isVendorPaymentsLoading || isClerksLoading}
    >
      <Table
        color="bg-col4"
        colorLight="bg-col4-light"
        colorDark="bg-col4-dark"
        data={data}
        columns={columns}
        heading={"Vendor Payments"}
        pageSize={20}
        sortOptions={[{ id: "date", desc: true }]}
      />
    </TableContainer>
  );
}
