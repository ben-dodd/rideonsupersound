// Packages
import { useMemo } from "react";
import { useAtom } from "jotai";

// DB
import {
  useSales,
  useCustomers,
  useClerks,
  useInventory,
} from "@/lib/swr-hooks";
import { loadedSaleIdAtom, pageAtom } from "@/lib/atoms";
import {
  SaleObject,
  CustomerObject,
  ClerkObject,
  SaleStateTypes,
} from "@/lib/types";

// Components
import Table from "@/components/_components/table";
import TableContainer from "@/components/_components/container/table";
import dayjs from "dayjs";

export default function LaybyTable() {
  // SWR
  const { sales, isSalesLoading } = useSales();
  // const { saleItems, isSaleItemsLoading } = useSaleItems();
  const { inventory, isInventoryLoading } = useInventory();
  const { customers, isCustomersLoading } = useCustomers();
  const { clerks, isClerksLoading } = useClerks();

  // Atoms
  // const [view, setView] = useAtom(viewAtom);
  const [page] = useAtom(pageAtom);
  const [loadedSaleId, setLoadedSaleId] = useAtom(loadedSaleIdAtom);

  // Constants
  const data = useMemo(
    () =>
      sales
        ?.filter((s: SaleObject) => s?.state === SaleStateTypes.Layby)
        ?.map((s: SaleObject) => {
          // const items = saleItems?.filter(
          //   (i: SaleItemObject) => i?.sale_id === s?.id
          // );
          // s = { ...s, items };
          return {
            id: s?.id,
            date: s?.date_sale_opened,
            customer: customers?.filter(
              (c: CustomerObject) => c?.id === s?.customer_id
            )[0],
            clerk: clerks?.filter(
              (c: ClerkObject) => c?.id === s?.sale_opened_by
            )[0],
            numberOfItems: s?.number_of_items,
            items: s?.item_list,
            store: s?.store_cut,
            sell: s?.total_price,
            // numberOfItems: items?.reduce(
            //   (accumulator: number, item: SaleItemObject) =>
            //     accumulator + parseInt(item?.quantity) || 1,
            //   0
            // ),
            // items: writeItemList(inventory, items),
            // store: getTotalCurrentStoreCut(items, inventory),
            // sell: getTotalCurrentPrice(items, inventory),
          };
        }),
    [sales, customers, clerks, inventory]
  );
  const columns = useMemo(() => {
    return [
      { Header: "ID", accessor: "id", width: 70 },
      {
        Header: "Date Started",
        accessor: "date",
        width: 280,
        Cell: (item: any) =>
          item ? (
            <div
              className="pb-2 cursor-pointer underline"
              onClick={() =>
                setLoadedSaleId({
                  ...loadedSaleId,
                  [page]: item?.row?.original?.id,
                })
              }
            >
              {dayjs(item?.value).format("D MMMM YYYY, h:mm A")}
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
        Header: "Clerk",
        accessor: "clerk",
        Cell: ({ value }) => value?.name || "",
        width: 90,
      },
      {
        Header: "Store Cut",
        accessor: "store",
        width: 120,
        Cell: ({ value }) =>
          value && !isNaN(value) ? `$${(value / 100)?.toFixed(2)}` : "N/A",
      },
      {
        Header: "Total Price",
        accessor: "sell",
        width: 120,
        Cell: ({ value }) => (value ? `$${(value / 100)?.toFixed(2)}` : "N/A"),
      },
      {
        Header: "Customer",
        accessor: "customer",
        Cell: ({ value }) => value?.name || "",
      },
      {
        Header: "#",
        accessor: "numberOfItems",
        width: 30,
      },
      {
        Header: "Items",
        accessor: "items",
        width: 400,
      },
    ];
  }, [sales, inventory]);

  return (
    <TableContainer
      loading={
        isSalesLoading ||
        isClerksLoading ||
        isInventoryLoading ||
        isCustomersLoading
      }
    >
      <Table
        color="bg-col6"
        colorLight="bg-col6-light"
        colorDark="bg-col6-dark"
        data={data}
        columns={columns}
        heading={"Laybys"}
        pageSize={20}
        sortOptions={[{ id: "date", desc: true }]}
      />
    </TableContainer>
  );
}
