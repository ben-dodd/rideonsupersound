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
import { loadedVendorIdAtom, pageAtom } from "@/lib/atoms";
import { ModalButton, VendorObject } from "@/lib/types";

// Components
import ScreenContainer from "@/components/_components/container/screen";
import Tabs from "@/components/_components/navigation/tabs";
import GeneralDetails from "./general-details";
import VendorSales from "./sales";
import VendorItems from "./items";
import VendorPayments from "./payments";
import { updateVendorInDatabase } from "@/lib/db-functions";
import { getVendorDetails } from "@/lib/data-functions";

export default function VendorScreen() {
  // Atoms
  const [loadedVendorId, setLoadedVendorId] = useAtom(loadedVendorIdAtom);
  const [page] = useAtom(pageAtom);

  // SWR
  const { vendors, mutateVendors, isVendorsLoading } = useVendors();
  const { isClerksLoading } = useClerks();
  const { isCustomersLoading } = useCustomers();
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
  const vendorDetails = useMemo(
    () =>
      getVendorDetails(inventory, sales, vendorPayments, loadedVendorId[page]),
    [inventory, sales, vendorPayments, loadedVendorId[page]]
  );

  const buttons: ModalButton[] = [
    {
      type: "cancel",
      onClick: () => setLoadedVendorId({ ...loadedVendorId, [page]: 0 }),
      text: "CLOSE",
    },
    {
      type: "ok",
      onClick: () => {
        let otherVendors = vendors?.filter(
          (i: VendorObject) => i?.id !== vendor?.id
        );
        mutateVendors([...otherVendors, vendor], false);
        updateVendorInDatabase(vendor);
        setLoadedVendorId({ ...loadedVendorId, [page]: 0 });
        setVendor(null);
      },
      text: "SAVE",
    },
  ];

  return (
    <ScreenContainer
      show={loadedVendorId[page]}
      closeFunction={() => setLoadedVendorId({ ...loadedVendorId, [page]: 0 })}
      title={vendor?.name}
      loading={
        isSalesLoading ||
        isClerksLoading ||
        isVendorsLoading ||
        isCustomersLoading ||
        isInventoryLoading ||
        isVendorPaymentsLoading
      }
      buttons={buttons}
      titleClass="bg-col3"
    >
      <div className="flex flex-col w-full">
        <Tabs
          tabs={["General Details", "Sales", "Items", "Payments"]}
          value={tab}
          onChange={setTab}
        />
        <div hidden={tab !== 0}>
          <GeneralDetails
            vendor={vendor}
            setVendor={setVendor}
            vendorDetails={vendorDetails}
          />
        </div>
        <div hidden={tab !== 1}>
          <VendorSales vendorDetails={vendorDetails} />
        </div>
        <div hidden={tab !== 2}>
          <VendorItems />
        </div>
        <div hidden={tab !== 3}>
          <VendorPayments />
        </div>
      </div>
    </ScreenContainer>
  );
}
