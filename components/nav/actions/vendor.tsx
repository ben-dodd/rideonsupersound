import { useAtom } from "jotai";
import { showVendorScreenAtom } from "@/lib/atoms";

import NewIcon from "@mui/icons-material/AddBox";

export default function VendorNavActions() {
  const [, showVendorScreen] = useAtom(showVendorScreenAtom);
  return (
    <div className="flex">
      <button className="icon-text-button" onClick={() => showVendorScreen(-1)}>
        <NewIcon className="mr-1" />
        New Vendor
      </button>
    </div>
  );
}
