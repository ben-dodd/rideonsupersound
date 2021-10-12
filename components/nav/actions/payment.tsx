import { useAtom } from "jotai";
import {
  showBatchPaymentDialogAtom,
  showCashPaymentDialogAtom,
} from "@/lib/atoms";

import NewIcon from "@mui/icons-material/AddBox";
import PayIcon from "@mui/icons-material/Payment";

export default function PaymentNavActions() {
  const [, showBatchPaymentDialog] = useAtom(showBatchPaymentDialogAtom);
  const [, showCashPaymentDialog] = useAtom(showCashPaymentDialogAtom);
  return (
    <div className="flex">
      <button
        className="icon-text-button"
        onClick={() => showCashPaymentDialog(true)}
      >
        <NewIcon className="mr-1" />
        New Manual Payment
      </button>
      <button
        className="icon-text-button"
        onClick={() => showBatchPaymentDialog(true)}
      >
        <PayIcon className="mr-1" />
        Batch Payment
      </button>
    </div>
  );
}
