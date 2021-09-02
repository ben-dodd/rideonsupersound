import Modal from "@/components/modal";
import { useAtom } from "jotai";
import { paymentDialogAtom } from "@/lib/atoms";

export default function Gift() {
  const [paymentDialog] = useAtom(paymentDialogAtom);
  return (
    <Modal open={paymentDialog === "gift"}>
      <div>CASH</div>
    </Modal>
  );
}
