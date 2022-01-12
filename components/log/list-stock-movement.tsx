// DB
import { getItemSkuDisplayName } from "@/lib/data-functions";
import { useClerks, useInventory } from "@/lib/swr-hooks";
import { LogObject, ClerkObject, StockMovementObject } from "@/lib/types";

type ListItemProps = {
  sm: StockMovementObject;
};

export default function ListStockMovement({ sm }: ListItemProps) {
  // SWR
  const { clerks } = useClerks();
  const { inventory } = useInventory();

  return (
    <div className="flex w-full border-b border-yellow-100 py-1 font-mono text-xs text-black">
      <div className="flex flex-col sm:flex-row w-full justify-between">
        <div className="flex flex-col sm:flex-row">
          <div className="font-bold pr-4 text-pink-600">{sm?.date_moved}</div>
          <div className="font-bold w-16 text-blue-800">
            {
              clerks?.filter((c: ClerkObject) => c?.id === sm?.clerk_id)[0]
                ?.name
            }
          </div>
          <div className="uppercase pr-4">{sm?.act}</div>
          <div>{getItemSkuDisplayName(sm?.stock_id, inventory)}</div>
        </div>
      </div>
    </div>
  );
}
