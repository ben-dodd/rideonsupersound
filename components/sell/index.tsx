import { useAtom } from "jotai";
import { showCartAtom } from "@/lib/atoms";
import { useSwipeable } from "react-swipeable";

import SellModal from "@/components/modal/sell";
import SearchBar from "@/components/sell/sell-search-bar";
import InventoryScroll from "@/components/sell/inventory-scroll";
import ShoppingCart from "@/components/sell/shopping-cart";

export default function SellScreen() {
  const [showCart, setShowCart] = useAtom(showCartAtom);
  const handlers = useSwipeable({
    onSwipedRight: () => (showCart ? setShowCart(false) : null),
    onSwipedLeft: () => (!showCart ? setShowCart(true) : null),
    preventDefaultTouchmoveEvent: true,
  });

  return (
    <div className="flex relative overflow-x-hidden" {...handlers}>
      <SellModal />
      <div
        className={`bg-blue-200 ${
          !showCart ? "w-full" : "w-0"
        } sm:w-2/3 transition-width duration-300 overflow-x-hidden whitespace-nowrap`}
      >
        <SearchBar />
        <InventoryScroll />
      </div>
      <div
        className={`bg-yellow-200 w-0 sm:w-1/3 ${
          showCart && "w-full"
        } transition-width duration-300 overflow-x-hidden whitespace-nowrap`}
      >
        <ShoppingCart />
      </div>
    </div>
  );
}
