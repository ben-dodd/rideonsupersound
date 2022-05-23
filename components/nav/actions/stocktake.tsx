import { useAtom } from "jotai";
import { clerkAtom, loadedStocktakeTemplateAtom, viewAtom } from "@/lib/atoms";

import NewIcon from "@mui/icons-material/AddBox";
import { saveSystemLog } from "@/lib/db-functions";

export default function StocktakeNavActions() {
  const [view, setView] = useAtom(viewAtom);
  const [, setLoadedStocktakeTemplate] = useAtom(loadedStocktakeTemplateAtom);
  const [clerk] = useAtom(clerkAtom);
  return (
    <div className="flex">
      <button
        className="icon-text-button"
        onClick={() => {
          saveSystemLog("Stocktake Nav - New Stocktake clicked.", clerk?.id);
          setView({ ...view, stocktakeTemplateScreen: true });
          setLoadedStocktakeTemplate({});
        }}
      >
        <NewIcon className="mr-1" />
        New Stocktake Template
      </button>
    </div>
  );
}
