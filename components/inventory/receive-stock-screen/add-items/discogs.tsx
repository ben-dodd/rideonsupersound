import TextField from "@/components/_components/inputs/text-field";
import { receiveStockAtom } from "@/lib/atoms";
import {
  getDiscogsOptionsByBarcode,
  getDiscogsItem,
  getDiscogsOptionsByKeyword,
} from "@/lib/data-functions";
import { useAtom } from "jotai";
import { useState } from "react";
import DiscogsOption from "../../discogs-option";
import { v4 as uuid } from "uuid";
import { DiscogsItem, InventoryObject } from "@/lib/types";
import { ChevronRight } from "@mui/icons-material";

export default function Discogs() {
  const [barcode, setBarcode] = useState("");
  const [keyword, setKeyword] = useState("");
  const [discogsOptions, setDiscogsOptions] = useState([]);
  const [key, setKey] = useState(uuid());
  const handleChange = async (e) => {
    setBarcode(e.target.value);
    if (e.target.value !== "") {
      const results: any = await getDiscogsOptionsByBarcode(e.target.value);
      console.log(results);
      if (results && results?.length > 0) setDiscogsOptions(results);
    }
  };
  const [basket, setBasket] = useAtom(receiveStockAtom);
  const addItem = async (discogsItem: DiscogsItem) => {
    let item: InventoryObject = {
      artist: discogsItem?.artists?.join(", "),
      barcode: discogsItem?.barcode?.join(", "),
      country: discogsItem?.country,
      format: discogsItem?.format?.join(", "),
      media: "Audio",
      genre: `${discogsItem?.genre?.join("/")}/${discogsItem?.style?.join(
        "/"
      )}`,
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
  const searchDiscogs = async () => {
    const results = await getDiscogsOptionsByKeyword(keyword);
    if (results && results?.length > 0) setDiscogsOptions(results);
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
      <div className="flex">
        <TextField
          className="grow"
          id="keyword"
          value={keyword || ""}
          onChange={(e) => setKeyword(e.target.value)}
          inputLabel="Search Keyword"
        />
        <button
          onClick={searchDiscogs}
          disabled={keyword === ""}
          className="bg-col2-dark hover:bg-col2 disabled:bg-gray-200 ml-2 rounded"
        >
          Search
        </button>
      </div>
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
