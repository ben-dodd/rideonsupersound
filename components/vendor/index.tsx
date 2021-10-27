import VendorTable from "@/components/vendor/vendor-table";
import VendorScreen from "@/components/vendor/vendor-screen";
import { useAtom } from "jotai";
import { pageAtom } from "@/lib/atoms";

export default function VendorPage() {
  // const handlers = useSwipeable({
  //   onSwipedRight: () =>
  //     showSaleScreen
  //       ? setShowSaleScreen(false)
  //       : showCreateContact?.id
  //       ? setShowCreateContact({ id: 0 })
  //       : showHold
  //       ? setShowHold(false)
  //       : showCart
  //       ? setShowCart(false)
  //       : null,
  //   onSwipedLeft: () => (!showCart ? setShowCart(true) : null),
  //   preventDefaultTouchmoveEvent: true,
  // });

  const [page] = useAtom(pageAtom);

  return (
    <div
      className={`flex relative overflow-x-hidden ${
        page !== "vendors" ? "hidden" : ""
      }`}
    >
      <VendorTable />
      <VendorScreen />
    </div>
  );
}
