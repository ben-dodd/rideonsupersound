import { useState } from "react";
import { useAtom } from "jotai";
import { sellModalAtom, showCartAtom } from "../../api/atoms";

export default function ShoppingCart() {
  const [showCart, setShowCart] = useAtom(showCartAtom);
  const [, setSellModal] = useAtom(sellModalAtom);

  return (
    <>
      <div>
        <button onClick={() => setSellModal("Hello there")}>
          Hello there!
        </button>
      </div>
    </>
  );
}
