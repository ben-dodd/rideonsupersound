import { receiveStockAtom } from "@/lib/atoms";
import { InventoryObject } from "@/lib/types";
import { useAtom } from "jotai";
import InventoryItemForm from "../inventory-item-form";
import { useState } from "react";
import Tabs from "@/components/_components/navigation/tabs";
import DiscogsPanel from "../../discogs-panel";
import Items from "./items";
import GoogleBooksPanel from "../../google-books-panel";

export default function CheckDetails() {
  const [basket, setBasket] = useAtom(receiveStockAtom);
  const [item, setItem] = useState(null);
  const [itemKey, setItemKey] = useState(null);
  const [mode, setMode] = useState(0);
  const onItemClick = (newItem) => {
    if (item) {
      const items = basket?.items?.map((i) => {
        if (i?.key === itemKey) return { ...i, item };
        else return i;
      });
      setBasket({ ...basket, items });
    }
    setItem(newItem?.item);
    setItemKey(newItem?.key);
  };
  return (
    <div className="w-full">
      <Tabs
        tabs={[
          "General Details",
          item?.media === "Audio"
            ? "Discogs"
            : item?.media === "Literature"
            ? "GoogleBooks"
            : null,
        ]}
        value={mode}
        onChange={setMode}
      />
      <div className="flex w-full">
        <div className="w-3/5 mr-4">
          <div hidden={mode !== 0}>
            <InventoryItemForm
              item={item}
              setItem={setItem}
              disabled={item?.id}
            />
          </div>
          <div hidden={!(mode === 1 && item?.media === "Audio")}>
            <DiscogsPanel item={item} setItem={setItem} disabled={item?.id} />
          </div>
          <div hidden={!(mode === 1 && item?.media === "Literature")}>
            <GoogleBooksPanel
              item={item}
              setItem={setItem}
              disabled={item?.id}
            />
          </div>
        </div>
        <div className="w-2/5">
          <Items onClick={onItemClick} />
        </div>
      </div>
    </div>
  );
}
