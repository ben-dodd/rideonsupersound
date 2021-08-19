import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { useInventory } from "@/lib/swr-hooks";

import { CartItem } from "@/lib/types";
import { cartAtom } from "@/lib/atoms";
import {
  getItemSku,
  getItemTitle,
  getCartItemSummary,
} from "@/lib/data-functions";

type ShoppingCartItemProps = {
  id: string;
  cartItem: CartItem;
};

export default function SellItem({ id, cartItem }: ShoppingCartItemProps) {
  const { inventory } = useInventory();
  const [cart, setCart] = useAtom(cartAtom);
  const [item, setItem] = useState(null);
  useEffect(() => {
    setItem(inventory.filter((i) => i.id === parseInt(id))[0]);
  }, [inventory]);

  return (
    <div className="flex w-full bg-black border-b border-white text-white relative">
      <img
        className="w-20 h-20"
        src={item?.image_url || "/img/default.png"}
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
