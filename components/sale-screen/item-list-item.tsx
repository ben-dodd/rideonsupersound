// Packages
import { useState, useEffect } from "react";
import { useAtom } from "jotai";

// DB
import {
  useSaleInventory,
  useSaleItemsForSale,
  useLogs,
} from "@/lib/swr-hooks";
import {
  newSaleObjectAtom,
  loadedSaleObjectAtom,
  alertAtom,
  clerkAtom,
} from "@/lib/atoms";
import { InventoryObject, SaleItemObject } from "@/lib/types";

// Functions
import {
  getItemSku,
  getItemDisplayName,
  getCartItemSummary,
  getImageSrc,
} from "@/lib/data-functions";
import {
  updateSaleItemInDatabase,
  saveLog,
  deleteSaleItemFromDatabase,
} from "@/lib/db-functions";

// Components
import Image from "next/image";
import Tooltip from "@mui/material/Tooltip";

// Icons
import DeleteIcon from "@mui/icons-material/Delete";
import RefundIcon from "@mui/icons-material/Rotate90DegreesCcw";

type SellListItemProps = {
  saleItem: SaleItemObject;
  isNew: boolean;
};

export default function ItemListItem({ saleItem, isNew }: SellListItemProps) {
  // Atoms
  const [sale] = useAtom(isNew ? newSaleObjectAtom : loadedSaleObjectAtom);
  const [, setAlert] = useAtom(alertAtom);
  const [clerk] = useAtom(clerkAtom);

  // SWR
  const { saleInventory } = useSaleInventory();
  const { items } = useSaleItemsForSale(sale?.id);
  const { logs, mutateLogs } = useLogs();

  // State
  const [item, setItem] = useState(null);

  // Load
  useEffect(() => {
    setItem(
      saleInventory?.filter(
        (i: InventoryObject) => i.id === saleItem?.item_id
      )[0]
    );
  }, [saleInventory]);

  // Functions
  async function deleteOrRefundItem(id: number, is_refund: boolean) {
    let saleItem: SaleItemObject =
      items?.filter((i: SaleItemObject) => i?.id === id)[0] || {};
    saleItem.is_refunded = true;
    is_refund
      ? updateSaleItemInDatabase({ ...saleItem, sale_id: sale?.id })
      : deleteSaleItemFromDatabase(id);
    // if (cart?.items?.length < 1) {
    //   // No items left, delete cart
    //   setView({ ...view, cart: false });
    //   // TODO Any transactions need to be refunded.
    //   deleteSaleFromDatabase(cart?.id);
    // }
    saveLog(
      {
        log: `${getItemDisplayName(
          saleInventory?.filter((i: InventoryObject) => i?.id === id)[0]
        )} ${is_refund ? "refunded" : "removed from sale"}${
          id ? ` (sale #${id})` : ""
        }.`,
        clerk_id: clerk?.id,
      },
      logs,
      mutateLogs
    );
    setAlert({
      open: true,
      type: "success",
      message: is_refund ? `ITEM REFUNDED` : `ITEM REMOVED FROM SALE`,
    });
    // setRefresh(refresh + 1);
  }

  console.log(item);
  console.log(saleItem);

  return (
    <div className="flex w-full relative pt mb-2">
      <div className="w-20">
        <div className="w-20 h-20 relative">
          <Image
            layout="fill"
            objectFit="cover"
            src={getImageSrc(item)}
            alt={item?.title || "Inventory image"}
          />
          {!item?.is_gift_card && !item?.is_misc_item && (
            <div className="absolute w-20 h-8 bg-opacity-50 bg-black text-white text-sm flex justify-center items-center">
              {getItemSku(item)}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col w-full p-2 justify-between">
        <div className="text-sm pl-1">{getItemDisplayName(item)}</div>
        <div className="text-red-500 self-end">
          <div>{getCartItemSummary(item, saleItem)}</div>
        </div>
        {/*<div className="text-red-500 self-end flex flex-col">
          <Tooltip
            title={sale?.state === "completed" ? "Refund item" : "Delete item"}
          >
            <button
              className="py-2 text-tertiary hover:text-tertiary-dark self-end"
              onClick={() =>
                deleteOrRefundItem(item, sale?.state === "completed")
              }
            >
              {sale?.state === "completed" ? <RefundIcon /> : <DeleteIcon />}
            </button>
          </Tooltip>
        </div>*/}
      </div>
    </div>
  );
}
