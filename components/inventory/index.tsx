import InventoryTable from "./inventory-table";
import InventoryItemScreen from "./inventory-item-screen";
import ReceiveStockScreen from "./receive-stock-screen";
import ReturnStockScreen from "./return-stock-screen";
import LabelPrintDialog from "./label-print-dialog";

export default function InventoryScreen() {
  return (
    <div className="flex relative overflow-x-hidden">
      <InventoryTable />
      <InventoryItemScreen />
      <ReceiveStockScreen />
      <ReturnStockScreen />
      <LabelPrintDialog />
    </div>
  );
}
