// Packages
import { useAtom } from "jotai";

// DB
import { useRegisterID } from "@/lib/swr-hooks";
import { clerkAtom, pageAtom, tableModeAtom, viewAtom } from "@/lib/atoms";

// Components
import Image from "next/image";
import Hamburger from "@/components/_components/icon/hamburger";

import SellNavActions from "./actions/sell";
import InventoryNavActions from "./actions/inventory";
import PaymentNavActions from "./actions/payment";
import VendorNavActions from "./actions/vendor";
import TaskNavActions from "./actions/task";

// Icons
import HelpIcon from "@mui/icons-material/Help";
import TableIcon from "@mui/icons-material/TableView";
import { bg } from "@/lib/types";
import StocktakeNavActions from "./actions/stocktake";

// REVIEW fix all actions and clean up files

export default function Nav() {
  // SWR
  const { registerID } = useRegisterID();

  // Atoms
  const [clerk] = useAtom(clerkAtom);
  const [page] = useAtom(pageAtom);
  const [view, setView] = useAtom(viewAtom);
  const [tableMode, setTableMode] = useAtom(tableModeAtom);

  return (
    <nav className={`py-2 ${bg[clerk?.colour]} text-white h-nav`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="ml-4 text-black text-4xl font-black">
            {clerk?.name?.toUpperCase()} @
          </div>
          <div className="ml-4">
            {/*<div className="sm:hidden">{`${clerk?.name?.toUpperCase()} @ R.O.S.S.`}</div>
            <div className="hidden sm:block">{`${clerk?.name?.toUpperCase()} @ RIDE ON SUPER SOUND`}</div>*/}
            <img
              src={`${process.env.NEXT_PUBLIC_RESOURCE_URL}img/POS-RIDEONSUPERSOUNDLOGO.png`}
              alt="Ride On Super Sound"
              height="42px"
              width="493px"
            />
            {/*<div>{page?.toUpperCase()}</div>*/}
          </div>
        </div>
        <div className="flex mr-2">
          {page === "sell" && registerID > 0 && <SellNavActions />}
          {page === "inventory" && <InventoryNavActions />}
          {page === "vendors" && <VendorNavActions />}
          {page === "payments" && <PaymentNavActions />}
          {page === "jobs" && <TaskNavActions />}
          {page === "stocktake" && <StocktakeNavActions />}
          <button
            onClick={() => setTableMode(!tableMode)}
            className={`text-brown-dark hover:text-brown ${
              !tableMode && "opacity-50"
            }`}
          >
            <TableIcon />
          </button>
          <button
            onClick={() => setView({ ...view, helpDialog: true })}
            className="text-brown-dark hover:text-brown"
          >
            <HelpIcon />
          </button>
        </div>
        {/*<button
          className="px-4 sm:hidden"
          onClick={() => setView({...view, mainMenu: !view?.mainMenu})}
        >
          <Hamburger />
        </button>*/}
      </div>
    </nav>
  );
}

// <div
// className="bg-white rounded-full mx-2">
// <Image
//
//   layout="fill"
//   src={`${image ? URL.createObjectURL(blob) : "/clerk/guest.png"}`}
//   alt={clerk?.name}
// /></div>
