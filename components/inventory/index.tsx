// Packages
import { useAtom } from "jotai";

// DB
import { pageAtom, viewAtom } from "@/lib/atoms";

// Components
import InventoryTable from "./all-stock-table";
import InventoryItemScreen from "./inventory-item-screen";
import ChangePriceDialog from "./change-price-dialog";
import ChangeStockQuantityDialog from "./change-stock-quantity-dialog";
import ReceiveStockScreen from "./receive-stock-screen";
import ReturnStockScreen from "./return-stock-screen";
import LabelPrintDialog from "./label-print-dialog";
import Tabs from "../_components/navigation/tabs";
import { useState } from "react";
import StockMovementTable from "./stock-movement-table";
import CurrentStockTable from "./current-stock-table";

export default function InventoryScreen() {
  // Atoms
  const [page] = useAtom(pageAtom);
  const [view] = useAtom(viewAtom);
  const [tab, setTab] = useState(0);
  return (
    <div
      className={`flex flex-col relative overflow-x-hidden ${
        page !== "inventory" ? "hidden" : ""
      }`}
    >
      <Tabs
        tabs={["Current Stock", "All Stock", "Stock Movement"]}
        value={tab}
        onChange={setTab}
      />

      <div hidden={tab !== 0} className="overflow-y-scroll">
        {page === "inventory" && <CurrentStockTable />}
      </div>
      <div hidden={tab !== 1}>{page === "inventory" && <InventoryTable />}</div>
      <div hidden={tab !== 2}>
        <StockMovementTable />
      </div>
      <InventoryItemScreen page="inventory" />
      {view?.changePriceDialog && <ChangePriceDialog />}
      {view?.changeStockQuantityDialog && <ChangeStockQuantityDialog />}
      {view?.receiveStockScreen && <ReceiveStockScreen />}
      {view?.returnStockScreen && <ReturnStockScreen />}
      {view?.labelPrintDialog && <LabelPrintDialog />}
    </div>
  );
}
