// Packages
import { useMemo } from "react";
import { useAtom } from "jotai";

// DB
import {
  useSales,
  useSaleItems,
  useContacts,
  useClerks,
  useInventory,
} from "@/lib/swr-hooks";
import { viewAtom, loadedSaleObjectAtom } from "@/lib/atoms";
import {
  SaleObject,
  SaleItemObject,
  ContactObject,
  ClerkObject,
} from "@/lib/types";

// Functions
import {
  writeItemList,
  getTotalStoreCut,
  getTotalPrice,
  nzDate,
  fDateTime,
} from "@/lib/data-functions";

// Components
import Table from "@/components/table";
import TableContainer from "@/components/container/table";

export default function SaleTable() {
  // SWR
  const { sales, isSalesLoading } = useSales();
  const { saleItems, isSaleItemsLoading } = useSaleItems();
  const { inventory, isInventoryLoading } = useInventory();
  const { contacts, isContactsLoading } = useContacts();
  const { clerks, isClerksLoading } = useClerks();

  // Atoms
  const [view, setView] = useAtom(viewAtom);
  const [, setLoadedSale] = useAtom(loadedSaleObjectAtom);

  // Constants
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
          store: getTotalStoreCut(items, inventory),
          sell: getTotalPrice(items, inventory),
        };
      }),
    [sales, saleItems, contacts, clerks, inventory]
  );
  const columns = useMemo(() => {
    return [
      { Header: "ID", accessor: "id", width: 70 },
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
                setLoadedSale(
                  (sales || []).filter(
                    (s: SaleObject) => s?.id === item?.row?.original?.id
                  )[0]
                );
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
        width: 120,
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
        Header: "Contact",
        accessor: "contact",
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
  }, [sales, saleItems, inventory]);

  return (
    <TableContainer
      loading={
        isSalesLoading ||
        isClerksLoading ||
        isInventoryLoading ||
        isSaleItemsLoading ||
        isContactsLoading
      }
    >
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
    </TableContainer>
  );
}
