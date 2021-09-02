import Modal from "@/components/modal";
import { useAtom } from "jotai";
import { paymentDialogAtom } from "@/lib/atoms";

export default function Cash() {
  const [paymentDialog, setPaymentDialog] = useAtom(paymentDialogAtom);
  return (
    <Modal
      open={paymentDialog === "cash"}
      onClose={() => {
        console.log("on close");
        setPaymentDialog(null);
      }}
    >
      <div>CASH</div>
    </Modal>
  );
}
