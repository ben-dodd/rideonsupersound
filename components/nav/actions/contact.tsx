import { useAtom } from "jotai";
import { viewAtom } from "@/lib/atoms";

import NewIcon from "@mui/icons-material/AddBox";

export default function ContactNavActions() {
  const [view, setView] = useAtom(viewAtom);
  return (
    <div className="flex">
      <button
        className="icon-text-button"
        onClick={() => setView({ ...view, createContact: true })}
      >
        <NewIcon className="mr-1" />
        New Contact
      </button>
    </div>
  );
}
