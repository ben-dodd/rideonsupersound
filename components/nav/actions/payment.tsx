import { useAtom } from "jotai";
import { viewAtom } from "@/lib/atoms";

import NewIcon from "@mui/icons-material/AddBox";
import PayIcon from "@mui/icons-material/Payment";

export default function PaymentNavActions() {
  const [view, setView] = useAtom(viewAtom);
  return (
    <div className="flex">
      <button
        className="icon-text-button"
        onClick={() => setView({ ...view, cashVendorPaymentDialog: true })}
      >
        <NewIcon className="mr-1" />
        New Manual Payment
      </button>
      <button
        className="icon-text-button"
        onClick={() => setView({ ...view, batchVendorPaymentDialog: true })}
      >
        <PayIcon className="mr-1" />
        Batch Payment
      </button>
    </div>
  );
}
