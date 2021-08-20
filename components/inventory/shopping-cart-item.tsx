import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { useInventory } from "@/lib/swr-hooks";

import TextField from "@/components/inputs/text-field";
import DeleteIcon from "@material-ui/icons/Delete";
import { InventoryObject, CartItem } from "@/lib/types";
import { cartAtom } from "@/lib/atoms";
import {
  getItemSku,
  getItemTitle,
  getCartItemSummary,
  getItemPrice,
} from "@/lib/data-functions";

type ShoppingCartItemProps = {
  id: string;
  cartItem: CartItem;
  deleteCartItem: Function;
};

export default function ShoppingCartItem({
  id,
  cartItem,
  deleteCartItem,
}: ShoppingCartItemProps) {
  const { inventory } = useInventory();
  const [cart, setCart] = useAtom(cartAtom);
  const [item, setItem] = useState(null);
  useEffect(() => {
    setItem(inventory.filter((i: InventoryObject) => i.id === parseInt(id))[0]);
  }, [inventory]);
  const [expanded, setExpanded] = useState(false);

  function onChangeCart(e: any, property: string) {
    console.log(e);
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
        className="flex w-full bg-black text-white relative pt"
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
        className={`text-black bg-white px-2 overflow-y-hidden transition-height duration-200 ${
          expanded ? "h-64" : "h-0"
        }`}
      >
        <div>
          {!item?.is_gift_card && !item?.is_misc_item && (
            <div className="flex justify-between items-end">
              <TextField
                className="w-1/3"
                inputLabel="QTY"
                selectOnFocus
                min={1}
                inputType="number"
                valueNum={cartItem?.cart_quantity}
                onChange={(e: any) => onChangeCart(e, "cart_quantity")}
              />
              <TextField
                className="mx-2 w-1/3"
                inputLabel="VEND. DISC."
                selectOnFocus
                max={100}
                inputType="number"
                endAdornment="%"
                valueNum={cartItem?.vendor_discount}
                onChange={(e: any) => onChangeCart(e, "vendor_discount")}
              />
              <TextField
                className="w-1/3"
                inputLabel="STORE DISC."
                selectOnFocus
                max={100}
                inputType="number"
                endAdornment="%"
                valueNum={cartItem?.store_discount}
                onChange={(e: any) => onChangeCart(e, "store_discount")}
              />
            </div>
          )}
          <TextField
            multiline
            rows={2}
            divClass="py-2"
            inputLabel="NOTES"
            value={cartItem?.note ?? ""}
            onChange={(e: any) => onChangeCart(e, "note")}
          />
          <div className="flex w-full justify-between place-start">
            <div className="font-bold">
              {writeCartItemPriceBreakdown(item, cartItem)}
            </div>
            <div>
              <div className="font-bold self-center">
                {writeCartItemPriceTotal(item, cartItem)}
              </div>
              <div className="w-50 text-right">
                <button
                  className="py-2 text-tertiary hover:text-tertiary-dark"
                  onClick={() => deleteCartItem(id)}
                >
                  <DeleteIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function writeCartItemPriceBreakdown(
  item: InventoryObject,
  cartItem: CartItem
) {
  return cartItem?.is_gift_card
    ? cartItem?.gift_card_code
    : cartItem?.is_misc_item
    ? cartItem?.misc_item_description
    : getCartItemSummary(item, cartItem);
}

function writeCartItemPriceTotal(item: any, cartItem: any) {
  return cartItem?.is_gift_card
    ? `$${(cartItem?.gift_card_amount / 100).toFixed(2)}`
    : cartItem?.is_misc_item
    ? `$${(cartItem?.misc_item_amount / 100).toFixed(2)}`
    : `$${(getItemPrice(item, cartItem) / 100).toFixed(2)}`;
}
