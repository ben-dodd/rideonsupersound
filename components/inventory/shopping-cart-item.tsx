import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { useInventory } from "@/lib/swr-hooks";

import TextField from "@/components/inputs/text-field";
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
  const [expanded, setExpanded] = useState(false);

  function onChangeCart(e: any, property: string) {
    setCart({
      ...cart,
      items: {
        ...cart?.items,
        [id]: { ...cart?.items[id], [property]: e.target.value },
      },
    });
  }

  return (
    <>
      <div
        className="flex w-full bg-black border-b border-white text-white relative"
        onClick={() => setExpanded((e) => !e)}
      >
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
      <div
        className={`bg-white overflow-y-hidden transition-height duration-200 ${
          expanded ? "h-32" : "h-0"
        }`}
      >
        <div>
          <div className="flex justify-between">
            <TextField
              className="mx-2"
              inputLabel="QTY"
              selectOnFocus
              min={1}
              inputType="number"
              valueNum={cartItem?.cart_quantity}
              onChange={(e: any) => onChangeCart(e, "cart_quantity")}
            />
            <TextField
              inputLabel="VEND. DISC."
              selectOnFocus
              max={100}
              inputType="number"
              endAdornment="%"
              valueNum={cartItem?.vendor_discount}
              onChange={(e: any) => onChangeCart(e, "vendor_discount")}
            />
            <TextField
              className="mx-2"
              inputLabel="STORE DISC."
              selectOnFocus
              max={100}
              inputType="number"
              endAdornment="%"
              valueNum={cartItem?.store_discount}
              onChange={(e: any) => onChangeCart(e, "store_discount")}
            />
          </div>
        </div>
      </div>
    </>
  );
}
