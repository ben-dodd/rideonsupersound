// Packages
import { useAtom } from "jotai";

// DB
import { alertAtom } from "@/lib/atoms";
import { useInventory } from "@/lib/swr-hooks";

// Components
import Snackbar from "@mui/material/Snackbar";
import Slide from "@mui/material/Slide";
import Alert from "@mui/material/Alert";

import Nav from "@/components/nav";
import Menu from "@/components/menu";
import SellScreen from "@/components/sell";
import OpenRegisterScreen from "@/components/register";
import InventoryScreen from "@/components/inventory";
import VendorScreen from "@/components/vendor";
import ContactScreen from "@/components/contact";
import GiftCardsScreen from "@/components/gift-card";
import PaymentsScreen from "@/components/payment";
import SalesScreen from "@/components/sale";
import LogScreen from "@/components/log";
import ConfirmModal from "@/components/container/modal/confirm-modal";

export default function MainPage() {
  // Atoms
  const [alert, setAlert] = useAtom(alertAtom);

  // Load necessary data
  useInventory();

  return (
    <>
      <Nav />
      <div className="flex h-menu relative">
        <Menu />
        <div className="bg-green-500 h-full w-full absolute sm:static">
          <SellScreen />
          <OpenRegisterScreen />
          <InventoryScreen />
          <VendorScreen />
          <ContactScreen />
          <GiftCardsScreen />
          <SalesScreen />
          <LogScreen />
          <PaymentsScreen />
        </div>
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
