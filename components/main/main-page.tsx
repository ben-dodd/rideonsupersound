// Packages
import { useAtom } from "jotai";

// DB
import { alertAtom, pageAtom } from "@/lib/atoms";
import { useInventory } from "@/lib/swr-hooks";

// Components
import Snackbar from "@mui/material/Snackbar";
import Slide from "@mui/material/Slide";
import Alert from "@mui/material/Alert";

import Head from "next/head";
import Nav from "@/components/nav";
import Menu from "@/components/menu";
import SellScreen from "@/components/sell";
import InventoryScreen from "@/components/inventory";
import VendorScreen from "@/components/vendor";
import HoldsScreen from "@/components/hold";
import GiftCardsScreen from "@/components/gift-card";
import PaymentsScreen from "@/components/payment";
import SalesScreen from "@/components/sale";
import LogScreen from "@/components/log";
import TaskScreen from "@/components/jobs";
import ConfirmModal from "@/components/_components/container/modal/confirm-modal";
import HelpDialog from "@/components/help";
import LaybyScreen from "../layby";

export default function MainPage() {
  // Atoms
  const [alert, setAlert] = useAtom(alertAtom);
  const [page] = useAtom(pageAtom);

  // Load necessary data
  useInventory();
  // BUG fix bug where inventory doesn't load. make all pages load until all data there, e.g. in tables

  return (
    <>
      <Head>
        <title>Ride On Super Sound</title>
      </Head>
      <Nav />
      <div className="flex h-menu relative overflow-y-hidden">
        <Menu />
        <div className="h-full w-full absolute sm:static">
          <SellScreen />
          <InventoryScreen />
          <VendorScreen />
          <HoldsScreen />
          <LaybyScreen />
          <GiftCardsScreen />
          <SalesScreen />
          {page === "logs" && <LogScreen />}
          {page === "jobs" && <TaskScreen />}
          <PaymentsScreen />
        </div>
        <HelpDialog />
        <ConfirmModal />
        {/* ALERTS */}
        {alert?.open && (
          <Snackbar
            open={alert?.open}
            onClose={() => setAlert(null)}
            autoHideDuration={alert?.type === "info" ? 2000 : 4000}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            TransitionComponent={Slide}
            transitionDuration={{
              enter: 50,
              exit: 200,
            }}
          >
            <Alert
              severity={alert?.type || "info"}
              action={
                alert.undo ? (
                  <button
                    className="bg-white p-2"
                    onClick={() => {
                      alert?.undo();
                      setAlert(null);
                    }}
                  >
                    UNDO
                  </button>
                ) : null
              }
            >
              {alert?.message || ""}
            </Alert>
          </Snackbar>
        )}
      </div>
    </>
  );
}
