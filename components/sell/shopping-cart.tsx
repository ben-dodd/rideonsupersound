import { useAtom } from "jotai";
import { sellModalAtom, showCartAtom } from "@/lib/atoms";

export default function ShoppingCart() {
  const [showCart, setShowCart] = useAtom(showCartAtom);
  const [, setSellModal] = useAtom(sellModalAtom);

  return (
    <>
      <div>
        <button onClick={() => setSellModal({ open: true })}>
          Hello there!
        </button>
      </div>
    </>
  );
}
