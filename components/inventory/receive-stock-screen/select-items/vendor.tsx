import { receiveStockAtom } from "@/lib/atoms";
import {
  getItemDisplayName,
  getItemSkuDisplayName,
} from "@/lib/data-functions";
import { useInventory } from "@/lib/swr-hooks";
import { InventoryObject } from "@/lib/types";
import { Box } from "@mui/material";
import { useAtom } from "jotai";
import Select from "react-select";
import { v4 as uuid } from "uuid";

export default function Vendor() {
  const { inventory } = useInventory();
  const [basket, setBasket] = useAtom(receiveStockAtom);
  const addItem = (item: any) => {
    setBasket({
      ...basket,
      items: basket?.items
        ? [...basket?.items, { key: uuid(), item: item?.value }]
        : [{ key: uuid(), item: item?.value }],
    });
  };
  return (
    <div>
      <div className="helper-text mb-2">
        Add items already in the vendor's inventory.
      </div>
      <div className="h-dialog overflow-y-scroll">
        <Select
          className="w-full self-stretch"
          value={null}
          options={inventory
            ?.filter(
              (item: InventoryObject) =>
                item?.vendor_id === basket?.vendor_id &&
                !basket?.items?.map((item) => item?.item?.id).includes(item?.id)
            )
            ?.map((item: InventoryObject) => ({
              value: item,
              label: getItemSkuDisplayName(item?.id, inventory),
            }))}
          onChange={addItem}
        />
      </div>
    </div>
  );
}
