// Packages
import { useState, useEffect, useMemo } from "react";
import { useAtom } from "jotai";

// DB
import {
  useVendors,
  useInventory,
  useSalesJoined,
  useVendorPayments,
} from "@/lib/swr-hooks";
import { loadedVendorIdAtom, pageAtom } from "@/lib/atoms";
import { VendorObject, StockObject } from "@/lib/types";

// Functions
import { getItemDisplayName, getVendorDetails } from "@/lib/data-functions";

export default function VendorItems() {
  // Atoms
  const [loadedVendorId] = useAtom(loadedVendorIdAtom);
  const [page] = useAtom(pageAtom);

  // SWR
  const { vendors } = useVendors();
  const { inventory } = useInventory();
  const { sales } = useSalesJoined();
  const { vendorPayments } = useVendorPayments();

  // State
  const [vendor, setVendor]: [VendorObject, Function] = useState({});

  // Load
  useEffect(() => {
    setVendor(
      vendors?.filter((v: VendorObject) => v?.id === loadedVendorId[page])[0]
    );
  }, [loadedVendorId[page]]);

  // Functions
  function StockItem({ item }) {
    return (
      <div className={`flex justify-between my-2 border-b`}>
        <div className="flex">
          <div className="cursor-pointer w-1/3" onClick={() => null}></div>
          <div className="ml-8 w-2/3">
            {getItemDisplayName(item)}
            <div
              className={`mt-8 ${
                (item?.quantity || 0) <= 0 ? "text-tertiary" : "text-black"
              }`}
            >{`${item?.quantity || 0} in stock.`}</div>
          </div>
        </div>
      </div>
    );
  }

  // Constants
  const v = useMemo(
    () =>
      getVendorDetails(inventory, sales, vendorPayments, loadedVendorId[page]),
    [inventory, sales, vendorPayments, loadedVendorId[page]]
  );

  return (
    <div>
      <div className="text-xl font-bold bg-col3 px-1">In Stock Items</div>
      {v?.totalItems
        ?.filter((item: StockObject) => item?.quantity > 0)
        ?.map((item: StockObject) => (
          <StockItem key={item.id} item={item} />
        ))}
      <div className="text-xl font-bold bg-col4 px-1">Out of Stock Items</div>
      {v?.totalItems
        ?.filter((item: StockObject) => (item?.quantity || 0) <= 0)
        ?.map((item: StockObject) => (
          <StockItem item={item} />
        ))}
    </div>
  );
}
