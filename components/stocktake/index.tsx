// Packages
import { useAtom } from "jotai";

// DB
import { useLogs, useStockMovements } from "@/lib/swr-hooks";
import { pageAtom } from "@/lib/atoms";
import { LogObject, StockMovementObject } from "@/lib/types";

// Components
// import ListLog from "./list-log";
import Tabs from "../_components/navigation/tabs";
import { useState } from "react";
// import ListStockMovement from "./list-stock-movement";

export default function StocktakeScreen() {
  // SWR
  const { logs, isLogsLoading } = useLogs();
  const { stockMovements, isStockMovementsLoading } = useStockMovements();

  // Atoms
  const [page] = useAtom(pageAtom);
  const [tab, setTab] = useState(0);

  return (
    <div
      className={`flex flex-col overflow-x-hidden ${
        page !== "stocktake" ? "hidden" : ""
      }`}
    >
      <div className="bg-col1 text-4xl font-bold uppercase text-white p-2 mb-1">
        Stocktake
      </div>
      {/* <Tabs tabs={["Logs", "Stock Movement"]} value={tab} onChange={setTab} /> */}

      <div className="h-menu w-full overflow-y-scroll px-2 bg-white"></div>
    </div>
  );
}
