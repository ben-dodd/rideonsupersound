import { useAtom } from "jotai";
import { paymentDialogAtom } from "@/lib/atoms";
import Pay from "./pay";
import SaleSummary from "./sale-summary";
import Acct from "./payment/acct";
import Card from "./payment/card";
import Cash from "./payment/cash";
import Gift from "./payment/gift";

export default function SaleScreen() {
  const [paymentDialog] = useAtom(paymentDialogAtom);
  return (
    <div className="flex flex-col justify-between h-menu px-2 bg-white text-black">
      {paymentDialog === "acct" && <Acct />}
      {paymentDialog === "card" && <Card />}
      {paymentDialog === "cash" && <Cash />}
      {paymentDialog === "gift" && <Gift />}
      <Pay />
      <SaleSummary />
    </div>
  );
}
