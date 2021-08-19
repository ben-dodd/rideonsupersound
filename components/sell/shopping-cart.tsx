import { useAtom } from "jotai";
import { sellModalAtom } from "@/lib/atoms";

export default function ShoppingCart() {
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
