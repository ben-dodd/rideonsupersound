import Image from "next/image";
import { receiveStockAtom } from "@/lib/atoms";
import {
  getDiscogsPriceSuggestions,
  getImageSrc,
  getItemDisplayName,
  getItemSku,
  getItemStoreCut,
  getPriceSuggestion,
  getProfitMargin,
  getStoreCut,
} from "@/lib/data-functions";
import { useInventory } from "@/lib/swr-hooks";
import { InventoryObject } from "@/lib/types";
import { useAtom } from "jotai";
import TextField from "@/components/_components/inputs/text-field";
import DeleteIcon from "@mui/icons-material/Delete";

export default function SetPriceAndQuantities() {
  const [bucket, setBucket] = useAtom(receiveStockAtom);
  console.log(bucket);
  return (
    <div>
      {bucket?.items?.map((receiveItem) => {
        const item: InventoryObject = receiveItem?.item;
        const priceSuggestion = getPriceSuggestion(item);
        return (
          <div className="flex justify-between my-2 border-b">
            <div className="flex">
              <div className="w-20">
                <div className="w-20 h-20 relative">
                  <Image
                    layout="fill"
                    objectFit="cover"
                    src={getImageSrc(item)}
                    alt={item?.title || "Inventory image"}
                  />
                  {!item?.is_gift_card && !item?.is_misc_item && item?.id && (
                    <div className="absolute w-20 h-8 bg-opacity-50 bg-black text-white text-sm flex justify-center items-center">
                      {getItemSku(item)}
                    </div>
                  )}
                </div>
              </div>
              <div className="ml-2">
                <div>{getItemDisplayName(item)}</div>
                <div className="text-sm italic">
                  {priceSuggestion ? `Discogs suggest ${priceSuggestion}` : ""}
                </div>
              </div>
            </div>
            <div className="self-center flex items-center">
              <TextField
                inputLabel="Vendor Cut"
                className="w-24 mr-6"
                startAdornment={"$"}
                disabled={Boolean(item?.id)}
                value={`${
                  receiveItem?.vendor_cut ||
                  (item?.vendor_cut ? item?.vendor_cut / 100 : "")
                }`}
                onChange={(e: any) =>
                  setBucket({
                    ...bucket,
                    items: bucket?.items?.map((bItem, i) =>
                      bItem?.key === receiveItem?.key
                        ? { ...bucket.items[i], vendor_cut: e.target.value }
                        : bItem
                    ),
                  })
                }
              />
              <TextField
                inputLabel="Total Sell"
                className="w-24 mr-6"
                startAdornment={"$"}
                value={`${
                  receiveItem?.total_sell ||
                  (item?.total_sell ? item?.total_sell / 100 : "")
                }`}
                onChange={(e: any) =>
                  setBucket({
                    ...bucket,
                    items: bucket?.items?.map((bItem, i) =>
                      bItem?.key === receiveItem?.key
                        ? { ...bucket.items[i], total_sell: e.target.value }
                        : bItem
                    ),
                  })
                }
              />
              <TextField
                displayOnly={true}
                inputLabel="Store Cut"
                className="w-24 mr-6"
                startAdornment={"$"}
                value={`${getStoreCut({
                  total_sell: parseFloat(
                    receiveItem?.total_sell ||
                      (item?.total_sell ? `${item?.total_sell / 100}` : "")
                  ),
                  vendor_cut: parseFloat(
                    receiveItem?.vendor_cut ||
                      (item?.vendor_cut ? `${item?.vendor_cut / 100}` : "")
                  ),
                })}`}
              />
              <TextField
                displayOnly={true}
                inputLabel="Margin"
                className="w-24 mr-12"
                startAdornment={"$"}
                value={`${getProfitMargin({
                  total_sell: parseFloat(
                    receiveItem?.total_sell ||
                      (item?.total_sell ? `${item?.total_sell / 100}` : "")
                  ),
                  vendor_cut: parseFloat(
                    receiveItem?.vendor_cut ||
                      (item?.vendor_cut ? `${item?.vendor_cut / 100}` : "")
                  ),
                })}`}
              />
              <TextField
                inputLabel="Quantity"
                className="w-24"
                inputType="number"
                min={0}
                value={`${receiveItem?.quantity}`}
                onChange={(e: any) =>
                  setBucket({
                    ...bucket,
                    items: bucket?.items?.map((bItem, i) =>
                      bItem?.key === receiveItem?.key
                        ? { ...bucket.items[i], quantity: e.target.value }
                        : bItem
                    ),
                  })
                }
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
