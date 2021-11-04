// Packages
import { useState } from "react";
import { useAtom } from "jotai";

// DB
import { useContacts, useLogs, useSales } from "@/lib/swr-hooks";
import {
  newSaleObjectAtom,
  clerkAtom,
  viewAtom,
  confirmModalAtom,
  alertAtom,
} from "@/lib/atoms";
import { ContactObject } from "@/lib/types";

// Functions
import { saveSaleAndItemsToDatabase, saveLog } from "@/lib/db-functions";

// Components
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";

// Icons
import DiscardSaleIcon from "@mui/icons-material/Close";
import RetrieveSaleIcon from "@mui/icons-material/FolderOpen";
import SaveSaleIcon from "@mui/icons-material/Save";

// TODO add mutate logs to all logs

export default function ShoppingCartActions() {
  // SWR
  const { contacts } = useContacts();
  const { mutateLogs } = useLogs();
  const { mutateSales } = useSales();

  // Atoms
  const [clerk] = useAtom(clerkAtom);
  const [cart, setCart] = useAtom(newSaleObjectAtom);
  const [, setAlert] = useAtom(alertAtom);
  const [, setConfirmModal] = useAtom(confirmModalAtom);
  const [view, setView] = useAtom(viewAtom);

  // State
  const [, setAnchorEl] = useState(null);
  const [saveSaleLoading, setSaveSaleLoading] = useState(false);

  // Functions
  function clearCart() {
    setCart({ id: null, items: [] });
    setView({ ...view, cart: false });
  }

  function onClickLoadSales() {
    setView({ ...view, loadSalesDialog: true });
  }

  async function onClickSaveSale() {
    setSaveSaleLoading(true);
    const saleId = await saveSaleAndItemsToDatabase(
      { ...cart, state: "parked" },
      clerk
    );
    saveLog(
      {
        log: `Sale parked (${cart?.items.length} item${
          cart?.items.length === 1 ? "" : "s"
        }${
          cart?.contact_id
            ? ` for ${
                (contacts || []).filter(
                  (c: ContactObject) => c?.id === cart?.contact_id
                )[0]?.name
              }.`
            : ""
        }).`,
        clerk_id: clerk?.id,
        table_id: "sale",
        row_id: saleId,
      },
      mutateLogs
    );
    mutateSales();
    setAlert({
      open: true,
      type: "success",
      message: "SALE PARKED",
    });
    clearCart();
    setSaveSaleLoading(false);
  }

  async function onClickDiscardSale() {
    setConfirmModal({
      open: true,
      title: "Are you sure?",
      message: "Are you sure you want to clear the cart of all items?",
      yesText: "DISCARD SALE",
      action: () => {
        saveLog(
          {
            log: `Cart cleared.`,
            clerk_id: clerk?.id,
          },
          mutateLogs
        );
        setAlert({
          open: true,
          type: "warning",
          message: "SALE DISCARDED",
          undo: () => {
            console.log("Undo");
            saveLog(
              {
                log: `Cart uncleared.`,
                clerk_id: clerk?.id,
              },
              mutateLogs
            );
            setCart({ ...cart });
          },
        });
        clearCart();
      },
      noText: "CANCEL",
    });
  }

  // TODO Shopping cart actions

  return (
    <div>
      <Tooltip title="Load parked sales and laybys">
        <button
          className={"icon-button-small-white relative"}
          onClick={onClickLoadSales}
        >
          <RetrieveSaleIcon />
        </button>
      </Tooltip>
      <Tooltip title="Park sale">
        <button
          className="icon-button-small-white"
          onClick={onClickSaveSale}
          disabled={saveSaleLoading || (cart?.items || []).length < 1}
        >
          {saveSaleLoading ? (
            <CircularProgress color="inherit" size={16} />
          ) : (
            <SaveSaleIcon />
          )}
        </button>
      </Tooltip>
      <Tooltip title="Discard sale">
        <button
          className="icon-button-small-white"
          onClick={onClickDiscardSale}
          disabled={(cart?.items || []).length < 1}
        >
          <DiscardSaleIcon />
        </button>
      </Tooltip>
    </div>
  );
}
