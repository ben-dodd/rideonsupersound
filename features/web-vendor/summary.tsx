import Payments from "./payments";
import Sales from "./sales";

export default function Summary({ sales, payments, vendorStoreCredits }) {
  return (
    <div className="w-full">
      {/* <Sales  sales={sales} /> */}
      <div className="mb-8" />
      {/* <Payments payments={payments} /> */}
    </div>
  );
}
