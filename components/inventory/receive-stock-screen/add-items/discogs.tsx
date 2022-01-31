import TextField from "@/components/_components/inputs/text-field";
import { receiveStockAtom } from "@/lib/atoms";
import {
  getDiscogsOptionsByBarcode,
  getDiscogsItem,
  getDiscogsOptionsByKeyword,
} from "@/lib/data-functions";
import { useAtom } from "jotai";
import { useCallback, useState } from "react";
import DiscogsOption from "../../discogs-panel/discogs-option";
import { v4 as uuid } from "uuid";
import { DiscogsItem, StockObject } from "@/lib/types";
import { ChevronRight } from "@mui/icons-material";
import debounce from "lodash/debounce";

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
  const addItem = (item) => {
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
  const searchDiscogs = async (k) => {
    const results = await getDiscogsOptionsByKeyword(k);
    if (results && results?.length > 0) setDiscogsOptions(results);
  };
  const debouncedSearch = useCallback(debounce(searchDiscogs, 2000), []);

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
      <TextField
        id="keyword"
        value={keyword || ""}
        onChange={(e) => {
          setKeyword(e.target.value);
          debouncedSearch(e.target.value);
        }}
        inputLabel="Search Keywords (e.g. 'palace of wisdom common threads cdr')"
      />
      {discogsOptions?.length > 0 ? (
        discogsOptions?.map((opt, k) => (
          <DiscogsOption
            opt={opt}
            key={k}
            item={{ vendor_id: basket?.vendor_id }}
            setItem={addItem}
            override={true}
          />
        ))
      ) : barcode === "" ? (
        <div />
      ) : (
        <div>Nothing found...</div>
      )}
    </div>
  );
}
