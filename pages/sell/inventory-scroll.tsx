import SellItem from "@/components/inventory/sell-item";
import GiftCardItem from "@/components/inventory/gift-card-item";
import MiscItem from "@/components/inventory/misc-item";

import { useInventory } from "@/lib/swr-hooks";
import { useAtom } from "jotai";
import { sellSearchBarAtom } from "../api/atoms";
import { InventoryObject } from "../../types";

export default function InventoryScroll() {
  const [search] = useAtom(sellSearchBarAtom);
  const { inventory, isLoading } = useInventory();

  return (
    <div className="h-inventory overflow-scroll px-2">
      {isLoading ? (
        <div className="w-full flex h-full">
          <div className="loading-icon" />
        </div>
      ) : inventory ? (
        <>
          {search && "gift card".includes(search) && <GiftCardItem />}
          {search && "misc item".includes(search) && <MiscItem />}
          {inventory
            .sort((a: InventoryObject, b: InventoryObject) => {
              if (a?.quantity === b?.quantity) return 0;
              if (a?.quantity < 1) return 1;
              if (b?.quantity < 1) return -1;
              return 0;
            })
            .filter((item: InventoryObject) =>
              filterInventory({ item, search })
            )
            .slice(0, 50)
            .map((item: InventoryObject) => (
              <SellItem item={item} key={item?.id} />
            ))}
        </>
      ) : (
        <div />
      )}
    </div>
  );
}

function filterInventory({ item, search }) {
  let res = true;
  if (!search || search === "") return false;

  if (search) {
    let terms = search.split(" ");
    let itemMatch = `
      ${item?.sku || ""}
      ${item?.artist || ""}
      ${item?.title || ""}
      ${item?.format || ""}
      ${item?.genre || ""}
      ${item?.country || ""}
      ${item?.section || ""}
      ${item?.tags ? item?.tags?.join(" ") : ""}
      ${item?.vendor?.name || ""}
      ${item?.googleBooksItem?.volumeInfo?.authors?.join(" ") || ""}
      ${item?.googleBooksItem?.volumeInfo?.publisher || ""}
      ${item?.googleBooksItem?.volumeInfo?.subtitle || ""}
      ${item?.googleBooksItem?.volumeInfo?.categories?.join(" ") || ""}
    `;
    terms.forEach((term: string) => {
      if (!itemMatch.toLowerCase().includes(term.toLowerCase())) res = false;
    });
  }

  return res;
}
