// Packages
import { useMemo } from "react";
import { useAtom } from "jotai";

// DB
import { useStockInventory, useVendors } from "@/lib/swr-hooks";
import { loadedItemIdAtom } from "@/lib/atoms";
import { InventoryObject, VendorObject } from "@/lib/types";

// Functions
import { getItemSku } from "@/lib/data-functions";

// Components
import Table from "@/components/table";
import TableContainer from "@/components/container/table";

interface NumberProps {
  value: number;
}

export default function InventoryTable() {
  // SWR
  const { inventory, isInventoryLoading } = useStockInventory();
  const { vendors, isVendorsLoading } = useVendors();

  // Atoms
  const [loadedItemId, setLoadedItemId] = useAtom(loadedItemIdAtom);

  // Constants
  const data = useMemo(
    () =>
      inventory
        ?.filter((t: InventoryObject) => !t?.is_deleted)
        .map((t: InventoryObject) => ({
          id: t?.id,
          sku: getItemSku(t),
          title: t?.title || "-",
          artist: t?.artist || "-",
          vendor: vendors?.filter(
            (v: VendorObject) => v?.id === t?.vendor_id
          )[0]?.name,
          genre: t?.genre || "-",
          media: t?.media || "-",
          format: t?.format || "-",
          cost: t?.vendor_cut ? t?.vendor_cut / 100 : 0,
          store:
            t?.vendor_cut && t?.total_sell
              ? (t.total_sell - t.vendor_cut) / 100
              : 0,
          sell: t?.total_sell ? t?.total_sell / 100 : 0,
          profitMargin:
            t?.total_sell && t?.vendor_cut && t?.total_sell > 0
              ? ((t?.total_sell - t?.vendor_cut) / t?.total_sell) * 100
              : 0,
          quantity: t?.quantity || 0,
          quantityReceived: t?.quantity_received || 0,
          quantityHoldLayby:
            (t?.quantity_layby +
              t?.quantity_hold +
              t?.quantity_unlayby +
              t?.quantity_unhold) *
              -1 || 0,
          quantityReturned: Math.abs(t?.quantity_returned || 0),
          quantitySold: Math.abs(t?.quantity_sold || 0),
        })),
    [inventory, vendors]
  );
  const columns = useMemo(() => {
    // const openInventoryDialog = (item:any) => openInventoryModal(item?.row?.original?.id);
    return [
      {
        accessor: "sku",
        Header: "SKU",
        width: 120,
        Cell: (params: any) => (
          <span
            className="cursor-pointer underline"
            onClick={() =>
              setLoadedItemId({
                ...loadedItemId,
                inventory: params?.row?.original?.id,
              })
            }
          >
            {params?.value}
          </span>
        ),
      },
      {
        accessor: "title",
        Header: "Title",
        width: 170,
      },
      {
        accessor: "artist",
        Header: "Artist",
        width: 170,
      },
      {
        accessor: "vendor",
        Header: "Vendor",
        width: 150,
      },
      {
        accessor: "genre",
        Header: "Genre",
        width: 100,
      },
      {
        accessor: "media",
        Header: "Media Type",
        width: 70,
      },
      {
        accessor: "format",
        Header: "Format",
        width: 100,
      },
      {
        accessor: "sell",
        Header: "Sell",
        width: 90,
        Cell: ({ value }: NumberProps) =>
          value && !isNaN(value) ? `$${value?.toFixed(2)}` : "-",
      },
      // {
      //   accessor: "profitMargin",
      //   Header: "Margin",
      //   width: 80,
      //   Cell: ({ value }: NumberProps) =>
      //     value && !isNaN(value) ? `${value?.toFixed(1)}%` : "-",
      // },
      {
        accessor: "quantity",
        Header: "QTY",
        width: 53,
      },
      // {
      //   accessor: "quantityReceived",
      //   Header: "REC",
      //   width: 53,
      // },
      {
        accessor: "quantityHoldLayby",
        Header: "H/L",
        width: 53,
      },
      // {
      //   accessor: "quantityReturned",
      //   Header: "RET",
      //   width: 53,
      // },
      {
        accessor: "quantitySold",
        Header: "SOLD",
        width: 64,
      },
    ];
  }, [inventory]);

  return (
    <TableContainer loading={isVendorsLoading || isInventoryLoading}>
      <Table
        color="bg-col2"
        colorLight="bg-col2-light"
        colorDark="bg-col2-dark"
        data={data}
        columns={columns}
        heading={"Inventory List"}
        pageSize={20}
        sortOptions={[{ id: "title", desc: false }]}
      />
    </TableContainer>
  );
}
