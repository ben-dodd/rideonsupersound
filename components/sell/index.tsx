import { useAtom } from "jotai";
import {
  showCartAtom,
  showSaleScreenAtom,
  showHoldAtom,
  showCreateContactAtom,
} from "@/lib/atoms";
import { useSwipeable } from "react-swipeable";

import SearchBar from "./sell-search-bar";
import InventoryScroll from "./inventory-scroll";
import ShoppingCart from "./shopping-cart";
import HoldScreen from "./hold-screen";
import CreateContactScreen from "./create-contact-screen";
import SaleScreen from "./sale-screen";

export default function SellScreen() {
  const [showCart, setShowCart] = useAtom(showCartAtom);
  const [showSaleScreen, setShowSaleScreen] = useAtom(showSaleScreenAtom);
  const [showHold, setShowHold] = useAtom(showHoldAtom);
  const [showCreateContact, setShowCreateContact] = useAtom(
    showCreateContactAtom
  );
  const handlers = useSwipeable({
    onSwipedRight: () =>
      showSaleScreen
        ? setShowSaleScreen(false)
        : showCreateContact?.id
        ? setShowCreateContact({ id: 0 })
        : showHold
        ? setShowHold(false)
        : showCart
        ? setShowCart(false)
        : null,
    onSwipedLeft: () => (!showCart ? setShowCart(true) : null),
    preventDefaultTouchmoveEvent: true,
  });

  return (
    <div className="flex relative overflow-x-hidden" {...handlers}>
      <div className={`bg-blue-200 w-2/3`}>
        <SearchBar />
        <InventoryScroll />
      </div>
      <div
        className={`absolute top-0 transition-offset duration-300 ${
          showCart ? "left-0" : "left-full"
        } bg-yellow-200 w-1/3 transition-none static h-menu`}
      >
        <ShoppingCart />
      </div>
      <div
        className={`absolute top-0 transition-offset duration-300 ${
          showHold ? "left-0" : "left-full"
        } bg-yellow-200 w-1/3 transition-none static h-menu`}
      >
        <HoldScreen />
      </div>
      <div
        className={`absolute top-0 transition-offset duration-300 ${
          showCreateContact?.id ? "left-0" : "left-full"
        } bg-yellow-200 w-1/3 transition-none static h-menu`}
      >
        <CreateContactScreen />
      </div>
      <div
        className={`absolute top-0 transition-offset duration-300 ${
          showSaleScreen ? "left-0" : "left-1/2"
        } bg-yellow-200 w-1/3 transition-none static h-menu`}
      >
        <SaleScreen />
      </div>
    </div>
  );
}
