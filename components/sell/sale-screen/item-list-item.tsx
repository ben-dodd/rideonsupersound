import { useState, useEffect } from "react";
import { useInventory } from "@/lib/swr-hooks";
import Image from "next/image";

import { InventoryObject, SaleItemObject } from "@/lib/types";
import {
  getItemSku,
  getItemTitle,
  getCartItemSummary,
  getImageSrc,
} from "@/lib/data-functions";

type SellListItemProps = {
  cartItem: SaleItemObject;
};

export default function ItemListItem({ cartItem }: SellListItemProps) {
  const { inventory } = useInventory();
  const [item, setItem] = useState(null);
  useEffect(() => {
    setItem(
      inventory.filter((i: InventoryObject) => i.id === cartItem?.item_id)[0]
    );
  }, [inventory]);

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
            : getItemTitle(item)}
        </div>
        <div className="text-red-500 self-end">
          {getCartItemSummary(item, cartItem)}
        </div>
      </div>
    </div>
  );
}
