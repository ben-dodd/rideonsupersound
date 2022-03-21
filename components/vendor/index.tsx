// Packages
import { useAtom } from "jotai";

// DB
import { pageAtom, viewAtom } from "@/lib/atoms";

// Components
import VendorTable from "@/components/vendor/vendor-table";
import VendorScreen from "@/components/vendor/vendor-screen";
import InventoryItemScreen from "../inventory/inventory-item-screen";
import ChangePriceDialog from "../inventory/change-price-dialog";
import ChangeStockQuantityDialog from "../inventory/change-stock-quantity-dialog";

export default function VendorPage() {
  // Atoms
  const [page] = useAtom(pageAtom);
  const [view] = useAtom(viewAtom);
  return (
    <div
      className={`flex relative overflow-x-hidden ${
        page !== "vendors" ? "hidden" : ""
      }`}
    >
      {page === "vendors" && <VendorTable />}
      <VendorScreen />
      <InventoryItemScreen page="vendors" />
      {view?.changePriceDialog && <ChangePriceDialog />}
      {view?.changeStockQuantityDialog && <ChangeStockQuantityDialog />}
    </div>
  );
}

// const handlers = useSwipeable({
//   onSwipedRight: () =>
//     showSaleScreen
//       ? setShowSaleScreen(false)
//       : showCreateCustomer?.id
//       ? setShowCreateCustomer({ id: 0 })
//       : showHold
//       ? setShowHold(false)
//       : showCart
//       ? setShowCart(false)
//       : null,
//   onSwipedLeft: () => (!showCart ? setShowCart(true) : null),
//   preventDefaultTouchmoveEvent: true,
// });
