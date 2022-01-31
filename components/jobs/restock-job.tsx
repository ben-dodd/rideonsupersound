// DB
import { useInventory } from "@/lib/swr-hooks";
import { StockObject } from "@/lib/types";
import { getItemSkuDisplayNameById } from "@/lib/data-functions";
import { completeRestockTask } from "@/lib/db-functions";

type ListItemProps = {
  item: StockObject;
};

export default function RestockJob({ item }: ListItemProps) {
  // SWR
  const { inventory, mutateInventory } = useInventory();

  return (
    <div className={`flex w-full border-b border-yellow-100 py-1 text-sm`}>
      <div className="flex flex-col sm:flex-row w-full justify-between">
        <div className="flex flex-col sm:flex-row w-3/5">
          <div className="mx-2">
            <input
              className="cursor-pointer"
              type="checkbox"
              onChange={() => {
                const otherInventoryItems = inventory?.filter(
                  (i: StockObject) => i?.id !== item?.id
                );
                mutateInventory([
                  ...otherInventoryItems,
                  { ...item, needs_restock: false },
                ]);
                completeRestockTask(item?.id);
              }}
            />
          </div>
          <div>{getItemSkuDisplayNameById(item?.id, inventory)}</div>
        </div>
      </div>
    </div>
  );
}
