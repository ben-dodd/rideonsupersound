import { useAtom } from "jotai";
import { clerkAtom, viewAtom } from "@/lib/atoms";

import NewIcon from "@mui/icons-material/AddBox";
import { saveSystemLog } from "@/lib/db-functions";

export default function StocktakeNavActions() {
  const [view, setView] = useAtom(viewAtom);
  const [clerk] = useAtom(clerkAtom);
  return (
    <div className="flex">
      {/* <button
        className="icon-text-button"
        onClick={() => {
          saveSystemLog("Stocktake Nav - New Stocktake clicked.", clerk?.id);
          setView({ ...view, stocktakeScreen: true });
        }}
      >
        <NewIcon className="mr-1" />
        New Stocktake
      </button> */}
    </div>
  );
}
