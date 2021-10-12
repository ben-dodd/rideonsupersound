import { useAtom } from "jotai";
import { showCreateContactAtom } from "@/lib/atoms";

import NewIcon from "@mui/icons-material/AddBox";

export default function ContactNavActions() {
  const [, showCreateContact] = useAtom(showCreateContactAtom);
  return (
    <div className="flex">
      <button
        className="icon-text-button"
        onClick={() => showCreateContact({ id: 1 })}
      >
        <NewIcon className="mr-1" />
        New Contact
      </button>
    </div>
  );
}
