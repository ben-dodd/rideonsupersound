import { useState, useEffect } from "react";
import { useInventory } from "@/lib/swr-hooks";

import { InventoryObject, CartItem } from "@/lib/types";
import {
  getItemSku,
  getItemTitle,
  getCartItemSummary,
} from "@/lib/data-functions";

type SellListItemProps = {
  id: string;
  cartItem: CartItem;
};

export default function SellListItem({ id, cartItem }: SellListItemProps) {
  const { inventory } = useInventory();
  const [item, setItem] = useState(null);
  useEffect(() => {
    setItem(inventory.filter((i: InventoryObject) => i.id === parseInt(id))[0]);
  }, [inventory]);

  return (
    <div className="flex w-full bg-blue-100 text-black relative pt">
      <img
        className="w-20 h-20"
        src={
          cartItem?.is_gift_card
            ? "/img/giftCard.png"
            : item?.image_url || "/img/default.png"
        }
        alt={item?.title || "Inventory image"}
      />
      <div className="absolute w-20 h-8 bg-opacity-50 bg-black text-white flex justify-center items-center text-sm">
        {getItemSku(item)}
      </div>
      <div className="flex flex-col w-full p-2 justify-between">
        <div className="text-xs pl-1">
          {cartItem?.is_gift_card
            ? id
            : cartItem?.is_misc_item
            ? cartItem?.misc_item_description
            : getItemTitle(item)}
        </div>
        <div className="text-red-500 self-end">
          {getCartItemSummary(item, cartItem)}
        </div>
      </div>
    </div>
  );
}
