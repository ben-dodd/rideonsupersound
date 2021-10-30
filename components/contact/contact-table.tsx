// Packages
import { useMemo } from "react";
import { useAtom } from "jotai";
import { parseISO, add } from "date-fns";

// DB
import {
  useContacts,
  useVendors,
  useHolds,
  useLaybys,
  useInventory,
} from "@/lib/swr-hooks";
import { viewAtom, loadedVendorIdAtom } from "@/lib/atoms";
import {
  ContactObject,
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

export default function ContactTable() {
  // SWR
  const { contacts } = useContacts();
  const { vendors } = useVendors();
  const { laybys } = useLaybys();
  const { holds } = useHolds();
  const { inventory } = useInventory();

  // Atoms
  const [view, setView] = useAtom(viewAtom);
  const [loadedVendorId, setLoadedVendorId] = useAtom(loadedVendorIdAtom);

  // Constants
  const data = useMemo(
    () =>
      (contacts || [])
        .filter((c: ContactObject) => !c?.is_deleted)
        .map((c: ContactObject) => ({
          id: c?.id,
          name: c?.name,
          vendor:
            (vendors || []).filter(
              (v: VendorObject) => v?.contact_id === c?.id
            )[0] || null,
          email: c?.email,
          phone: c?.phone,
          postalAddress: c?.postal_address,
          notes: c?.note,
          holds: (holds || [])
            .filter(
              (h: HoldObject) => h?.contact_id === c?.id && !h?.is_deleted
            )
            .map((h: HoldObject) => {
              return {
                ...h,
                overdue:
                  add(parseISO(h?.date_from), { days: h?.hold_period }) <
                  new Date(),
              };
            }),
          laybys: (laybys || []).filter(
            (l: SaleObject) => l?.contact_id === c?.id && !l?.is_deleted
          ),
        })),
    [contacts, laybys, holds, vendors]
  );
  const columns = useMemo(() => {
    const openVendorDialog = (vendor: VendorObject) =>
      setLoadedVendorId({ ...loadedVendorId, contacts: vendor?.id });

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
        Header: "Vendor",
        accessor: "vendor",
        Cell: ({ value }) => (
          <span
            className="cursor-pointer underline"
            onClick={() => openVendorDialog(value)}
          >
            {value?.name || ""}
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
                    hold?.overdue
                      ? "text-red-600 font-bold animate-bounce"
                      : "text-black"
                  }`}
                  onClick={() => null}
                >
                  {`${hold?.quantity || 1} x ${getItemDisplayName(
                    (inventory || []).filter(
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
                  Items not visible yet
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
    <TableContainer>
      <Table
        color="bg-col4"
        colorLight="bg-col4-light"
        colorDark="bg-col4-dark"
        data={data}
        columns={columns}
        heading={"Contacts"}
        pageSize={20}
        sortOptions={[{ id: "name", desc: false }]}
      />
    </TableContainer>
  );
}
