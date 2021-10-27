import InventoryTable from "./inventory-table";
import InventoryItemScreen from "./inventory-item-screen";
import ReceiveStockScreen from "./receive-stock-screen";
import ReturnStockScreen from "./return-stock-screen";
import LabelPrintDialog from "./label-print-dialog";
import { useAtom } from "jotai";
import { pageAtom } from "@/lib/atoms";

export default function InventoryScreen() {
  const [page] = useAtom(pageAtom);
  return (
    <div
      className={`flex relative overflow-x-hidden ${
        page !== "inventory" ? "hidden" : ""
      }`}
    >
      <InventoryTable />
      <InventoryItemScreen page="inventory" />
      <ReceiveStockScreen />
      <ReturnStockScreen />
      <LabelPrintDialog />
    </div>
  );
}
