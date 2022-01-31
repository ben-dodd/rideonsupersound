import { useAtom } from "jotai";
import { viewAtom } from "@/lib/atoms";

import NewIcon from "@mui/icons-material/AddBox";

export default function TaskNavActions() {
  const [view, setView] = useAtom(viewAtom);
  return (
    <div className="flex">
      <button
        className="icon-text-button"
        onClick={() => setView({ ...view, taskDialog: true })}
      >
        <NewIcon className="mr-1" />
        New Job
      </button>
    </div>
  );
}
