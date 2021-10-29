// Packages
import { useAtom } from "jotai";

// DB
import { sellSearchBarAtom } from "@/lib/atoms";

// Components
import Tooltip from "@mui/material/Tooltip";

// Icons
import SearchIcon from "@mui/icons-material/Search";

export default function SellSearchBar() {
  // Atoms
  const [search, setSearch] = useAtom(sellSearchBarAtom);

  return (
    <div className="h-search py-2 px-2">
      <Tooltip title="Search by artist, title, SKU, genre, and many more. To add a Misc. Item or a Gift Card, just type that in.">
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
      </Tooltip>
    </div>
  );
}
