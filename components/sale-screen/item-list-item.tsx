// Packages
import { useState, useEffect } from "react";
import { useAtom } from "jotai";

// DB
import { useInventory, useLogs, useSaleItemsForSale } from "@/lib/swr-hooks";
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
  const [sale, setSale] = useAtom(
    isNew ? newSaleObjectAtom : loadedSaleObjectAtom
  );
  const [, setAlert] = useAtom(alertAtom);
  const [clerk] = useAtom(clerkAtom);

  // SWR
  const { inventory } = useInventory();
  const { mutateLogs } = useLogs();
  const { items } = useSaleItemsForSale(sale?.id);

  // State
  const [item, setItem] = useState(null);

  // Load
  useEffect(() => {
    setItem(
      inventory.filter((i: InventoryObject) => i.id === saleItem?.item_id)[0]
    );
  }, [inventory]);

  // Functions
  async function deleteOrRefundItem(id: number, is_refund: boolean) {
    let saleItem: SaleItemObject =
      items?.filter((i: SaleItemObject) => i?.id === id)[0] || {};
    saleItem.is_refunded = true;
    is_refund
      ? updateSaleItemInDatabase(saleItem, sale)
      : deleteSaleItemFromDatabase(id);
    // if ((cart?.items || []).length < 1) {
    //   // No items left, delete cart
    //   setView({ ...view, cart: false });
    //   // TODO Any transactions need to be refunded.
    //   deleteSaleFromDatabase(cart?.id);
    // }
    saveLog(
      {
        log: `${getItemDisplayName(
          inventory?.filter((i: InventoryObject) => i?.id === id)[0]
        )} ${is_refund ? "refunded" : "removed from sale"}${
          id ? ` (sale #${id})` : ""
        }.`,
        clerk_id: clerk?.id,
      },
      mutateLogs
    );
    setAlert({
      open: true,
      type: "success",
      message: is_refund ? `ITEM REFUNDED` : `ITEM REMOVED FROM SALE`,
    });
    // setRefresh(refresh + 1);
  }

  // TODO remove items or refund items if complete
  // TODO make items drop down for editing, like in shopping cart

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
          <div className="absolute w-20 h-8 bg-opacity-50 bg-black text-white text-sm flex justify-center items-center">
            {getItemSku(item)}
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full p-2 justify-between">
        <div className="text-sm pl-1">
          {item?.is_gift_card
            ? item?.gift_card_code
            : item?.is_misc_item
            ? item?.misc_item_description
            : getItemDisplayName(item)}
        </div>
        <div className="text-red-500 self-end flex flex-col">
          <div>{getCartItemSummary(item, saleItem)}</div>
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
        </div>
      </div>
    </div>
  );
}
