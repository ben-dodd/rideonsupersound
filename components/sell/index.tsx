import { useAtom } from "jotai";
import { viewAtom, pageAtom } from "@/lib/atoms";
import { useInventory, useRegisterID } from "@/lib/swr-hooks";
import { useSwipeable } from "react-swipeable";

import SearchBar from "./sell-search-bar";
import InventoryScroll from "./inventory-scroll";
import ShoppingCart from "./shopping-cart";
import HoldScreen from "@/components/hold/hold-screen";
import CreateContactScreen from "@/components/contact/contact-screen";
import SaleScreen from "@/components/sale-screen";
import InventoryItemScreen from "../inventory/inventory-item-screen";
import ReturnCashDialog from "@/components/register/return-cash";
import TakeCashDialog from "@/components/register/take-cash";
import CloseRegisterScreen from "@/components/register/close-register-screen";
import MidScreenContainer from "@/components/container/mid-screen";

export default function SellScreen() {
  const [view, setView] = useAtom(viewAtom);
  const { registerID } = useRegisterID();
  const [page] = useAtom(pageAtom);
  useInventory();
  const handlers = useSwipeable({
    onSwipedRight: () =>
      view?.saleScreen
        ? setView({ ...view, saleScreen: false })
        : view?.createContact
        ? setView({ ...view, createContact: false })
        : view?.createHold
        ? setView({ ...view, createHold: false })
        : view?.cart
        ? setView({ ...view, cart: false })
        : null,
    onSwipedLeft: () => (!view?.cart ? setView({ ...view, cart: true }) : null),
    preventDefaultTouchmoveEvent: true,
  });

  return (
    <div
      className={`flex relative overflow-x-hidden ${
        page !== "sell" || registerID < 1 ? "hidden" : ""
      }`}
      {...handlers}
    >
      <MidScreenContainer>
        <SearchBar />
        <InventoryScroll />
      </MidScreenContainer>
      <ShoppingCart />
      <HoldScreen />
      <CreateContactScreen />
      <SaleScreen isNew={true} />
      <InventoryItemScreen page="sell" />
      <CloseRegisterScreen />
      <ReturnCashDialog />
      <TakeCashDialog />
    </div>
  );
}
