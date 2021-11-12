import { useAtom } from "jotai";
import { viewAtom } from "@/lib/atoms";

import NewIcon from "@mui/icons-material/AddBox";

export default function CustomerNavActions() {
  const [view, setView] = useAtom(viewAtom);
  return (
    <div className="flex">
      <button
        className="icon-text-button"
        onClick={() => setView({ ...view, createCustomer: true })}
      >
        <NewIcon className="mr-1" />
        New Customer
      </button>
    </div>
  );
}
