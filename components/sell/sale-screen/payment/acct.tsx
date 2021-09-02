import Modal from "@/components/modal";
import { useAtom } from "jotai";
import { paymentDialogAtom } from "@/lib/atoms";

export default function Acct() {
  const [paymentDialog, setPaymentDialog] = useAtom(paymentDialogAtom);
  return (
    <Modal open={paymentDialog === "acct"} onClose={() => setPaymentDialog("")}>
      <div>CASH</div>
    </Modal>
  );
}
