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
  useStockInventory,
} from "@/lib/swr-hooks";
import { loadedVendorIdAtom } from "@/lib/atoms";
import {
  CustomerObject,
  VendorObject,
  SaleObject,
  HoldObject,
  InventoryObject,
} from "@/lib/types";

// Functions
import { getItemDisplayName } from "@/lib/data-functions";

// Components
import Table from "@/components/table";
import TableContainer from "@/components/container/table";

export default function CustomerTable() {
  // SWR
  const { customers, isCustomersLoading } = useCustomers();
  const { vendors, isVendorsLoading } = useVendors();
  const { laybys, isLaybysLoading } = useLaybys();
  const { holds, isHoldsLoading } = useHolds();
  const { inventory, isInventoryLoading } = useStockInventory();

  // Atoms
  // const [view, setView] = useAtom(viewAtom);
  const [loadedVendorId, setLoadedVendorId] = useAtom(loadedVendorIdAtom);

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
          postalAddress: c?.postal_address,
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
    const openVendorDialog = (vendor: VendorObject) =>
      setLoadedVendorId({ ...loadedVendorId, customers: vendor?.id });

    // const openLaybyDialog = (layby) => {
    //   dispatch(
    //     openDialog("sale", {
    //       // vendorId: vendor,
    //     })
    //   );
    // };

    return [
      {
        Header: "Name",
        accessor: "name",
        Cell: (item: any) => (
          <span className="cursor-pointer underline" onClick={() => null}>
            {item?.value}
          </span>
        ),
      },
      {
        Header: "Email",
        accessor: "email",
        Cell: ({ value }) => <a href={`mailto:${value}`}>{value}</a>,
      },
      {
        Header: "Phone",
        accessor: "phone",
      },
      { Header: "Postal Address", accessor: "postalAddress" },
      {
        Header: "Holds",
        accessor: "holds",
        width: 220,
        Cell: ({ value }) => {
          return value && value.length > 0
            ? value.map((hold: HoldObject, i: number) => (
                <div
                  key={i}
                  className={`pb-2 cursor-pointer underline ${
                    hold?.overdue ? "text-red-600 font-bold" : "text-black"
                  }`}
                  onClick={() => null}
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
          console.log(rowA);
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
                <div key={i} className="pb-2" onClick={() => null}>
                  #{layby?.id}
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
        color="bg-col4"
        colorLight="bg-col4-light"
        colorDark="bg-col4-dark"
        data={data}
        columns={columns}
        heading={"Customers"}
        pageSize={20}
        sortOptions={[{ id: "name", desc: false }]}
      />
    </TableContainer>
  );
}
