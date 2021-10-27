import { useAtom } from "jotai";
import { loadedVendorIdAtom } from "@/lib/atoms";

import NewIcon from "@mui/icons-material/AddBox";

export default function VendorNavActions() {
  const [loadedVendorId, setLoadedVendorId] = useAtom(loadedVendorIdAtom);
  // Change to create vendor dialog
  return (
    <div className="flex">
      <button
        className="icon-text-button"
        onClick={() => setLoadedVendorId({ ...loadedVendorId, vendors: 4 })}
      >
        <NewIcon className="mr-1" />
        New Vendor
      </button>
    </div>
  );
}
