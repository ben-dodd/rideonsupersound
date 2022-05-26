// Packages
import { useAtom } from "jotai";

// DB
import { loadedStocktakeTemplateIdAtom, pageAtom } from "@/lib/atoms";

// Components
import StocktakeTemplateScreen from "./stocktake-template-screen";
import StocktakeListScreen from "./stocktake-list-screen";
// import ListStockMovement from "./list-stock-movement";

export default function StocktakesScreen() {
  // SWR
  const [loadedStocktakeTemplateId] = useAtom(loadedStocktakeTemplateIdAtom);

  // Atoms
  const [page] = useAtom(pageAtom);

  return (
    <div
      className={`flex relative overflow-x-hidden ${
        page !== "stocktake" ? "hidden" : ""
      }`}
    >
      {page === "stocktake" && <StocktakeListScreen />}
      {loadedStocktakeTemplateId && <StocktakeTemplateScreen />}
    </div>
  );
}
