import { useAtom } from "jotai";
import {
  showCartAtom,
  showCartScreenAtom,
  showHoldAtom,
  showCreateContactAtom,
} from "@/lib/atoms";
import { useInventory } from "@/lib/swr-hooks";
import { useSwipeable } from "react-swipeable";

import SearchBar from "./sell-search-bar";
import InventoryScroll from "./inventory-scroll";
import ShoppingCart from "./shopping-cart";
import HoldScreen from "@/components/hold/hold-screen";
import CreateContactScreen from "@/components/contact/contact-screen";
import SaleScreen from "@/components/sale-screen";
import InventoryItemScreen from "../inventory/inventory-item-screen";
import PettyCashDialog from "@/components/register/petty-cash";
import CloseRegisterScreen from "@/components/register/close-register-screen";
import MidScreenContainer from "@/components/container/mid-screen";

export default function SellScreen() {
  const [showCart, setShowCart] = useAtom(showCartAtom);
  const [showSaleScreen, setShowSaleScreen] = useAtom(showCartScreenAtom);
  const [showHold, setShowHold] = useAtom(showHoldAtom);
  const [showCreateContact, setShowCreateContact] = useAtom(
    showCreateContactAtom
  );
  useInventory();
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
      <MidScreenContainer>
        <SearchBar />
        <InventoryScroll />
      </MidScreenContainer>
      <ShoppingCart />
      <HoldScreen />
      <CreateContactScreen />
      <SaleScreen isCart={true} />
      <InventoryItemScreen />
      <CloseRegisterScreen />
      <PettyCashDialog />
    </div>
  );
}
