// Packages
import { useMemo } from "react";

// DB
import { useClerks, useVendors, useVendorPayments } from "@/lib/swr-hooks";
import { ClerkObject, VendorPaymentObject, VendorObject } from "@/lib/types";

// Components
import TableContainer from "@/components/_components/container/table";
import Table from "@/components/_components/table";
import dayjs from "dayjs";

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
        payment_id: v?.id,
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
          item ? (
            <div>{dayjs(item?.value).format("D MMMM YYYY, h:mm A")}</div>
          ) : (
            <div />
          ),
        sortType: (rowA: VendorPaymentObject, rowB: VendorPaymentObject) => {
          const a = dayjs(rowA?.date);
          const b = dayjs(rowB?.date);
          return a > b ? 1 : b > a ? -1 : 0;
        },
      },
      {
        Header: "Vendor",
        accessor: "vendor_id",
        width: 250,
        Cell: ({ value }) =>
          vendors?.filter((v: VendorObject) => v?.id === value)[0]?.name || "",
      },
      {
        Header: "Amount",
        accessor: "amount",
        width: 100,
        Cell: ({ value }) => (
          <div className={value < 0 ? "text-red-500" : "text-black"}>
            {value && !isNaN(value)
              ? value < 0
                ? `($${(Math.abs(value) / 100)?.toFixed(2)})`
                : `$${(value / 100)?.toFixed(2)}`
              : "N/A"}
          </div>
        ),
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
        downloadCSV={true}
      />
    </TableContainer>
  );
}
