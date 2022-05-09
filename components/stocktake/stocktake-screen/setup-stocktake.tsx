// DB
import {
  useAllSelects,
  useInventory,
  useLogs,
  useVendors,
} from "@/lib/swr-hooks";

// Icons
import { useAtom } from "jotai";
import { clerkAtom, receiveStockAtom } from "@/lib/atoms";
import TextField from "@/components/_components/inputs/text-field";
import FilterBox from "./filter-box";
import { useEffect, useState } from "react";

export default function SetupStocktake({ stocktake, setStocktake }) {
  const [clerk] = useAtom(clerkAtom);
  const { logs, mutateLogs } = useLogs();
  const { vendors, isVendorsLoading } = useVendors();
  const { selects, isSelectsLoading } = useAllSelects();
  const { inventory, isInventoryLoading } = useInventory();
  const [vendorList, setVendorList] = useState([]);
  const [formatList, setFormatList] = useState([]);
  const [mediaList, setMediaList] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [vendorEnabled, setVendorEnabled] = useState(true);
  const [mediaEnabled, setMediaEnabled] = useState(true);
  const [formatEnabled, setFormatEnabled] = useState(true);
  const [sectionEnabled, setSectionEnabled] = useState(true);

  const [numberOfItems, setNumberOfItems] = useState(0);
  const [numberOfUniqueItems, setNumberOfUniqueItems] = useState(0);

  useEffect(() => {
    setVendorList(vendors?.map((v) => v?.id));
    setFormatList(
      selects
        ?.filter((s) => s?.setting_select === "format")
        ?.map((s) => s?.label)
    );
    setMediaList(
      selects
        ?.filter((s) => s?.setting_select === "media")
        ?.map((s) => s?.label)
    );
    setSectionList(
      selects
        ?.filter((s) => s?.setting_select === "section")
        ?.map((s) => s?.label)
    );
  }, [selects, vendors]);

  useEffect(() => {
    const inventoryList = inventory?.filter(
      (i) =>
        i?.quantity > 0 &&
        (stocktake?.vendorEnabled
          ? stocktake?.vendorList?.includes(i?.vendor_id)
          : true) &&
        (stocktake?.formatEnabled
          ? stocktake?.formatList?.includes(i?.format)
          : true) &&
        (stocktake?.mediaEnabled
          ? stocktake?.mediaList?.includes(i?.media)
          : true) &&
        (stocktake?.sectionEnabled
          ? stocktake?.sectionList?.includes(i?.section)
          : true)
    );
    setNumberOfUniqueItems(inventoryList?.length);
    setNumberOfItems(
      inventoryList?.reduce((prev, curr) => prev + curr?.quantity, 0)
    );
  }, [stocktake]);

  return (
    <div>
      <div className="flex">
        <div className="w-1/2">
          <TextField
            value={stocktake?.description}
            onChange={(e: any) =>
              setStocktake({ ...stocktake, description: e.target.value })
            }
            inputLabel="DESCRIPTION"
          />
        </div>
        <div className="w-1/2 flex flex-col justify-end items-end ml-4">
          <div className="flex">
            <div className="mr-2">Estimated Number of Unique Items: </div>
            <div className="font-bold">{numberOfUniqueItems}</div>
          </div>
          <div className="flex">
            <div className="mr-2">Estimated Number of Items: </div>
            <div className="font-bold">{numberOfItems}</div>
          </div>
        </div>
      </div>
      {/* <div className="font-bold">Limit Stocktake</div> */}
      <div className="flex mt-4">
        <div className="w-1/4">
          <FilterBox
            title="Vendors"
            list={vendors?.map((v) => ({
              label: `${v?.name} [${v?.id}]`,
              value: v?.id,
            }))}
            stocktake={stocktake}
            setStocktake={setStocktake}
            field={"vendor"}
          />
        </div>
        <div className="w-1/4">
          <FilterBox
            title="Media Type"
            list={selects
              ?.filter((s) => s?.setting_select === "media")
              ?.map((s) => ({ label: s?.label, value: s?.label }))}
            stocktake={stocktake}
            setStocktake={setStocktake}
            field={"media"}
          />
        </div>
        <div className="w-1/4">
          <FilterBox
            title="Format"
            list={selects
              ?.filter((s) => s?.setting_select === "format")
              ?.map((s) => ({ label: s?.label, value: s?.label }))}
            stocktake={stocktake}
            setStocktake={setStocktake}
            field={"format"}
          />
        </div>
        <div className="w-1/4">
          <FilterBox
            title="Section"
            list={selects
              ?.filter((s) => s?.setting_select === "section")
              ?.map((s) => ({ label: s?.label, value: s?.label }))}
            stocktake={stocktake}
            setStocktake={setStocktake}
            field={"section"}
          />
        </div>
      </div>
    </div>
  );
}
