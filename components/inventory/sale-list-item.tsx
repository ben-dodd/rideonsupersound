import { useInventory } from "@/lib/swr-hooks";

import { InventoryObject, CartItem } from "@/lib/types";
import { getItemSku } from "@/lib/data-functions";

interface SaleListItemProps {
  id: string;
  cartItem: CartItem;
}

export default function SaleListItem({ id, cartItem }: SaleListItemProps) {
  const { inventory } = useInventory();
  const item = inventory.filter(
    (i: InventoryObject) => i.id === parseInt(id)
  )[0];
  return (
    <div className="flex w-full mb-2 bg-blue-100 relative">
      <div className="absolute w-32 h-8 bg-opacity-50 bg-black text-white flex justify-center items-center">
        {getItemSku(item)}
      </div>
      <img
        className="w-32 h-32"
        src={item?.image_url || "/img/default.png"}
        alt={item?.title || "Inventory image"}
      />
      <div className="flex flex-col justify-between pl-2 w-full">
        <div>
          <div className="font-bold text-sm">{`${
            item?.title || "Untitled"
          }`}</div>
          <div className="text-sm border-b border-gray-400">{`${
            item?.artist || "Untitled"
          }`}</div>
          <div className="text-xs">{`${item?.genre ? `${item.genre} / ` : ""}${
            item?.format
          } [${
            item?.is_new ? "NEW" : item?.cond?.toUpperCase() || "USED"
          }]`}</div>
        </div>
        <div className="text-xs">
          {`${item?.vendor_name ? `Selling for ${item?.vendor_name}` : ""}`}
        </div>
        <div className="flex justify-between items-end">
          <div className="text-md">{`${item?.quantity} in stock`}</div>
          <div className="text-xl">{`$${((item?.total_sell || 0) / 100).toFixed(
            2
          )}`}</div>
        </div>
      </div>
    </div>
  );
}
