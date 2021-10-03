import { useAtom } from "jotai";
import { paymentDialogAtom, cartAtom, showSaleScreenAtom } from "@/lib/atoms";
import Pay from "./pay";
import SaleSummary from "./sale-summary";
import Action from "./action";
import Acct from "./payment/acct";
import Card from "./payment/card";
import Cash from "./payment/cash";
import Gift from "./payment/gift";
import BackIcon from "@mui/icons-material/ChevronLeft";

export default function SaleScreen() {
  const [paymentDialog] = useAtom(paymentDialogAtom);
  const [, setShowSaleScreen] = useAtom(showSaleScreenAtom);
  const [cart] = useAtom(cartAtom);
  console.log(cart);
  return (
    <>
      {paymentDialog?.method === "acct" && <Acct />}
      {paymentDialog?.method === "card" && <Card />}
      {paymentDialog?.method === "cash" && <Cash />}
      {paymentDialog?.method === "gift" && <Gift />}
      <div className="bg-white h-menu flex flex-col">
        <div className="dialog__title--has-actions">
          <button
            className="icon-button-small-black pr-2"
            onClick={() => setShowSaleScreen(false)}
          >
            <BackIcon />
          </button>
          {`SALE #${cart?.id} [${
            cart?.state ? cart?.state.toUpperCase() : "IN PROGRESS"
          }]`}
        </div>
        <div className="flex items-start overflow-auto">
          <div className="w-2/3">
            <SaleSummary />
          </div>
          <div className="w-1/3 p-2 flex flex-col justify-between">
            <Pay />
            {/*<Action />*/}
          </div>
        </div>
        <Action />
      </div>
    </>
  );
}

// hidden sm:flex items-start overflow-auto

// <div className="sm:hidden flex flex-col justify-between px-2">
//   <Pay />
//   <SaleSummary />
//   <Action />
// </div>
