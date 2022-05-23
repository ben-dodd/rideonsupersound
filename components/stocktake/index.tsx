// Packages
import { useAtom } from "jotai";

// DB
import { useInventory, useLogs, useStocktakeTemplates } from "@/lib/swr-hooks";
import { loadedStocktakeTemplateAtom, pageAtom } from "@/lib/atoms";

// Components
import StocktakeScreen from "./stocktake-screen";
import StocktakeTemplateListItem from "./stocktake-template-list-item";
import StocktakeTemplateScreen from "./stocktake-template-screen";
import StocktakeListScreen from "./stocktake-list-screen";
// import ListStockMovement from "./list-stock-movement";

export default function StocktakesScreen() {
  // SWR
  const [loadedStocktakeTemplate] = useAtom(loadedStocktakeTemplateAtom);

  // Atoms
  const [page] = useAtom(pageAtom);

  return (
    <div
      className={`flex relative overflow-x-hidden ${
        page !== "stocktake" ? "hidden" : ""
      }`}
    >
      {page === "stocktake" && <StocktakeListScreen />}
      {loadedStocktakeTemplate && <StocktakeTemplateScreen />}
    </div>
  );
}
