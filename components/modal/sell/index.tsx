import Modal from "@/components/modal";
import { useAtom } from "jotai";
import { sellModalAtom } from "@/lib/atoms";

export default function SellModal() {
  const [sellModal, setSellModal] = useAtom(sellModalAtom);
  return (
    <Modal open={Boolean(sellModal)} onClose={() => setSellModal(null)}>
      {sellModal}
    </Modal>
  );
}
