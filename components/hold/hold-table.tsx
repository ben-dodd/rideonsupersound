// Packages
import { useMemo } from "react";
import { useAtom } from "jotai";

// DB
import { useCustomers, useHolds, useInventory } from "@/lib/swr-hooks";
import {
  viewAtom,
  loadedHoldIdAtom,
  loadedCustomerObjectAtom,
} from "@/lib/atoms";
import { CustomerObject, HoldObject, InventoryObject } from "@/lib/types";

// Functions
import {
  getItemDisplayName,
  getItemSkuDisplayName,
} from "@/lib/data-functions";

// Components
import Table from "@/components/_components/table";
import TableContainer from "@/components/_components/container/table";
import dayjs from "dayjs";

export default function CustomerTable() {
  // SWR
  const { customers, isCustomersLoading } = useCustomers();
  const { holds, isHoldsLoading } = useHolds();
  const { inventory, isInventoryLoading } = useInventory();

  // Atoms
  const [view, setView] = useAtom(viewAtom);
  const [loadedHoldId, setLoadedHoldId] = useAtom(loadedHoldIdAtom);
  const [customer, setCustomer] = useAtom(loadedCustomerObjectAtom);

  // Constants
  const data = useMemo(
    () =>
      holds
        ?.filter((h: HoldObject) => !h?.is_deleted)
        .map((h: HoldObject) => {
          const c: CustomerObject = customers?.filter(
            (c: CustomerObject) => h?.customer_id === c?.id
          )[0];
          return {
            id: h?.id,
            hold: h,
            holdName: getItemSkuDisplayName(h?.item_id, inventory),
            expiryDate: dayjs(h?.date_from).add(h?.hold_period, "day"),
            customer: c,
            name: c?.name,
            email: c?.email,
            phone: c?.phone,
            postal_address: c?.postal_address,
          };
        }),
    [customers, holds]
  );
  const columns = useMemo(() => {
    return [
      {
        Header: "sku",
        accessor: "holdName",
      },
      {
        Header: "Hold",
        accessor: "hold",
        width: 400,
        Cell: ({ value }) => (
          <div
            key={value?.id}
            className={`mb-2 cursor-pointer underline whitespace-normal`}
            onClick={() =>
              setLoadedHoldId({ ...loadedHoldId, holds: value?.id })
            }
          >
            {`${value?.quantity || 1} x ${getItemDisplayName(
              inventory?.filter(
                (i: InventoryObject) => i?.id === value?.item_id
              )[0]
            )}`}
          </div>
        ),
      },
      {
        Header: "Expiry Date",
        accessor: "expiryDate",
        Cell: ({ value }) => (
          <div
            className={dayjs().isAfter(value) ? "text-red-500" : "text-black"}
          >
            {value?.format("D MMMM YYYY")}
          </div>
        ),
        sortType: (rowA: any, rowB: any, columnId: any) => {
          const a = rowA?.original[columnId];
          const b = rowB?.original[columnId];
          return a?.isAfter(b) ? 1 : b?.isAfter(a) ? -1 : 0;
        },
      },
      {
        Header: "Name",
        accessor: "name",
        width: 200,
        Cell: (item: any) => (
          <span
            className="cursor-pointer underline"
            onClick={() => {
              setCustomer(item?.row?.original?.customer);
              setView({ ...view, createCustomer: true });
            }}
          >
            {item?.value}
          </span>
        ),
      },
      {
        Header: "Email",
        accessor: "email",
        width: 200,
        Cell: ({ value }) => <a href={`mailto:${value}`}>{value}</a>,
      },
      {
        Header: "Phone",
        accessor: "phone",
        width: 150,
      },
      { Header: "Postal Address", accessor: "postal_address" },
    ];
  }, [inventory]);

  return (
    <TableContainer
      loading={isInventoryLoading || isHoldsLoading || isCustomersLoading}
    >
      <Table
        color="bg-col7"
        colorLight="bg-col7-light"
        colorDark="bg-col7-dark"
        data={data}
        columns={columns}
        heading={"Holds"}
        pageSize={20}
        sortOptions={[{ id: "name", desc: false }]}
        hiddenColumns={["holdName"]}
      />
    </TableContainer>
  );
}
