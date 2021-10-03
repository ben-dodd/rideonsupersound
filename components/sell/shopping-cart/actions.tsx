import { useState } from "react";
import { useAtom } from "jotai";
import CircularProgress from "@mui/material/CircularProgress";
import {
  cartAtom,
  clerkAtom,
  showCartAtom,
  confirmModalAtom,
  alertAtom,
} from "@/lib/atoms";
import { useContacts } from "@/lib/swr-hooks";
import { ContactObject } from "@/lib/types";
import { saveSaleAndItemsToDatabase, saveLog } from "@/lib/db-functions";
// Material UI Icons
import DiscardSaleIcon from "@mui/icons-material/Close";
import RetrieveSaleIcon from "@mui/icons-material/FolderOpen";
import SaveSaleIcon from "@mui/icons-material/Save";
// import DeleteSaleIcon from "@mui/icons-material/Delete";

export default function ShoppingCartActions() {
  const [clerk] = useAtom(clerkAtom);
  const [cart, setCart] = useAtom(cartAtom);
  const [, setAlert] = useAtom(alertAtom);
  const [, setConfirmModal] = useAtom(confirmModalAtom);
  const [, setShowCart] = useAtom(showCartAtom);
  const { contacts } = useContacts();
  const [, setAnchorEl] = useState(null);
  const [saveSaleLoading, setSaveSaleLoading] = useState(false);
  function clearCart() {
    setCart({ id: null, items: [] });
    setShowCart(false);
  }

  async function onClickSaveSale() {
    setSaveSaleLoading(true);
    const saleId = await saveSaleAndItemsToDatabase(
      { ...cart, state: "parked" },
      clerk
    );
    saveLog({
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
    });
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
        saveLog({
          log: `Cart cleared.`,
          clerk_id: clerk?.id,
        });
        setAlert({
          open: true,
          type: "warning",
          message: "SALE DISCARDED",
          undo: () => {
            console.log("Undo");
            saveLog({
              log: `Cart uncleared.`,
              clerk_id: clerk?.id,
            });
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
      <button
        className={"icon-button-small-white relative"}
        disabled
        onClick={() => setAnchorEl((e: boolean) => !e)}
      >
        <RetrieveSaleIcon />
      </button>
      {/*<div
          className={`${
            anchorEl ? "block" : "hidden"
          } absolute z-20 bg-white text-black p-2 rounded-b-lg right-0 overflow-scroll w-11/12`}
          onMouseLeave={() =>
            document.addEventListener("click", onClickOutsideListener)
          }
        >
          {sales && Object.keys(sales).length > 0 ? (
            Object.entries(sales)
              .filter(
                ([id, sale]) =>
                  get(sale, "status") !== "complete" &&
                  get(sale, "status") !== "deleted"
              )
              .map(([id, sale]) => (
                <div
                  className="hover:bg-gray-200 cursor-pointer p-1"
                  key={id}
                  onClick={() => {
                    addLog(`Retrieved parked sale.`, "sales", id, currentStaff);
                    dispatch(setLocal("cart", { ...sale, uid: id }));
                    dispatch(
                      setAlert({
                        type: "success",
                        message: "SAVED SALE RETRIEVED.",
                      })
                    );
                    setAnchorEl(null);
                  }}
                >
                  {writeSaleDescription({
                    sale,
                    contacts,
                  }).toUpperCase()}
                </div>
              ))
          ) : (
            <div>NO SAVED SALES</div>
          )}
        </div>*/}
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
      <button
        className="icon-button-small-white"
        onClick={onClickDiscardSale}
        disabled={(cart?.items || []).length < 1}
      >
        <DiscardSaleIcon />
      </button>
    </div>
  );
}
