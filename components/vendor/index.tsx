import VendorTable from "@/components/vendor/vendor-table";
import VendorScreen from "@/components/vendor/vendor-screen";

export default function SellScreen() {
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

  return (
    <div className="flex relative overflow-x-hidden">
      <VendorTable />
      <VendorScreen />
    </div>
  );
}
