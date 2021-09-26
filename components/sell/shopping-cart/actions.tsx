import { useState } from "react";
import { useAtom } from "jotai";

import { cartAtom, clerkAtom, showCartAtom } from "@/lib/atoms";
import { saveSaleToDatabase } from "@/lib/db-functions";
// Material UI Icons
import DiscardSaleIcon from "@material-ui/icons/Close";
import RetrieveSaleIcon from "@material-ui/icons/FolderOpen";
import SaveSaleIcon from "@material-ui/icons/Save";
// import DeleteSaleIcon from "@material-ui/icons/Delete";

export default function ShoppingCartActions() {
  const [clerk] = useAtom(clerkAtom);
  const [cart, setCart] = useAtom(cartAtom);
  const [, setShowCart] = useAtom(showCartAtom);
  const [, setAnchorEl] = useState(null);
  function onClickDiscardSale() {
    setCart({ id: null, items: [] });
    setShowCart(false);
  }

  async function onClickSaveSale() {
    // Create new sale in DB or update sale if sale has 'id' property
    saveSaleToDatabase(cart, clerk, "parked");
    setCart({ id: null, items: [] });
    setShowCart(false);
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
      <button className="icon-button-small-white" onClick={onClickSaveSale}>
        <SaveSaleIcon />
      </button>
      <button className="icon-button-small-white" onClick={onClickDiscardSale}>
        <DiscardSaleIcon />
      </button>
    </div>
  );
}
