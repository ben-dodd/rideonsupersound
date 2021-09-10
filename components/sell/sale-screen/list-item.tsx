import { useState, useEffect } from "react";
import { useInventory } from "@/lib/swr-hooks";

import { InventoryObject, SaleItemObject } from "@/lib/types";
import {
  getItemSku,
  getItemTitle,
  getCartItemSummary,
} from "@/lib/data-functions";

type SellListItemProps = {
  cartItem: SaleItemObject;
};

export default function SellListItem({ cartItem }: SellListItemProps) {
  const { inventory } = useInventory();
  const [item, setItem] = useState(null);
  useEffect(() => {
    setItem(
      inventory.filter((i: InventoryObject) => i.id === cartItem?.item_id)[0]
    );
  }, [inventory]);

  return (
    <div className="flex w-full bg-blue-100 text-black relative pt">
      <img
        className="w-20 h-20"
        src={
          item?.is_gift_card
            ? "/img/giftCard.png"
            : item?.image_url || "/img/default.png"
        }
        alt={item?.title || "Inventory image"}
      />
      <div className="absolute w-20 h-8 bg-opacity-50 bg-black text-white flex justify-center items-center text-sm">
        {getItemSku(item)}
      </div>
      <div className="flex flex-col w-full p-2 justify-between">
        <div className="text-xs pl-1">{getItemTitle(item)}</div>
        <div className="text-red-500 self-end">
          {getCartItemSummary(item, cartItem)}
        </div>
      </div>
    </div>
  );
}
