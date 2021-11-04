// Packages
import { useAtom } from "jotai";
import { useSwipeable } from "react-swipeable";

// DB
import { viewAtom, pageAtom } from "@/lib/atoms";
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
import CloseRegisterScreen from "@/components/register/close-register-screen";

// Dialogs
import ReturnCashDialog from "@/components/register/return-cash";
import TakeCashDialog from "@/components/register/take-cash";
import LoadSalesDialog from "@/components/sell/shopping-cart/load-sales";

export default function SellScreen() {
  // SWR
  const { registerID } = useRegisterID();

  // Atoms
  const [view, setView] = useAtom(viewAtom);
  const [page] = useAtom(pageAtom);

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
      <CreateHoldSidebar />
      <CreateContactScreen />
      <SaleScreen isNew={true} />
      <InventoryItemScreen page="sell" />
      <CloseRegisterScreen />
      <ReturnCashDialog />
      <TakeCashDialog />
      <LoadSalesDialog />
    </div>
  );
}
