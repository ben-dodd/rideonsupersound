import { viewAtom } from "@/lib/atoms";
import { InventoryObject } from "@/lib/types";
import { useAtom } from "jotai";

interface stockDetailsProps {
  item: InventoryObject;
}

export default function StockDetails({ item }: stockDetailsProps) {
  const [view, setView] = useAtom(viewAtom);

  return (
    <div className="grid grid-cols-4 justify-items-start rounded border p-2 mt-2">
      <div className="stock-indicator__container">IN STOCK</div>
      <div
        className={`stock-indicator__number ${
          item?.quantity <= 0 ? "bg-tertiary-light" : "bg-primary-light"
        }`}
      >
        {item?.quantity || 0}
      </div>
      <div className="stock-indicator__container">RECEIVED</div>
      <div className="stock-indicator__number bg-secondary-light">
        {item?.quantity_received || 0}
      </div>
      <div className="stock-indicator__container">SOLD</div>
      <div className="stock-indicator__number bg-secondary-light">
        {Math.abs(item?.quantity_sold || 0)}
      </div>
      <div className="stock-indicator__container">RETURNED</div>
      <div className="stock-indicator__number bg-secondary-light">
        {Math.abs(item?.quantity_returned || 0)}
      </div>
      <div className="stock-indicator__container">LAYBY/HOLD</div>
      <div className="stock-indicator__number bg-secondary-light">
        {(item?.quantity_layby +
          item?.quantity_hold +
          item?.quantity_unlayby +
          item?.quantity_unhold) *
          -1}
      </div>
      <div className="stock-indicator__container">DISCARD/LOST</div>
      <div className="stock-indicator__number bg-secondary-light">
        {(item?.quantity_discarded +
          item?.quantity_lost +
          item?.quantity_found) *
          -1}
      </div>
      <div className="stock-indicator__container">ADJUSTMENT</div>
      <div
        className={`stock-indicator__number ${
          item?.quantity_adjustment < 0
            ? "bg-tertiary-light"
            : "bg-secondary-light"
        }`}
      >
        {item?.quantity_adjustment || 0}
      </div>
      <div className="col-span-2">
        <button
          onClick={() => setView({ ...view, changeStockQuantityDialog: true })}
          className="text-sm border rounded p-2 self-center bg-white text-brown-dark w-100 hover:bg-gray-100"
        >
          CHANGE STOCK LEVEL
        </button>
      </div>
    </div>
  );
}
