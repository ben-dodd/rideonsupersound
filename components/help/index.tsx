// Packages
import { useState, useEffect } from "react";
import { useAtom } from "jotai";

// DB
import { useHelps } from "@/lib/swr-hooks";
import { viewAtom, pageAtom } from "@/lib/atoms";
import { HelpObject } from "@/lib/types";

// Components
import Modal from "@/components/_components/container/modal";
import HelpListItem from "./help-list-item";
import HelpItem from "./help-item";

// Functions
import { filterHelps } from "@/lib/data-functions";

// Icons
import SearchIcon from "@mui/icons-material/Search";
import BackIcon from "@mui/icons-material/ArrowLeft";

export default function HelpDialog() {
  // SWR
  const { helps, isHelpsLoading } = useHelps();

  // Atoms
  const [view, setView] = useAtom(viewAtom);
  const [page] = useAtom(pageAtom);

  // State
  const [search, setSearch] = useState("");
  const [help, setHelp] = useState(null);
  const [helpList, setHelpList] = useState([]);

  useEffect(() => {
    setHelpList(filterHelps(helps, page, view, search));
  }, [search, page, view, helps]);

  return (
    <Modal
      open={view?.helpDialog}
      closeFunction={() => {
        setView({ ...view, helpDialog: false });
        setHelp(null);
        setSearch("");
      }}
      title={"HELP"}
      loading={isHelpsLoading}
      width="max-w-4xl"
    >
      <>
        <div className="h-search py-2 px-2">
          <div
            className={`flex items-center ring-1 ring-gray-400 w-auto bg-gray-100 hover:bg-gray-200 ${
              search && "bg-pink-200 hover:bg-pink-300"
            }`}
          >
            <div className="pl-3 pr-1">
              <SearchIcon />
            </div>
            <input
              className="w-full py-1 px-2 outline-none bg-transparent"
              value={search || ""}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="SEARCH…"
            />
          </div>
        </div>
        <div className="h-dialog overflow-y-auto">
          {help && (
            <button onClick={() => setHelp(null)} className="mb-4">
              <BackIcon /> Go Back
            </button>
          )}
          {help ? (
            <HelpItem help={help} />
          ) : helpList && helpList?.length > 0 ? (
            helpList?.map((h: HelpObject) => (
              <HelpListItem key={h?.id} help={h} setHelp={setHelp} />
            ))
          ) : (
            "No help topics available."
          )}
        </div>
      </>
    </Modal>
  );
}
