import TextField from "@/components/_components/inputs/text-field";
import { receiveStockAtom } from "@/lib/atoms";
import {
  getDiscogsOptionsByBarcode,
  getDiscogsOptionsByKeyword,
} from "@/lib/data-functions";
import { useAtom } from "jotai";
import { useCallback, useState } from "react";
import DiscogsOption from "../../discogs-panel/discogs-option";
import { v4 as uuid } from "uuid";
import debounce from "lodash/debounce";

export default function Discogs() {
  const [barcode, setBarcode] = useState("");
  const [keyword, setKeyword] = useState("");
  const [discogsOptions, setDiscogsOptions] = useState([]);
  const [key, setKey] = useState(uuid());
  const handleChange = async (val) => {
    if (val !== "") {
      const results: any = await getDiscogsOptionsByBarcode(val);
      if (results && results?.length > 0) {
        setDiscogsOptions(results);
      }
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
  const debouncedBarcode = useCallback(debounce(handleChange, 2000), []);

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
        onChange={(e) => {
          setBarcode(e.target.value);
          debouncedBarcode(e.target.value);
        }}
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
