import Payments from "./payments";
import Sales from "./sales";

export default function Summary({ id, sales, payments }) {
  return (
    <div className="w-full">
      <Sales id={id} sales={sales} />
      <div className="mb-8" />
      <Payments payments={payments} />
    </div>
  );
}
