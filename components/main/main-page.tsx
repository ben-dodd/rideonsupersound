import { useAtom } from "jotai";
import { pageAtom, alertAtom } from "@/lib/atoms";

import Snackbar from "@mui/material/Snackbar";
import Slide from "@mui/material/Slide";
import Alert from "@mui/material/Alert";

import Nav from "@/components/nav";
import Menu from "@/components/menu";
import SellScreen from "@/components/sell";
import ConfirmModal from "@/components/modal/confirm-modal";

export default function MainPage() {
  // Get google auth details
  const [page] = useAtom(pageAtom);
  const [alert, setAlert] = useAtom(alertAtom);

  return (
    <>
      <Nav />
      <div className="flex h-menu relative">
        <Menu />
        <div className="bg-green-500 h-full w-full absolute sm:static">
          {page === "sell" && <SellScreen />}
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
