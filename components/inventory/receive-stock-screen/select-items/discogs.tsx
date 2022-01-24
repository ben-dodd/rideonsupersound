import TextField from "@/components/_components/inputs/text-field";
import { receiveStockAtom } from "@/lib/atoms";
import { getDiscogsByBarcode } from "@/lib/data-functions";
import { useAtom } from "jotai";
import { createRef, useEffect, useRef, useState } from "react";
import DiscogsOption from "../../discogs-option";
import { v4 as uuid } from "uuid";
import { DiscogsItem, InventoryObject } from "@/lib/types";

export default function Discogs() {
  const [barcode, setBarcode] = useState("");
  const [discogsOptions, setDiscogsOptions] = useState([]);
  const [key, setKey] = useState(uuid());
  const handleChange = (e) => {
    setBarcode(e.target.value);
    if (e.target.value !== "")
      getDiscogsByBarcode(e.target.value, setDiscogsOptions);
  };
  const [basket, setBasket] = useAtom(receiveStockAtom);
  const addItem = (discogsItem: DiscogsItem) => {
    let item: InventoryObject = {
      artist: discogsItem?.artists?.join(", "),
      barcode: barcode,
      country: discogsItem?.country,
      format: discogsItem?.format?.join(", "),
      media: "Audio",
      genre: discogsItem?.format?.join(", "),
      image_url: discogsItem?.cover_image,
      title: discogsItem?.title,
      thumb_url: discogsItem?.thumb,
      discogsItem: discogsItem,
      release_year: discogsItem?.year?.toString(),
    };
    setBasket({
      ...basket,
      items: basket?.items
        ? [...basket?.items, { key: uuid(), item }]
        : [{ key: uuid(), item }],
    });
    setBarcode("");
    setKey(uuid());
    setDiscogsOptions([]);
  };
  console.log(key);
  return (
    <div>
      <div className="helper-text mb-2">
        Use the barcode scanner to scan the item and select the correct option
        from Discogs.
      </div>
      <TextField
        key={key}
        id="barcode"
        value={barcode || ""}
        onChange={handleChange}
        inputLabel="Barcode"
        autoFocus
        selectOnFocus
      />
      {discogsOptions?.length > 0 ? (
        discogsOptions?.map((opt, k) => (
          <DiscogsOption opt={opt} key={k} onClick={() => addItem(opt)} />
        ))
      ) : barcode === "" ? (
        <div />
      ) : (
        <div>Nothing found...</div>
      )}
    </div>
  );
}

const focusInput = (inputRef) => {
  console.log(inputRef);
  console.log(inputRef?.current);
  inputRef?.current && inputRef?.current?.focus();
};
