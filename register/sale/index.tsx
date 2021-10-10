import { useMemo } from "react";
import { useAtom } from "jotai";
import {
  useSales,
  useSaleItems,
  useContacts,
  useClerks,
  useInventory,
} from "@/lib/swr-hooks";
import {
  SaleObject,
  SaleItemObject,
  ContactObject,
  ClerkObject,
} from "@/lib/types";
import {
  writeItemList,
  getTotalStoreCut,
  getTotalPrice,
  nzDate,
  fDateTime,
} from "@/lib/data-functions";
import { showCartScreenAtom, cartAtom } from "@/lib/atoms";

import SaleScreen from "@/components/sell/sale-screen";
import Table from "@/components/table";

function SalesScreen() {
  const { sales } = useSales();
  const { saleItems } = useSaleItems();
  const { inventory } = useInventory();
  const { contacts } = useContacts();
  const { clerks } = useClerks();
  const [showSaleScreen, setShowSaleScreen] = useAtom(showCartScreenAtom);
  const [, setCart] = useAtom(cartAtom);
  const data = useMemo(
    () =>
      (sales || []).map((s: SaleObject) => {
        const items = saleItems?.filter(
          (i: SaleItemObject) => i?.sale_id === s?.id
        );
        s = { ...s, items };
        return {
          id: s?.id,
          date: nzDate(s?.date_sale_opened),
          status: s?.state,
          contact: (contacts || []).filter(
            (c: ContactObject) => c?.id === s?.contact_id
          )[0],
          clerk: (clerks || []).filter(
            (c: ClerkObject) => c?.id === s?.sale_opened_by
          )[0],
          numberOfItems: items?.reduce(
            (accumulator: number, item: SaleItemObject) =>
              accumulator + item?.quantity || 1,
            0
          ),
          items: writeItemList(inventory, items),
          store: getTotalStoreCut(s, inventory),
          sell: getTotalPrice(s, inventory),
        };
      }),
    [sales, contacts, clerks, inventory]
  );
  const columns = useMemo(() => {
    // const openSaleDialog = (item) => {
    //   dispatch(
    //     openDialog(
    //       "sale",
    //       get(sales, get(item, "row.original.uid", null), null)
    //     )
    //   );
    // };
    return [
      {
        Header: "Date",
        accessor: "date",
        width: 280,
        Cell: (item: any) =>
          item ? (
            <div
              style={{
                paddingBottom: 8,
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={() => {
                console.log(item);
                setCart(
                  (sales || []).filter(
                    (s: SaleObject) => s?.id === item?.row?.original?.id
                  )[0]
                );
                setShowSaleScreen(true);
              }}
            >
              {fDateTime(item?.value)}
            </div>
          ) : (
            ""
          ),
        sortType: (rowA: any, rowB: any, columnId: any) => {
          const a = rowA?.original[columnId];
          const b = rowB?.original[columnId];
          return a > b ? 1 : b > a ? -1 : 0;
        },
      },
      {
        Header: "Status",
        accessor: "status",
        width: 100,
      },
      {
        Header: "Contact",
        accessor: "contact",
        Cell: ({ value }) => value?.name || "",
      },
      {
        Header: "Clerk",
        accessor: "clerk",
        Cell: ({ value }) => value?.name || "",
        width: 80,
      },
      {
        Header: "Items",
        accessor: "items",
        width: 400,
      },
      {
        Header: "#",
        accessor: "numberOfItems",
        width: 30,
        // Footer: (info: any) => {
        //   const total = useMemo(
        //     () =>
        //       info.page.reduce(
        //         (sum:number, row:any) => row?.values?.numberOfItems || 0 + sum,
        //         0
        //       ),
        //     [info.page]
        //   );
        //
        //   return total;
        // },
      },
      {
        Header: "Store Cut",
        accessor: "store",
        Cell: ({ value }) =>
          value && !isNaN(value) ? `$${(value / 100).toFixed(2)}` : "N/A",
        // Footer: (info) => {
        //   const total = useMemo(
        //     () =>
        //       info.page.reduce(
        //         (sum, row) =>
        //           isNaN(get(row, "values.store", 0))
        //             ? sum
        //             : get(row, "values.store", 0) + sum,
        //         0
        //       ),
        //     [info.page]
        //   );
        //
        //   return <>${total.toFixed(2)}</>;
        // },
      },
      {
        Header: "Total Price",
        accessor: "sell",
        Cell: ({ value }) => (value ? `$${(value / 100).toFixed(2)}` : "N/A"),
        // Footer: (info) => {
        //   const total = useMemo(
        //     () =>
        //       info.page.reduce(
        //         (sum, row) =>
        //           isNaN(get(row, "values.sell", 0))
        //             ? sum
        //             : get(row, "values.sell", 0) + sum,
        //         0
        //       ),
        //     [info.page]
        //   );
        //
        //   return <>${total.toFixed(2)}</>;
        // },
      },
    ];
  }, [sales, saleItems, inventory]);

  return (
    <div className="flex relative overflow-x-hidden bg-white text-black">
      <div className="h-menu">
        <Table
          color="bg-col7"
          colorLight="bg-col7-light"
          colorDark="bg-col7-dark"
          data={data}
          columns={columns}
          heading={"Sales"}
          pageSize={20}
          sortOptions={[{ id: "date", desc: true }]}
        />
      </div>
      <div
        className={`absolute top-0 transition-offset duration-300 ${
          showSaleScreen ? "left-0" : "left-full"
        } h-full w-full bg-yellow-200 sm:h-menu`}
      >
        <SaleScreen />
      </div>
    </div>
  );
}

export default SalesScreen;
