import { receiveStockAtom } from "@/lib/atoms";
import { useAtom } from "jotai";
import ListItem from "./list-item";

export default function SetPriceAndQuantities() {
  const [bucket, setBucket] = useAtom(receiveStockAtom);
  return (
    <div>
      {bucket?.items?.map((receiveItem) => (
        <ListItem
          receiveItem={receiveItem}
          bucket={bucket}
          setBucket={setBucket}
        />
      ))}
    </div>
  );
}
