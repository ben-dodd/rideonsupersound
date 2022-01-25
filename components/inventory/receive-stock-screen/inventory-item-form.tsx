import RadioButton from "@/components/_components/inputs/radio-button";
import Image from "next/image";
import SettingsSelect from "@/components/_components/inputs/settings-select";
import TextField from "@/components/_components/inputs/text-field";
import {
  getImageSrc,
  getItemDisplayName,
  getItemSku,
} from "@/lib/data-functions";
import { InventoryObject, VendorObject } from "@/lib/types";
import { useMemo } from "react";
import { useVendors } from "@/lib/swr-hooks";

interface inventoryProps {
  item: InventoryObject;
  setItem: Function;
}

export default function InventoryItemForm({ item, setItem }: inventoryProps) {
  const handleChange = (e) =>
    setItem({ ...item, [e.target.name]: e.target.value });
  const { vendors } = useVendors();

  const vendor = useMemo(
    () =>
      (vendors &&
        vendors.filter(
          (vendor: VendorObject) => vendor?.id === item?.vendor_id
        )[0]) ||
      null,
    [item]
  );
  return (
    <div>
      <div className="flex justify-start w-full">
        {/* IMAGE */}
        <div className="pr-2 w-52 mr-2">
          <div className="w-52 h-52 relative">
            <Image
              layout="fill"
              objectFit="contain"
              src={getImageSrc(item)}
              alt={item?.title || "Inventory image"}
            />
            {item?.id && (
              <div className="absolute w-52 h-8 bg-opacity-50 bg-black text-white flex justify-center items-center">
                {getItemSku(item)}
              </div>
            )}
          </div>
        </div>
        {/* MAIN DETAILS */}
        <div className="w-full">
          <TextField
            value={item?.artist || ""}
            onChange={(e: any) => setItem({ ...item, artist: e.target.value })}
            inputLabel="ARTIST"
          />
          <TextField
            value={item?.title || ""}
            onChange={(e: any) => setItem({ ...item, title: e.target.value })}
            inputLabel="TITLE"
          />
          <TextField
            value={item?.display_as || getItemDisplayName(item)}
            onChange={(e: any) =>
              setItem({ ...item, display_as: e.target.value })
            }
            inputLabel="DISPLAY NAME"
          />
          {vendor && (
            <div className="font-bold text-sm">{`Selling for ${vendor?.name}`}</div>
          )}
        </div>
      </div>
      <div className="mb-2">
        <TextField
          id="barcode"
          inputLabel="BARCODE"
          value={item?.barcode || ""}
          onChange={handleChange}
        />
      </div>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <SettingsSelect
          object={item}
          onEdit={setItem}
          inputLabel="TYPE"
          dbField="media"
          isCreateDisabled={true}
        />
        <SettingsSelect
          object={item}
          onEdit={setItem}
          inputLabel="FORMAT"
          dbField="format"
        />
      </div>
      {item?.format == "Shirt" ? (
        <div className="grid grid-cols-2 gap-2 mb-2">
          <SettingsSelect
            object={item}
            onEdit={setItem}
            inputLabel="COLOUR"
            dbField="colour"
          />
          <SettingsSelect
            object={item}
            onEdit={setItem}
            inputLabel="SIZE"
            dbField="size"
          />
        </div>
      ) : (
        <div className="flex items-end">
          <RadioButton
            inputLabel="CONDITION"
            group="isNew"
            value={item?.is_new ? "true" : "false"}
            onChange={(value: string) =>
              setItem({ ...item, is_new: value === "true" ? 1 : 0 })
            }
            options={[
              { id: "new", value: "true", label: "New" },
              { id: "used", value: "false", label: "Used" },
            ]}
          />
          <SettingsSelect
            className="w-full"
            object={item}
            onEdit={setItem}
            dbField="cond"
            isCreateDisabled={true}
          />
        </div>
      )}
      <div className="grid grid-cols-2 gap-2 items-center justify-center">
        <SettingsSelect
          object={item}
          onEdit={setItem}
          inputLabel="COUNTRY"
          dbField="country"
        />
        <SettingsSelect
          object={item}
          onEdit={setItem}
          inputLabel="GENRE"
          dbField="genre"
        />
      </div>
      <SettingsSelect
        object={item}
        onEdit={setItem}
        isMulti
        inputLabel="TAGS"
        dbField="tag"
      />
      <TextField
        id="description"
        inputLabel="DESCRIPTION"
        value={item?.description || ""}
        onChange={handleChange}
        multiline
      />
      <TextField
        id="note"
        inputLabel="NOTES"
        value={item?.note || ""}
        onChange={handleChange}
        multiline
      />
    </div>
  );
}
