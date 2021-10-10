import ListItem from "./list-item";
import GiftCardItem from "./gift-card-item";
import MiscItem from "./misc-item";

import { useInventory } from "@/lib/swr-hooks";
import { useAtom } from "jotai";
import { sellSearchBarAtom } from "@/lib/atoms";
import { InventoryObject } from "@/lib/types";
import { filterInventory } from "@/lib/data-functions";

export default function InventoryScroll() {
  const [search] = useAtom(sellSearchBarAtom);
  const { inventory, isInventoryLoading } = useInventory();

  return (
    <div className="h-inventory overflow-y-scroll px-2">
      {isInventoryLoading ? (
        <div className="w-full flex h-full">
          <div className="loading-icon" />
        </div>
      ) : search ? (
        <>
          {"gift card".includes(search) && <GiftCardItem />}
          {"misc item".includes(search) && <MiscItem />}
          {filterInventory({ inventory, search }).map(
            (item: InventoryObject) => (
              <ListItem item={item} key={item?.id} />
            )
          )}
        </>
      ) : (
        <div className="text-sm">Use the search bar to find an item...</div>
      )}
    </div>
  );
}
