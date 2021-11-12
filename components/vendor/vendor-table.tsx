// Packages
import { useMemo } from "react";
import { useAtom } from "jotai";

// DB
import {
  useVendors,
  useClerks,
  useCustomers,
  useStockInventory,
  useSalesJoined,
  useVendorPayments,
} from "@/lib/swr-hooks";
import { loadedVendorIdAtom } from "@/lib/atoms";
import {
  VendorObject,
  ClerkObject,
  CustomerObject,
  InventoryObject,
} from "@/lib/types";

// Functions
import { getPaymentVars } from "@/lib/data-functions";

// Components
import Table from "@/components/table";
import TableContainer from "@/components/container/table";

export default function VendorsScreen() {
  // Atoms
  const [loadedVendorId, setLoadedVendorId] = useAtom(loadedVendorIdAtom);

  // SWR
  const { inventory, isInventoryLoading } = useStockInventory();
  const { sales, isSalesLoading } = useSalesJoined();
  const { vendorPayments, isVendorPaymentsLoading } = useVendorPayments();
  const { vendors, isVendorsLoading } = useVendors();
  const { clerks, isClerksLoading } = useClerks();
  const { customers, isCustomersLoading } = useCustomers();

  // Constants
  const data = useMemo(
    () =>
      vendors
        ? vendors
            ?.filter((v: VendorObject) => !v?.is_deleted)
            .map((v: VendorObject) => {
              let vendorVars = getPaymentVars(
                inventory,
                sales,
                vendorPayments,
                v?.id
              );
              return {
                id: v?.id,
                name: v?.name || "-",
                vendorCustomer:
                  customers?.filter(
                    (c: CustomerObject) => c?.id === v?.customer_id
                  )[0] || {},
                storeCustomer:
                  clerks?.filter(
                    (c: ClerkObject) => c?.id === v?.clerk_id
                  )[0] || {},
                type: v?.category || "-",
                bankAccountNumber: v?.bank_account_number || "-",
                totalTake: vendorVars?.totalSell || 0,
                totalOwing: vendorVars?.totalOwing || 0,
                totalDebitAmount: vendorVars?.totalPaid || 0,
                uniqueItemsInStock: vendorVars?.totalItems?.length,
                totalItemsInStock: vendorVars?.totalItems?.reduce(
                  (sum: number, item: InventoryObject) =>
                    (item?.quantity || 0) + sum,
                  0
                ),
              };
            })
        : [],
    [vendors, sales, inventory, vendorPayments, customers, clerks]
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
            onClick={() =>
              setLoadedVendorId({
                ...loadedVendorId,
                vendors: item?.row?.original?.id,
              })
            }
          >
            {item?.value || ""}
          </span>
        ),
      },
      {
        Header: "Vendor Customer",
        accessor: "vendorCustomer",
        width: 150,
        Cell: ({ value }) => value?.name || "-",
      },
      {
        Header: "Staff",
        accessor: "storeCustomer",
        width: 80,
        Cell: ({ value }) => value?.name || "-",
      },
      { Header: "Type", accessor: "type", width: 100 },
      { Header: "Bank Account #", accessor: "bankAccountNumber", width: 200 },
      {
        Header: "Total Take",
        accessor: "totalTake",
        width: 100,
        Cell: ({ value }) =>
          value && !isNaN(value) ? `$${(value / 100)?.toFixed(2)}` : "$0.00",
      },
      {
        Header: "Total Paid",
        accessor: "totalDebitAmount",
        width: 100,
        Cell: ({ value }) =>
          value && !isNaN(value) ? `$${(value / 100)?.toFixed(2)}` : "$0.00",
      },
      {
        Header: "Total Owing",
        accessor: "totalOwing",
        width: 120,
        Cell: ({ value }) =>
          value && !isNaN(value) ? `$${(value / 100)?.toFixed(2)}` : "$0.00",
      },
      {
        Header: "Unique Items",
        accessor: "uniqueItemsInStock",
        width: 130,
      },
      {
        Header: "Total Items",
        accessor: "totalItemsInStock",
        width: 110,
      },
    ];
  }, []);

  return (
    <TableContainer
      loading={
        isSalesLoading ||
        isClerksLoading ||
        isVendorsLoading ||
        isCustomersLoading ||
        isInventoryLoading ||
        isVendorPaymentsLoading
      }
    >
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
    </TableContainer>
  );
}
