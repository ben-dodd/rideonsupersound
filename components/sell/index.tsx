// Packages
import { useAtom } from "jotai";
import { useSwipeable } from "react-swipeable";

// DB
import {
  viewAtom,
  pageAtom,
  newSaleObjectAtom,
  loadedItemIdAtom,
} from "@/lib/atoms";
import { useRegisterID } from "@/lib/swr-hooks";

// Components
import MidScreenContainer from "@/components/container/mid-screen";
import SearchBar from "./sell-search-bar";
import InventoryScroll from "./inventory-scroll";
import ShoppingCart from "./shopping-cart";
import CreateHoldSidebar from "@/components/hold/create-hold-sidebar";
import CreateContactScreen from "@/components/contact/contact-screen";
import SaleScreen from "@/components/sale-screen";
import InventoryItemScreen from "../inventory/inventory-item-screen";
import OpenRegisterScreen from "@/components/register";
import CloseRegisterScreen from "@/components/register/close-register-screen";

// Dialogs
import ReturnCashDialog from "@/components/register/return-cash";
import TakeCashDialog from "@/components/register/take-cash";
import LoadSalesDialog from "@/components/sell/shopping-cart/load-sales";

export default function SellScreen() {
  // SWR
  const { registerID } = useRegisterID();
  const [loadedItemId] = useAtom(loadedItemIdAtom);

  // Atoms
  const [view, setView] = useAtom(viewAtom);
  const [page] = useAtom(pageAtom);
  const [sale, setSale] = useAtom(newSaleObjectAtom);

  const handlers = useSwipeable({
    onSwipedRight: () =>
      Boolean(sale?.id)
        ? setSale(null)
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
      <CreateHoldSidebar />
      <CreateContactScreen />
      {sale?.id && <SaleScreen isNew={true} />}
      {loadedItemId > 0 && <InventoryItemScreen page="sell" />}
      {page === "sell" || (registerID === 0 && <OpenRegisterScreen />)}
      {view?.closeRegisterScreen && <CloseRegisterScreen />}
      {view?.returnCashDialog && <ReturnCashDialog />}
      {view?.takeCashDialog && <TakeCashDialog />}
      {view?.loadSalesDialog && <LoadSalesDialog />}
    </div>
  );
}
