import { useAtom } from "jotai";
import { useEffect } from "react";
import {
  paymentDialogAtom,
  cartAtom,
  saleAtom,
  showCartScreenAtom,
  showSaleScreenAtom,
} from "@/lib/atoms";
import {
  useSaleItemsForSale,
  useSaleTransactionsForSale,
} from "@/lib/swr-hooks";
import Pay from "./pay";
import SaleSummary from "./sale-summary";
import Action from "./action";
import Acct from "./payment/acct";
import Card from "./payment/card";
import Cash from "./payment/cash";
import Gift from "./payment/gift";
import BackIcon from "@mui/icons-material/ChevronLeft";

export default function SaleScreen({ isCart }) {
  const [paymentDialog] = useAtom(paymentDialogAtom);
  const [, setShowSaleScreen] = useAtom(
    isCart ? showCartScreenAtom : showSaleScreenAtom
  );
  const [cart, setCart] = useAtom(isCart ? cartAtom : saleAtom);
  const { items, isSaleItemsLoading } = useSaleItemsForSale(cart?.id);
  const {
    transactions,
    isSaleTransactionsLoading,
  } = useSaleTransactionsForSale(cart?.id);
  useEffect(() => {
    if (!isCart) {
      console.log("setting cart");
      setCart({ ...cart, items, transactions });
    }
  }, [isSaleItemsLoading, isSaleTransactionsLoading]);
  return (
    <>
      {paymentDialog?.method === "acct" && <Acct isCart={isCart} />}
      {paymentDialog?.method === "card" && <Card isCart={isCart} />}
      {paymentDialog?.method === "cash" && <Cash isCart={isCart} />}
      {paymentDialog?.method === "gift" && <Gift isCart={isCart} />}
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
        {isSaleItemsLoading || isSaleTransactionsLoading ? (
          <div className="loading-screen">
            <div className="loading-icon" />
          </div>
        ) : (
          <>
            <div className="flex items-start overflow-auto">
              <div className="w-2/3">
                <SaleSummary isCart={isCart} />
              </div>
              <div className="w-1/3 p-2 flex flex-col justify-between">
                <Pay isCart={isCart} />
                {/*<Action />*/}
              </div>
            </div>
            <Action isCart={isCart} />
          </>
        )}
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
