import Modal from "@/components/modal";
import { useAtom } from "jotai";
import { sellModalAtom } from "@/lib/atoms";

export default function SellModal() {
  const [sellModal, setSellModal] = useAtom(sellModalAtom);
  return (
    <Modal
      open={sellModal?.open}
      onClose={() => setSellModal({ open: false, ...sellModal })}
    >
      Test
    </Modal>
  );
}
