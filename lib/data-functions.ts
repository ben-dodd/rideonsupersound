import { InventoryObject } from "@/lib/types";

export function filterInventory({ inventory, search }) {
  return inventory
    ?.sort((a: InventoryObject, b: InventoryObject) => {
      if (a?.quantity === b?.quantity) return 0;
      if (a?.quantity < 1) return 1;
      if (b?.quantity < 1) return -1;
      return 0;
    })
    .filter((item: InventoryObject) => {
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
          ${item?.vendor_name || ""}
          ${item?.googleBooksItem?.volumeInfo?.authors?.join(" ") || ""}
          ${item?.googleBooksItem?.volumeInfo?.publisher || ""}
          ${item?.googleBooksItem?.volumeInfo?.subtitle || ""}
          ${item?.googleBooksItem?.volumeInfo?.categories?.join(" ") || ""}
        `;
        terms.forEach((term: string) => {
          if (!itemMatch.toLowerCase().includes(term.toLowerCase()))
            res = false;
        });
      }

      return res;
    })
    .slice(0, 50);
}
