// Packages
import { useAtom } from "jotai";

// DB
import { useStockInventory } from "@/lib/swr-hooks";
import { sellSearchBarAtom } from "@/lib/atoms";
import { InventoryObject } from "@/lib/types";

// Functions
import { filterInventory } from "@/lib/data-functions";

// Components
import ListItem from "./list-item";
import GiftCardItem from "./gift-card-item";
import MiscItem from "./misc-item";

export default function InventoryScroll() {
  // SWR
  const { inventory, isInventoryLoading } = useStockInventory();

  // Atoms
  const [search] = useAtom(sellSearchBarAtom);

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
          {filterInventory({ inventory, search })
            .sort((a: InventoryObject, b: InventoryObject) => {
              if (a?.quantity === b?.quantity) return 0;
              if (a?.quantity < 1) return 1;
              if (b?.quantity < 1) return -1;
              return 0;
            })
            .map((item: InventoryObject) => (
              <ListItem item={item} key={item?.id} />
            ))}
        </>
      ) : (
        <div className="text-sm">Use the search bar to find an item...</div>
      )}
    </div>
  );
}
