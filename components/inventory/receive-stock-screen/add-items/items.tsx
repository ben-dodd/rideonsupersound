import { receiveStockAtom } from "@/lib/atoms";
import {
  getItemDisplayName,
  getItemSkuDisplayName,
  getItemSkuDisplayNameById,
} from "@/lib/data-functions";
import { useAtom } from "jotai";
import CloseIcon from "@mui/icons-material/Close";
import { useInventory } from "@/lib/swr-hooks";

export default function Items() {
  const [basket, setBasket] = useAtom(receiveStockAtom);
  const { inventory } = useInventory();
  const removeItem = (removeItem) => {
    const items = basket?.items?.filter(
      (item) => item?.key !== removeItem?.key
    );
    setBasket({ ...basket, items });
  };
  console.log(basket);
  return (
    <div>
      {basket?.items?.length > 0 ? (
        basket?.items?.map((item: any) => (
          <div
            key={item?.key}
            className="flex hover:bg-gray-200 items-center p-2 border-b"
          >
            <button className="p-2" onClick={() => removeItem(item)}>
              <CloseIcon />
            </button>
            {item?.item?.id
              ? getItemSkuDisplayName(item?.item)
              : getItemDisplayName(item?.item)}
          </div>
        ))
      ) : (
        <div>No items currently selected.</div>
      )}
    </div>
  );
}
