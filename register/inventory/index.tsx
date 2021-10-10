import { useMemo } from "react";
import { useAtom } from "jotai";
import { useInventory, useVendors } from "@/lib/swr-hooks";
import { InventoryObject, VendorObject } from "@/lib/types";
import { showItemScreenAtom } from "@/lib/atoms";
import { getItemSku } from "@/lib/data-functions";
import InventoryItemScreen from "../inventory/inventory-item-screen";
import Table from "@/components/table";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridRenderCellParams,
} from "@mui/x-data-grid";

interface NumberProps {
  value: number;
}

export default function InventoryScreen() {
  const { inventory, isInventoryLoading } = useInventory();
  const { vendors, isVendorsLoading } = useVendors();
  const [showItemScreen, openInventoryModal] = useAtom(showItemScreenAtom);

  const data = useMemo(
    () =>
      (inventory || [])
        .filter((t: InventoryObject) => !t?.is_deleted)
        .map((t: InventoryObject) => ({
          id: t?.id,
          sku: getItemSku(t),
          title: t?.title || "-",
          artist: t?.artist || "-",
          vendor: (vendors || []).filter(
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
          quantity: 0,
          quantityReceived: 0,
          quantityHoldLayby: 0,
          quantityReturned: 0,
          quantitySold: 0,
        })),
    [inventory, vendors]
  );
  console.log(data);
  const columns = useMemo(() => {
    // const openInventoryDialog = (item:any) => openInventoryModal(item?.row?.original?.id);
    return [
      {
        accessor: "sku",
        Header: "SKU",
        width: 120,
        Cell: (params: GridRenderCellParams) => (
          <span
            className="cursor-pointer underline"
            onClick={() => openInventoryModal(params?.row?.original?.id)}
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
          value && !isNaN(value) ? `$${value.toFixed(2)}` : "-",
      },
      // {
      //   accessor: "profitMargin",
      //   Header: "Margin",
      //   width: 80,
      //   Cell: ({ value }: NumberProps) =>
      //     value && !isNaN(value) ? `${value.toFixed(1)}%` : "-",
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
    <div className="flex relative overflow-x-hidden bg-white text-black">
      <div className="h-menu">
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
      </div>
      <div
        className={`absolute top-0 transition-offset duration-300 ${
          showItemScreen ? "left-0" : "left-full"
        } h-full w-full bg-yellow-200`}
      >
        <InventoryItemScreen />
      </div>
    </div>
  );
}
