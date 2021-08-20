import { useAtom } from "jotai";
import { cartAtom } from "@/lib/atoms";

import SaleListItem from "@/components/inventory/sale-list-item";

export default function HoldScreen() {
  const [cart] = useAtom(cartAtom);
  return (
    <div className="flex flex-col h-menu px-2 bg-black text-white">
      <div className="flex justify-between mb-2 relative">
        <div className="text-lg my-2 tracking-wide self-center">Hold Items</div>
      </div>
      <div className="flex-grow overflow-x-hidden overflow-y-scroll">
        {Object.keys(cart?.items || {}).length > 0 ? (
          Object.entries(cart.items).map(([id, cartItem]) => (
            <SaleListItem id={id} cartItem={cartItem} />
          ))
        ) : (
          <div>No items</div>
        )}
      </div>
    </div>
  );
}
