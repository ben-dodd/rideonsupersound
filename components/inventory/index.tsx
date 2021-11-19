// Packages
import { useAtom } from "jotai";

// DB
import { pageAtom, viewAtom } from "@/lib/atoms";

// Components
import InventoryTable from "./inventory-table";
import InventoryItemScreen from "./inventory-item-screen";
import ChangePriceDialog from "./change-price-dialog";
import ChangeStockQuantityDialog from "./change-stock-quantity-dialog";
import ReceiveStockScreen from "./receive-stock-screen";
import ReturnStockScreen from "./return-stock-screen";
import LabelPrintDialog from "./label-print-dialog";

export default function InventoryScreen() {
  // Atoms
  const [page] = useAtom(pageAtom);
  const [view] = useAtom(viewAtom);
  return (
    <div
      className={`flex relative overflow-x-hidden ${
        page !== "inventory" ? "hidden" : ""
      }`}
    >
      {page === "inventory" && <InventoryTable />}
      <InventoryItemScreen page="inventory" />
      <ChangePriceDialog />
      <ChangeStockQuantityDialog />
      <ReceiveStockScreen />
      <ReturnStockScreen />
      <LabelPrintDialog />
    </div>
  );
}
