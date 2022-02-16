// Packages
import { useAtom } from "jotai";
import { useSwipeable } from "react-swipeable";

// DB
import {
  viewAtom,
  pageAtom,
  cartAtom,
  loadedItemIdAtom,
  bypassRegisterAtom,
} from "@/lib/atoms";
import { useRegisterID } from "@/lib/swr-hooks";

// Components
import MidScreenContainer from "@/components/_components/container/mid-screen";
import SearchBar from "./sell-search-bar";
import InventoryScroll from "./inventory-scroll";
import ShoppingCart from "./shopping-cart";
import CreateHoldSidebar from "@/components/hold/create-hold-sidebar";
import CreateCustomerSidebar from "@/components/customer/create-customer-sidebar";
import SaleScreen from "@/components/sale-screen";
import InventoryItemScreen from "../inventory/inventory-item-screen";
import OpenRegisterScreen from "@/components/register";
import CloseRegisterScreen from "@/components/register/close-register-screen";

// Dialogs
import ChangePriceDialog from "@/components/inventory/change-price-dialog";
import ChangeStockQuantityDialog from "@/components/inventory/change-stock-quantity-dialog";
import ReturnCashDialog from "@/components/register/return-cash";
import TakeCashDialog from "@/components/register/take-cash";
// import LoadSalesDialog from "@/components/sell/shopping-cart/load-sales";
import GiftCardDialog from "@/components/sell/inventory-scroll/gift-card-dialog";
import MiscItemDialog from "@/components/sell/inventory-scroll/misc-item-dialog";

export default function SellScreen() {
  // SWR
  const { registerID } = useRegisterID();
  const [loadedItemId] = useAtom(loadedItemIdAtom);

  // Atoms
  const [view, setView] = useAtom(viewAtom);
  const [page] = useAtom(pageAtom);
  const [bypassRegister] = useAtom(bypassRegisterAtom);

  const handlers = useSwipeable({
    onSwipedRight: () =>
      view?.saleScreen
        ? setView({ ...view, saleScreen: false })
        : view?.createCustomer
        ? setView({ ...view, createCustomer: false })
        : view?.createHold
        ? setView({ ...view, createHold: false })
        : view?.cart
        ? setView({ ...view, cart: false })
        : null,
    onSwipedLeft: () => (!view?.cart ? setView({ ...view, cart: true }) : null),
    preventDefaultTouchmoveEvent: true,
  });

  return registerID === 0 && !bypassRegister ? (
    <OpenRegisterScreen />
  ) : (
    <div
      className={`flex relative overflow-x-hidden ${
        page !== "sell" || (registerID < 1 && !bypassRegister) ? "hidden" : ""
      }`}
      {...handlers}
    >
      <MidScreenContainer>
        <SearchBar />
        <InventoryScroll />
      </MidScreenContainer>
      <ShoppingCart />
      <CreateHoldSidebar />
      <CreateCustomerSidebar />
      {view?.saleScreen && <SaleScreen />}
      {view?.miscItemDialog && <MiscItemDialog />}
      {view?.giftCardDialog && <GiftCardDialog />}
      {loadedItemId && <InventoryItemScreen page="sell" />}
      {view?.changePriceDialog && <ChangePriceDialog />}
      {view?.changeStockQuantityDialog && <ChangeStockQuantityDialog />}
      {view?.closeRegisterScreen && <CloseRegisterScreen />}
      {view?.returnCashDialog && <ReturnCashDialog />}
      {view?.takeCashDialog && <TakeCashDialog />}
    </div>
  );
}
