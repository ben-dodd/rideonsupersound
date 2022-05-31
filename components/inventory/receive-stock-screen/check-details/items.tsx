import { receiveStockAtom } from "@/lib/atoms";
import {
  getItemDisplayName,
  getItemSkuDisplayName,
} from "@/lib/data-functions";
import { useAtom } from "jotai";

export default function Items({ onClick }) {
  const [basket] = useAtom(receiveStockAtom);
  return (
    <div>
      {basket?.items?.length > 0 ? (
        basket?.items?.map((item: any) => (
          <div
            key={item?.key}
            className="flex hover:bg-gray-200 items-center p-2 cursor-pointer border-b"
            onClick={() => onClick(item)}
          >
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
