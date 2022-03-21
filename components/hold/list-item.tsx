import { useState, useEffect } from "react";
import { useInventory } from "@/lib/swr-hooks";

import { StockObject, SaleItemObject } from "@/lib/types";
import {
  getItemSku,
  getItemDisplayName,
  writeCartItemPriceBreakdown,
} from "@/lib/data-functions";

type HoldListItemProps = {
  cartItem: SaleItemObject;
};
export default function HoldListItem({ cartItem }: HoldListItemProps) {
  const { inventory } = useInventory();
  const [item, setItem] = useState(null);
  useEffect(() => {
    setItem(
      inventory?.filter((i: StockObject) => i.id === cartItem?.item_id)[0]
    );
  }, [inventory]);

  return (
    <div className="flex w-full bg-blue-100 text-black relative pt mb-2">
      <img
        className="w-20 h-20"
        src={
          item?.is_gift_card
            ? `${process.env.NEXT_PUBLIC_RESOURCE_URL}img/giftCard.png`
            : item?.image_url ||
              `${process.env.NEXT_PUBLIC_RESOURCE_URL}img/default.png`
        }
        alt={item?.title || "Inventory image"}
      />
      <div className="absolute w-20 h-8 bg-opacity-50 bg-black text-white flex justify-center items-center text-sm">
        {getItemSku(item)}
      </div>
      <div className="flex flex-col w-full p-2 justify-between">
        <div className="text-sm pl-1">{getItemDisplayName(item)}</div>
        <div className="text-red-500 self-end">
          {writeCartItemPriceBreakdown(item, cartItem)}
        </div>
      </div>
    </div>
  );
}
