import { useAtom } from "jotai";

// DB
import { useClerks, useJobs, useInventory } from "@/lib/swr-hooks";
import { InventoryObject } from "@/lib/types";
import { clerkAtom } from "@/lib/atoms";
import { getItemSkuDisplayName } from "@/lib/data-functions";
import { completeRestockTask } from "@/lib/db-functions";

type ListItemProps = {
  item: InventoryObject;
};

export default function ListTask({ item }: ListItemProps) {
  // SWR
  const { clerks } = useClerks();
  const { jobs, mutateJobs } = useJobs();
  const { inventory, mutateInventory } = useInventory();

  // Atoms
  const [clerk] = useAtom(clerkAtom);

  // State

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
                  (i: InventoryObject) => i?.id !== item?.id
                );
                mutateInventory([
                  ...otherInventoryItems,
                  { ...item, needs_restock: false },
                ]);
                completeRestockTask(item?.id);
              }}
            />
          </div>
          <div>{getItemSkuDisplayName(item?.id, inventory)}</div>
        </div>
      </div>
    </div>
  );
}
