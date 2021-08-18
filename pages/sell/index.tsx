import { useAtom } from "jotai";
import { showCartAtom } from "../api/atoms";

import SellModal from "./modal";
import SearchBar from "./sell-search-bar";
import InventoryScroll from "./inventory-scroll";
import ShoppingCart from "./shopping-cart";

import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";

export default function SellScreen() {
  const [showCart, setShowCart] = useAtom(showCartAtom);

  return (
    <div className="flex relative overflow-x-hidden">
      <SellModal />
      <div
        className={`bg-blue-200 ${
          !showCart ? "w-full" : "w-0"
        } sm:w-2/3 transition-width duration-300`}
      >
        <SearchBar />
        <InventoryScroll />
      </div>
      <div className="relative h-menu w-0">
        <div
          className={`absolute top-1/2 -left-7 bg-white opacity-60 rounded-full w-14 h-12 z-0 flex justify-center items-center sm:hidden ${
            showCart ? "pl-4" : "pr-4"
          }`}
          onClick={() => setShowCart((s) => !s)}
        >
          {showCart ? <ChevronRight /> : <ChevronLeft />}
        </div>
      </div>
      <div
        className={`bg-yellow-200 w-0 sm:w-1/3 ${
          showCart && "w-full"
        } transition-width duration-300`}
      >
        <ShoppingCart />
      </div>
    </div>
  );
}
