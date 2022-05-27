import Image from "next/image";
import {
  getImageSrc,
  getItemDisplayName,
  getItemSku,
  getPriceSuggestion,
  getProfitMargin,
  getStoreCut,
} from "@/lib/data-functions";
import { StockObject } from "@/lib/types";
import TextField from "@/components/_components/inputs/text-field";
import SettingsSelect from "@/components/_components/inputs/settings-select";
import RadioButton from "@/components/_components/inputs/radio-button";

export default function ListItem({ receiveItem, bucket, setBucket }) {
  const item: StockObject = receiveItem?.item;
  const priceSuggestion = getPriceSuggestion(item);
  const profitMargin = getProfitMargin({
    total_sell: parseFloat(
      receiveItem?.total_sell ||
        (item?.total_sell ? `${item?.total_sell / 100}` : "")
    ),
    vendor_cut: parseFloat(
      receiveItem?.vendor_cut ||
        (item?.vendor_cut ? `${item?.vendor_cut / 100}` : "")
    ),
  });
  const storeCut = getStoreCut({
    total_sell: parseFloat(
      receiveItem?.total_sell ||
        (item?.total_sell ? `${item?.total_sell / 100}` : "")
    ),
    vendor_cut: parseFloat(
      receiveItem?.vendor_cut ||
        (item?.vendor_cut ? `${item?.vendor_cut / 100}` : "")
    ),
  });

  console.log(bucket);

  return (
    <div className="flex justify-between my-2 border-b">
      <div className="flex">
        <div className="w-20">
          <div className="w-20 h-20 relative">
            <img
              className="object-cover absolute"
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
      <div>
        <div className="self-center flex items-center">
          <RadioButton
            key={`${receiveItem?.key}isNew${item?.is_new}`}
            inputLabel="CONDITION"
            group={`${receiveItem?.key}isNew`}
            value={
              item?.is_new === null ? null : item?.is_new ? "true" : "false"
            }
            onChange={(value: string) =>
              setBucket({
                ...bucket,
                items: bucket?.items?.map((bItem, i) =>
                  bItem?.key === receiveItem?.key
                    ? {
                        ...bucket.items[i],
                        item: {
                          ...bucket.items[i].item,
                          is_new: value === "true" ? 1 : 0,
                          cond: value === "true" ? null : item?.cond,
                        },
                      }
                    : bItem
                ),
              })
            }
            options={[
              { id: `new${receiveItem?.key}`, value: "true", label: "New" },
              { id: `used${receiveItem?.key}`, value: "false", label: "Used" },
            ]}
          />
          <SettingsSelect
            className="w-full"
            object={item}
            customEdit={(e) =>
              setBucket({
                ...bucket,
                items: bucket?.items?.map((bItem, i) =>
                  bItem?.key === receiveItem?.key
                    ? {
                        ...bucket.items[i],
                        item: {
                          ...bucket.items[i].item,
                          cond: e.value,
                        },
                      }
                    : bItem
                ),
              })
            }
            dbField="cond"
            sorted={false}
            isCreateDisabled={true}
          />
        </div>
        <div className="self-center flex items-center">
          <SettingsSelect
            className="w-1/2"
            object={item}
            customEdit={(e) =>
              setBucket({
                ...bucket,
                items: bucket?.items?.map((bItem, i) =>
                  bItem?.key === receiveItem?.key
                    ? {
                        ...bucket.items[i],
                        item: {
                          ...bucket.items[i].item,
                          section: e.value,
                        },
                      }
                    : bItem
                ),
              })
            }
            inputLabel="SECTION"
            dbField="section"
            isCreateDisabled={true}
          />
          <SettingsSelect
            className="w-1/2 ml-2"
            object={item}
            customEdit={(e) =>
              setBucket({
                ...bucket,
                items: bucket?.items?.map((bItem, i) =>
                  bItem?.key === receiveItem?.key
                    ? {
                        ...bucket.items[i],
                        item: { ...bucket.items[i].item, country: e.value },
                      }
                    : bItem
                ),
              })
            }
            inputLabel="COUNTRY"
            dbField="country"
          />
        </div>
        <div className="self-center flex items-center">
          <TextField
            inputLabel="VENDOR CUT"
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
            inputLabel="TOTAL SELL"
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
            inputLabel="STORE CUT"
            error={storeCut < 0}
            className={`w-24 mr-6`}
            startAdornment={"$"}
            value={`${storeCut}`}
          />
          <TextField
            displayOnly={true}
            inputLabel="MARGIN"
            error={storeCut < 0}
            className="w-24 mr-12"
            endAdornment={"%"}
            value={`${profitMargin || 0}`}
          />
          <TextField
            inputLabel="QUANTITY"
            className="w-24"
            // inputType="number"
            error={parseInt(receiveItem?.quantity) < 1}
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
    </div>
  );
}
