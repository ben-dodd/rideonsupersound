import SellItem from "@/components/inventory/sell-item";
import GiftCardItem from "@/components/inventory/gift-card-item";
import MiscItem from "@/components/inventory/misc-item";

import { useInventory } from "@/lib/swr-hooks";
import { useAtom } from "jotai";
import { sellSearchBarAtom } from "@/lib/atoms";
import { InventoryObject } from "@/lib/types";
import { filterInventory } from "@/lib/data-functions";

export default function InventoryScroll() {
  const [search] = useAtom(sellSearchBarAtom);
  const { inventory, isLoading } = useInventory();

  return (
    <div className="h-inventory overflow-y-scroll px-2">
      {isLoading ? (
        <div className="w-full flex h-full">
          <div className="loading-icon" />
        </div>
      ) : search ? (
        <>
          {"gift card".includes(search) && <GiftCardItem />}
          {"misc item".includes(search) && <MiscItem />}
          {filterInventory({ inventory, search }).map(
            (item: InventoryObject) => (
              <SellItem item={item} key={item?.id} />
            )
          )}
        </>
      ) : (
        <div className="text-sm">Use the search bar to find an item...</div>
      )}
    </div>
  );
}
