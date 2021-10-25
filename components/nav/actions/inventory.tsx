import { useAtom } from "jotai";
import { viewAtom } from "@/lib/atoms";

import ReceiveIcon from "@mui/icons-material/AssignmentReturned";
import ReturnIcon from "@mui/icons-material/AssignmentReturn";
import PrintIcon from "@mui/icons-material/Print";

export default function InventoryNavActions() {
  const [view, setView] = useAtom(viewAtom);
  return (
    <div className="flex">
      <button
        className="icon-text-button"
        onClick={() => setView({ ...view, receiveStockScreen: true })}
      >
        <ReceiveIcon className="mr-1" />
        Receive Items
      </button>
      <button
        className="icon-text-button"
        onClick={() => setView({ ...view, returnStockScreen: true })}
      >
        <ReturnIcon className="mr-1" />
        Return Items
      </button>
      <button
        className="icon-text-button"
        onClick={() => setView({ ...view, labelPrintDialog: true })}
      >
        <PrintIcon className="mr-1" />
        Print Labels
      </button>
    </div>
  );
}
