import { useAtom } from "jotai";
import { showCartAtom, showHoldAtom, showCreateContactAtom } from "@/lib/atoms";
import { useSwipeable } from "react-swipeable";

import SellModal from "@/components/modal/sell";
import SearchBar from "@/components/sell/sell-search-bar";
import InventoryScroll from "@/components/sell/inventory-scroll";
import ShoppingCart from "@/components/sell/shopping-cart";
import HoldScreen from "@/components/sell/hold-screen";
import CreateContactScreen from "@/components/sell/create-contact-screen";

export default function SellScreen() {
  const [showCart, setShowCart] = useAtom(showCartAtom);
  const [showHold, setShowHold] = useAtom(showHoldAtom);
  const [showCreateContact, setShowCreateContact] = useAtom(
    showCreateContactAtom
  );
  const handlers = useSwipeable({
    onSwipedRight: () =>
      showHold ? setShowHold(false) : showCart ? setShowCart(false) : null,
    onSwipedLeft: () => (!showCart ? setShowCart(true) : null),
    preventDefaultTouchmoveEvent: true,
  });

  return (
    <div className="flex relative overflow-x-hidden" {...handlers}>
      <SellModal />
      <div className={`bg-blue-200 w-full sm:w-2/3`}>
        <SearchBar />
        <InventoryScroll />
      </div>
      <div
        className={`absolute top-0 transition-offset duration-300 ${
          showCart ? "left-0" : "left-full"
        } h-full w-full bg-yellow-200 sm:w-1/3 sm:transition-none sm:static sm:h-menu`}
      >
        <ShoppingCart />
      </div>
      <div
        className={`absolute top-0 transition-offset duration-300 ${
          showHold ? "left-0" : "left-full"
        } h-full w-full bg-yellow-200 sm:w-1/3 sm:transition-none sm:static sm:h-menu`}
      >
        <HoldScreen />
      </div>
      <div
        className={`absolute top-0 transition-offset duration-300 ${
          showHold ? "left-0" : "left-full"
        } h-full w-full bg-yellow-200 sm:w-1/3 sm:transition-none sm:static sm:h-menu`}
      >
        <CreateContactScreen />
      </div>
    </div>
  );
}
