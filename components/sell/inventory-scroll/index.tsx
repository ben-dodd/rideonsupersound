// Packages
import { useState, useEffect } from "react";
import { useAtom } from "jotai";

// DB
import { useInventory } from "@/lib/swr-hooks";
import { sellSearchBarAtom } from "@/lib/atoms";
import { StockObject } from "@/lib/types";

// Functions
import { filterInventory } from "@/lib/data-functions";

// Components
import ListItem from "./list-item";
import GiftCardItem from "./gift-card-item";
import MiscItem from "./misc-item";

export default function InventoryScroll() {
  // SWR
  const { inventory, isInventoryLoading } = useInventory();

  // Atoms
  const [search] = useAtom(sellSearchBarAtom);

  // State
  const [geolocation, setGeolocation] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by your browser");
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGeolocation(position?.coords);
        },
        () => console.log("Unable to retrieve location.")
      );
    }
  }, []);

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
            .sort((a: StockObject, b: StockObject) => {
              if (a?.quantity === b?.quantity) return 0;
              if (a?.quantity < 1) return 1;
              if (b?.quantity < 1) return -1;
              return 0;
            })
            .map((item: StockObject) => (
              <ListItem item={item} key={item?.id} geolocation={geolocation} />
            ))}
        </>
      ) : (
        <div className="text-sm">Use the search bar to find an item...</div>
      )}
    </div>
  );
}
