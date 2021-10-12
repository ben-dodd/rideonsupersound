import { useAtom } from "jotai";
import {
  showReceiveItemsScreenAtom,
  showReturnItemsScreenAtom,
  showPrintLabelsDialogAtom,
} from "@/lib/atoms";

import ReceiveIcon from "@mui/icons-material/AssignmentReturned";
import ReturnIcon from "@mui/icons-material/AssignmentReturn";
import PrintIcon from "@mui/icons-material/Print";

export default function InventoryNavActions() {
  const [, showReceiveItems] = useAtom(showReceiveItemsScreenAtom);
  const [, showReturnItems] = useAtom(showReturnItemsScreenAtom);
  const [, showPrintLabels] = useAtom(showPrintLabelsDialogAtom);
  return (
    <div className="flex">
      <button
        className="icon-text-button"
        onClick={() => showReceiveItems(true)}
      >
        <ReceiveIcon className="mr-1" />
        Receive Items
      </button>
      <button
        className="icon-text-button"
        onClick={() => showReturnItems(true)}
      >
        <ReturnIcon className="mr-1" />
        Return Items
      </button>
      <button
        className="icon-text-button"
        onClick={() => showPrintLabels(true)}
      >
        <PrintIcon className="mr-1" />
        Print Labels
      </button>
    </div>
  );
}
