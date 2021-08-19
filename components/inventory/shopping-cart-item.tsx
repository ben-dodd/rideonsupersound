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
  const [expanded, setExpanded] = useState(false);
  console.log(cart);

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
        <div className="flex justify-between">
          <div className="flex flex-col relative pt-2 m-2 w-1/4">
            <label className="text-xs absolute top-0 left-2 bg-white text-gray-500 font-extralight">
              QTY
            </label>
            <input
              className="appearance-none border border-gray-300 rounded px-2 hover:bg-gray-100"
              min={1}
              type="number"
              value={cartItem?.cart_quantity}
              onChange={(e) =>
                setCart({
                  ...cart,
                  items: {
                    ...cart?.items,
                    [id]: { ...cart?.items[id], cart_quantity: e.target.value },
                  },
                })
              }
            />
          </div>
          <div className="flex flex-col relative pt-2 m-2 w-1/4">
            <label className="text-xs absolute top-0 left-2 bg-white text-gray-500 font-extralight">
              VEND
            </label>
            <input
              className="appearance-none border border-gray-300 rounded px-2 hover:bg-gray-100"
              min={1}
              max={100}
              type="number"
              value={cartItem?.vendor_discount}
              onChange={(e) =>
                setCart({
                  ...cart,
                  items: {
                    ...cart?.items,
                    [id]: {
                      ...cart?.items[id],
                      vendor_discount: e.target.value,
                    },
                  },
                })
              }
            />
          </div>
          <div className="flex flex-col relative pt-2 m-2 w-1/4">
            <label className="text-xs absolute top-0 left-2 bg-white text-gray-500 font-extralight">
              STORE
            </label>
            <input
              className="appearance-none border border-gray-300 rounded px-2 hover:bg-gray-100"
              min={0}
              max={100}
              type="number"
              value={cartItem?.store_discount}
              onChange={(e) =>
                setCart({
                  ...cart,
                  items: {
                    ...cart?.items,
                    [id]: {
                      ...cart?.items[id],
                      store_discount: e.target.value,
                    },
                  },
                })
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}
