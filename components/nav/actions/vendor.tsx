import { useAtom } from "jotai";
import { viewAtom } from "@/lib/atoms";

import NewIcon from "@mui/icons-material/AddBox";

export default function VendorNavActions() {
  const [view, setView] = useAtom(viewAtom);
  return (
    <div className="flex">
      <button
        className="icon-text-button"
        onClick={() => setView({ ...view, vendorScreen: true })}
      >
        <NewIcon className="mr-1" />
        New Vendor
      </button>
    </div>
  );
}
