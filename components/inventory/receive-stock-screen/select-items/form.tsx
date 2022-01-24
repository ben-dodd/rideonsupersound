import RadioButton from "@/components/_components/inputs/radio-button";
import SettingsSelect from "@/components/_components/inputs/settings-select";
import TextField from "@/components/_components/inputs/text-field";
import EditableTable from "@/components/_components/table/editable";
import { receiveStockAtom } from "@/lib/atoms";
import { getItemDisplayName, getProfitMargin } from "@/lib/data-functions";
import { InventoryObject } from "@/lib/types";
import { ChevronRight } from "@mui/icons-material";
import { useAtom } from "jotai";
import { useEffect, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";

export default function Form() {
  // State
  const [basket, setBasket] = useAtom(receiveStockAtom);
  const [item, setItem] = useState<InventoryObject>({});
  const handleChange = (e) =>
    setItem({ ...item, [e.target.name]: e.target.value });
  const addItem = () => {
    setBasket({
      ...basket,
      items: basket?.items
        ? [...basket?.items, { key: uuid(), item }]
        : [{ key: uuid(), item }],
    });
    setItem({});
  };
  return (
    <div>
      <div className="flex justify-end">
        <button
          onClick={addItem}
          disabled={Object.keys(item)?.length === 0}
          className="bg-col2-dark hover:bg-col2 disabled:bg-gray-200 p-2 rounded"
        >
          Add Item <ChevronRight />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <TextField
          id="artist"
          inputLabel="Artist"
          value={item?.artist || ""}
          onChange={handleChange}
        />
        <TextField
          id="title"
          inputLabel="Title"
          value={item?.title || ""}
          onChange={handleChange}
        />
      </div>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <TextField
          id="display_as"
          value={item?.display_as || getItemDisplayName(item)}
          onChange={handleChange}
          inputLabel="Display Name"
        />
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
