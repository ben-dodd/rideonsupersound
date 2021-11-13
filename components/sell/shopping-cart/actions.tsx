// Packages
import { useState } from "react";
import { useAtom } from "jotai";

// DB
import {
  useCustomers,
  useLogs,
  useSales,
  useSaleItems,
  useStockInventory,
} from "@/lib/swr-hooks";
import {
  newSaleObjectAtom,
  clerkAtom,
  viewAtom,
  confirmModalAtom,
  alertAtom,
} from "@/lib/atoms";

// Functions
import { saveSaleAndPark, saveLog } from "@/lib/db-functions";

// Components
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";

// Icons
import DiscardSaleIcon from "@mui/icons-material/Close";
import RetrieveSaleIcon from "@mui/icons-material/FolderOpen";
import SaveSaleIcon from "@mui/icons-material/Save";

// REVIEW add mutate logs to all logs

export default function ShoppingCartActions() {
  // SWR
  const { customers } = useCustomers();
  const { logs, mutateLogs } = useLogs();
  const { sales, mutateSales } = useSales();
  const { saleItems, mutateSaleItems } = useSaleItems();
  const { mutateInventory } = useStockInventory();

  // Atoms
  const [clerk] = useAtom(clerkAtom);
  const [cart, setCart] = useAtom(newSaleObjectAtom);
  const [, setAlert] = useAtom(alertAtom);
  const [, setConfirmModal] = useAtom(confirmModalAtom);
  const [view, setView] = useAtom(viewAtom);

  // State
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
    await saveSaleAndPark(
      cart,
      cart?.items,
      clerk,
      customers,
      logs,
      mutateLogs,
      sales,
      mutateSales,
      saleItems,
      mutateSaleItems,
      mutateInventory
    );
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
          logs,
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
              logs,
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
          disabled={Boolean(
            saveSaleLoading || !cart || !cart?.items || cart?.items?.length < 1
          )}
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
          disabled={Boolean(!cart || !cart?.items || cart?.items?.length < 1)}
        >
          <DiscardSaleIcon />
        </button>
      </Tooltip>
    </div>
  );
}
