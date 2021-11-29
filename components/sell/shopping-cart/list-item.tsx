// Packages
import { useState, useEffect } from "react";
import { useAtom } from "jotai";

// DB
import { useInventory, useStockItem, useGiftCards } from "@/lib/swr-hooks";
import { newSaleObjectAtom, confirmModalAtom } from "@/lib/atoms";
import { InventoryObject, SaleItemObject } from "@/lib/types";

// Functions
import {
  getItemSku,
  getItemDisplayName,
  getCartItemSummary,
  writeCartItemPriceTotal,
  writeCartItemPriceBreakdown,
  getImageSrc,
  getItemQuantity,
  writeIntegerAsWord,
} from "@/lib/data-functions";

// Components
import Image from "next/image";
import TextField from "@/components/_components/inputs/text-field";

// Icons
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowUp from "@mui/icons-material/ArrowDropUp";
import ArrowDown from "@mui/icons-material/ArrowDropDown";

type SellListItemProps = {
  index: number;
  cartItem: SaleItemObject;
  deleteCartItem?: Function;
};

export default function SellListItem({
  index,
  cartItem,
  deleteCartItem,
}: SellListItemProps) {
  // SWR
  const { inventory } = useInventory();
  const { stockItem } = useStockItem(cartItem?.item_id);

  // Atoms
  const [cart, setCart] = useAtom(newSaleObjectAtom);
  const [, setConfirmModal] = useAtom(confirmModalAtom);

  // State
  const [item, setItem] = useState(null);
  const [expanded, setExpanded] = useState(false);

  // Load
  useEffect(() => {
    setItem(
      inventory?.filter((i: InventoryObject) => i.id === cartItem?.item_id)[0]
    );
  }, [inventory]);

  // Functions
  function onChangeCart(e: any, property: string) {
    console.log(e?.target?.value);
    let newCart = { ...cart };
    if (newCart?.items && newCart?.items[index])
      newCart.items[index][property] = e.target.value;
    setCart(newCart);
  }

  function onChangeQuantity(e: any) {
    console.log(e?.target?.value);
    if (stockItem?.quantity < parseInt(e?.target?.value)) {
      console.log(e?.target?.value);
      const newQuantity = e?.target?.value;
      setConfirmModal({
        open: true,
        title: "Are you sure you want to add to cart?",
        styledMessage: (
          <span>
            There is not enough of <b>{getItemDisplayName(item)}</b> in stock.
            Are you sure you want to change the quantity to {e?.target?.value}?
          </span>
        ),
        yesText: "YES, I'M SURE",
        action: () =>
          onChangeCart({ target: { value: newQuantity } }, "quantity"),
      });
    } else onChangeCart(e, "quantity");
  }

  return (
    <>
      <div
        className="flex w-full bg-black text-white relative pt mb-2 cursor-pointer"
        onClick={() => setExpanded((e) => !e)}
      >
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
        <div className="flex flex-col w-full pt-2 px-2 justify-between">
          <div className="text-sm pl-1">{getItemDisplayName(item)}</div>
          <div className="text-red-500 self-end">
            {getCartItemSummary(item, cartItem)}
          </div>
          <div className="self-end text-xs">
            {expanded ? (
              <div>
                CLOSE PANEL
                <ArrowUp />
              </div>
            ) : (
              <div>
                CLICK TO EDIT ITEM
                <ArrowDown />
              </div>
            )}
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
                valueNum={parseInt(cartItem?.quantity)}
                onChange={(e: any) => onChangeQuantity(e)}
              />
              <TextField
                className="mx-2 w-1/3"
                inputLabel="VEND. DISC."
                selectOnFocus
                max={100}
                inputType="number"
                endAdornment="%"
                error={parseInt(cartItem?.vendor_discount) > 100}
                valueNum={parseInt(cartItem?.vendor_discount)}
                onChange={(e: any) => onChangeCart(e, "vendor_discount")}
              />
              <TextField
                className="w-1/3"
                inputLabel="STORE DISC."
                selectOnFocus
                max={100}
                inputType="number"
                endAdornment="%"
                error={parseInt(cartItem?.store_discount) > 100}
                valueNum={parseInt(cartItem?.store_discount)}
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
                  onClick={() => deleteCartItem(cartItem?.item_id)}
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
