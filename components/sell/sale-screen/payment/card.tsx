import Modal from "@/components/modal";
import { useAtom } from "jotai";
import { paymentDialogAtom } from "@/lib/atoms";

export default function Card() {
  const [paymentDialog] = useAtom(paymentDialogAtom);
  return (
    <Modal open={paymentDialog === "card"}>
      <div className="h-1/2">CASH</div>
    </Modal>
  );
}
