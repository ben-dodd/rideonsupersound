// Packages
import { useMemo } from "react";
import { useAtom } from "jotai";
import { parseISO, add } from "date-fns";

// DB
import {
  useCustomers,
  useVendors,
  useHolds,
  useLaybys,
  useInventory,
} from "@/lib/swr-hooks";
import {
  viewAtom,
  loadedVendorIdAtom,
  loadedHoldIdAtom,
  loadedCustomerObjectAtom,
} from "@/lib/atoms";
import {
  CustomerObject,
  SaleObject,
  HoldObject,
  InventoryObject,
} from "@/lib/types";

// Functions
import { getItemDisplayName } from "@/lib/data-functions";

// Components
import Table from "@/components/_components/table";
import TableContainer from "@/components/_components/container/table";

export default function CustomerTable() {
  // SWR
  const { customers, isCustomersLoading } = useCustomers();
  const { vendors, isVendorsLoading } = useVendors();
  const { laybys, isLaybysLoading } = useLaybys();
  const { holds, isHoldsLoading } = useHolds();
  const { inventory, isInventoryLoading } = useInventory();

  // Atoms
  const [view, setView] = useAtom(viewAtom);
  const [loadedVendorId, setLoadedVendorId] = useAtom(loadedVendorIdAtom);
  const [loadedHoldId, setLoadedHoldId] = useAtom(loadedHoldIdAtom);
  const [customer, setCustomer] = useAtom(loadedCustomerObjectAtom);

  // Constants
  const data = useMemo(
    () =>
      customers
        ?.filter(
          (c: CustomerObject) =>
            !c?.is_deleted &&
            (holds?.filter(
              (h: HoldObject) => h?.customer_id === c?.id && !h?.is_deleted
            )?.length > 0 ||
              laybys?.filter(
                (l: SaleObject) => l?.customer_id === c?.id && !l?.is_deleted
              )?.length > 0)
        )
        .map((c: CustomerObject) => ({
          id: c?.id,
          name: c?.name,
          email: c?.email,
          phone: c?.phone,
          postal_address: c?.postal_address,
          notes: c?.note,
          holds: holds
            ?.filter(
              (h: HoldObject) => h?.customer_id === c?.id && !h?.is_deleted
            )
            .map((h: HoldObject) => {
              return {
                ...h,
                overdue:
                  add(parseISO(h?.date_from), { days: h?.hold_period }) <
                  new Date(),
              };
            }),
          laybys: laybys?.filter(
            (l: SaleObject) => l?.customer_id === c?.id && !l?.is_deleted
          ),
        })),
    [customers, laybys, holds, vendors]
  );
  const columns = useMemo(() => {
    return [
      {
        Header: "Name",
        accessor: "name",
        width: 200,
        Cell: (item: any) => (
          <span
            className="cursor-pointer underline"
            onClick={() => {
              setCustomer(item?.row?.original);
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
      {
        Header: "Holds",
        accessor: "holds",
        width: 400,
        Cell: ({ value }) => {
          return value && value.length > 0
            ? value.map((hold: HoldObject, i: number) => (
                <div
                  key={hold?.id}
                  className={`mb-2 cursor-pointer underline ${
                    hold?.overdue ? "text-red-600 font-bold" : "text-black"
                  }`}
                  onClick={() =>
                    setLoadedHoldId({ ...loadedHoldId, customers: hold?.id })
                  }
                >
                  {`${hold?.quantity || 1} x ${getItemDisplayName(
                    inventory?.filter(
                      (i: InventoryObject) => i?.id === hold?.item_id
                    )[0]
                  )}`}
                </div>
              ))
            : "";
        },
        sortType: (rowA: any, rowB: any) => {
          const a = rowA.original?.holds?.length || 0;
          const b = rowB.original?.holds?.length || 0;
          return a > b ? 1 : b > a ? -1 : 0;
        },
      },
      {
        Header: "Laybys",
        accessor: "laybys",
        width: 220,
        Cell: ({ value }) =>
          value && value.length > 0
            ? value.map((layby: SaleObject, i: number) => (
                <div key={i} className="pb-2">
                  Go to Sale #{layby?.id}
                </div>
              ))
            : "",
        sortType: (rowA: any, rowB: any, columnId: any) => {
          console.log(columnId);
          const a = rowA.original?.laybys?.length || 0;
          const b = rowB.original?.laybys?.length || 0;
          return a > b ? 1 : b > a ? -1 : 0;
        },
      },
      // {
      //   Header: "Orders",
      //   accessor: "orders",
      //   Cell: ({ value }) =>
      //     value && value.length > 0
      //       ? value.map((order) => (
      //           <div className="pb-2">
      //             {writeItemList({ inventory, items: get(order, `items`, []) })}
      //           </div>
      //         ))
      //       : "",
      // },
    ];
  }, [inventory, vendors]);

  return (
    <TableContainer
      loading={
        isInventoryLoading ||
        isHoldsLoading ||
        isLaybysLoading ||
        isCustomersLoading ||
        isVendorsLoading
      }
    >
      <Table
        color="bg-col6"
        colorLight="bg-col6-light"
        colorDark="bg-col6-dark"
        data={data}
        columns={columns}
        heading={"Holds"}
        pageSize={20}
        sortOptions={[{ id: "name", desc: false }]}
      />
    </TableContainer>
  );
}
