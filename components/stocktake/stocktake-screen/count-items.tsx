// Packages
import { useState } from "react";
import { useAtom } from "jotai";

// DB
import {
  useInventory,
  useVendors,
  useLogs,
  useRegisterID,
} from "@/lib/swr-hooks";
import { viewAtom, clerkAtom, alertAtom } from "@/lib/atoms";
import { StockObject, VendorObject, ModalButton } from "@/lib/types";

// Functions
import { returnStock, saveLog } from "@/lib/db-functions";
import {
  getItemDisplayName,
  getItemSkuDisplayName,
} from "@/lib/data-functions";

// Components
import TextField from "@/components/_components/inputs/text-field";
import Select from "react-select";

// Icons
import CountedListItem from "./counted-list-item";
import ItemCard from "./item-card";
import SearchIcon from "@mui/icons-material/Search";

export default function CountItems({ stocktake, setStocktake }) {
  // SWR
  const { inventory, mutateInventory } = useInventory();
  const { logs, mutateLogs } = useLogs();
  const { registerID } = useRegisterID();
  const [inputValue, setInputValue] = useState("");
  const [scanInput, setScanInput] = useState("");

  // Atoms
  const [clerk] = useAtom(clerkAtom);
  const [view, setView] = useAtom(viewAtom);
  const [, setAlert] = useAtom(alertAtom);

  // State
  const [lastAddedItem, setLastAddedItem] = useState(null);
  const [search, setSearch] = useState("");

  const [submitting, setSubmitting] = useState(false);

  function closeFunction() {
    setView({ ...view, stocktakeScreen: false });
  }

  function addCountedItem(item_id) {
    let countedItem = stocktake?.counted_items?.filter(
      (i) => i?.id === item_id
    )?.[0];
    if (countedItem) {
      countedItem.quantity += 1;
    } else {
      countedItem = { id: item_id, quantity: 1 };
    }
    let countData = stocktake?.counted_items || [];
    let newCountedItems = [
      countedItem,
      ...countData.filter((i) => i?.id !== countedItem?.id),
    ];
    setLastAddedItem(inventory?.filter((i) => i?.id === countedItem?.id)?.[0]);
    setStocktake({
      ...stocktake,
      counted_items: newCountedItems,
      total_counted: newCountedItems?.reduce(
        (prev, curr) => prev + curr?.quantity,
        0
      ),
      total_unique_counted: newCountedItems?.length,
    });
  }

  const itemOptions = inventory?.map((item: StockObject) => ({
    value: item?.id,
    label: getItemSkuDisplayName(item),
  }));

  return (
    <div className="w-full">
      <div className="flex mt-4">
        <div className="w-1/3 border-r border-black pr-4">
          <div className="font-bold text-xl">ADD ITEMS</div>
          <TextField
            inputLabel="SCANNER"
            inputClass="text-4xl"
            selectOnFocus
            autoFocus
            value={scanInput}
            onChange={(e: any) => {
              if (
                itemOptions?.filter(
                  (opt) =>
                    e.target.value ===
                    `${("00000" + opt?.value || "").slice(-5)}`
                )?.length > 0
              ) {
                addCountedItem(parseInt(e.target.value));
                setScanInput("");
              } else {
                setScanInput(e.target.value);
              }
            }}
          />
          <div className={`transition-all px-1 text-xs mt-2 mb-2`}>
            OR SEARCH ITEMS
          </div>
          <Select
            className="w-full text-xs"
            value={inputValue}
            options={itemOptions}
            onChange={(item: any) => addCountedItem(parseInt(item?.value))}
            onInputChange={(newValue, actionMeta, prevInputValue) => {
              setInputValue(newValue);
              if (
                actionMeta?.action === "input-change" &&
                itemOptions?.filter(
                  (opt) =>
                    newValue === `${("00000" + opt?.value || "").slice(-5)}`
                )?.length > 0
              ) {
                addCountedItem(parseInt(newValue));
                setInputValue("");
              }
            }}
          />
          {lastAddedItem ? (
            <>
              <div className="font-bold text-xl pt-8">LAST ADDED ITEM</div>
              <ItemCard item={lastAddedItem} />
            </>
          ) : (
            <div />
          )}
        </div>
        <div className="w-2/3 px-4">
          {stocktake?.counted_items?.length > 0 ? (
            <div className="h-dialog">
              <div className="font-bold text-xl">{`COUNTED ${stocktake?.counted_items?.reduce(
                (prev, returnItem) => (prev += parseInt(returnItem?.quantity)),
                0
              )} ITEMS`}</div>
              <div
                className={`flex items-center ring-1 ring-gray-400 w-auto bg-gray-100 hover:bg-gray-200`}
              >
                <div className="pl-3 pr-1">
                  <SearchIcon />
                </div>
                <input
                  className="w-full py-1 px-2 outline-none bg-transparent"
                  value={search || ""}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search counted items..."
                />
              </div>
              <div className="h-full overflow-y-scroll">
                {stocktake?.counted_items?.map(
                  (countedItem: any, i: number) => {
                    const item = inventory?.filter(
                      (i: StockObject) => i?.id === parseInt(countedItem?.id)
                    )[0];
                    if (
                      search !== "" &&
                      !getItemSkuDisplayName(item)
                        ?.toLowerCase?.()
                        ?.includes?.(search?.toLowerCase?.())
                    )
                      return <div />;
                    return (
                      <CountedListItem
                        key={`${countedItem?.id}-${i}`}
                        item={item}
                        countedItem={countedItem}
                        stocktake={stocktake}
                        setStocktake={setStocktake}
                      />
                    );
                  }
                )}
              </div>
            </div>
          ) : (
            <div>Select items from the drop-down menu.</div>
          )}
        </div>
      </div>
    </div>
  );
}
