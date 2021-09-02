import Pay from "./pay";
import SaleSummary from "./sale-summary";
import Acct from "./payment/acct";
import Card from "./payment/card";
import Cash from "./payment/cash";
import Gift from "./payment/gift";

export default function SaleScreen() {
  return (
    <div className="flex flex-col justify-between h-menu px-2 bg-white text-black">
      <Acct />
      <Card />
      <Cash />
      <Gift />
      {/*<div className="flex justify-between mb-2 relative">
        <div className="text-lg my-2 tracking-wide self-center">New Sale</div>
      </div>*/}
      <Pay />
      <SaleSummary />
    </div>
  );
}
