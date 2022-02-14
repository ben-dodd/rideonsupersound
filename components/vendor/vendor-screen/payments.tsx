// Packages
import { useState, useEffect, useMemo } from "react";
import { useAtom } from "jotai";

// DB
import {
  useVendors,
  useClerks,
  useInventory,
  useSalesJoined,
  useVendorPayments,
  useCustomers,
} from "@/lib/swr-hooks";
import {
  clerkAtom,
  viewAtom,
  loadedCustomerObjectAtom,
  loadedVendorIdAtom,
  pageAtom,
} from "@/lib/atoms";
import {
  VendorObject,
  StockObject,
  VendorSaleItemObject,
  VendorPaymentObject,
  CustomerObject,
  ClerkObject,
} from "@/lib/types";

// Functions
import { getItemDisplayName, getVendorDetails } from "@/lib/data-functions";

// Components
import ScreenContainer from "@/components/_components/container/screen";
import Tabs from "@/components/_components/navigation/tabs";
import Select from "react-select";
import MaskedInput from "react-text-mask";
import TextField from "@/components/_components/inputs/text-field";
import CreateableSelect from "@/components/_components/inputs/createable-select";
import SettingsSelect from "@/components/_components/inputs/settings-select";
import dayjs from "dayjs";

export default function VendorPayments() {
  // Atoms
  const [loadedVendorId, setLoadedVendorId] = useAtom(loadedVendorIdAtom);
  const [view, setView] = useAtom(viewAtom);
  const [page] = useAtom(pageAtom);
  const [, setCustomer] = useAtom(loadedCustomerObjectAtom);
  const [clerk] = useAtom(clerkAtom);

  // SWR
  const { vendors, isVendorsLoading } = useVendors();
  const { clerks, isClerksLoading } = useClerks();
  const { customers, isCustomersLoading } = useCustomers();
  const { inventory, isInventoryLoading } = useInventory();
  const { sales, isSalesLoading } = useSalesJoined();
  const { vendorPayments, isVendorPaymentsLoading } = useVendorPayments();

  // State
  const [vendor, setVendor]: [VendorObject, Function] = useState({});
  const [tab, setTab] = useState(0);

  // Load
  useEffect(() => {
    setVendor(
      vendors?.filter((v: VendorObject) => v?.id === loadedVendorId[page])[0]
    );
  }, [loadedVendorId[page]]);

  // Constants
  const v = useMemo(
    () =>
      getVendorDetails(inventory, sales, vendorPayments, loadedVendorId[page]),
    [inventory, sales, vendorPayments, loadedVendorId[page]]
  );

  return (
    <div>
      <div className="font-bold text-xl">Payments</div>
      {v?.totalPayments
        ?.sort((debitA: VendorPaymentObject, debitB: VendorPaymentObject) => {
          const a = dayjs(debitA?.date);
          const b = dayjs(debitB?.date);
          return a < b ? 1 : b < a ? -1 : 0;
        })
        // ?.slice(0, 5)
        ?.map((debit: VendorPaymentObject) => (
          <div className="border-b mt-2">
            <div className="font-bold text-sm">
              {dayjs(debit?.date).format("D MMMM YYYY")}
            </div>
            <div>{`$${(debit?.amount / 100)?.toFixed(2)} (${
              debit?.type
            })`}</div>
            <div>{debit?.id}</div>
          </div>
        ))}
    </div>
  );
}
