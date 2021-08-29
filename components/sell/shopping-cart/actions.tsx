import { useState } from "react";

// Material UI Icons
import DiscardSaleIcon from "@material-ui/icons/Close";
import RetrieveSaleIcon from "@material-ui/icons/FolderOpen";
import SaveSaleIcon from "@material-ui/icons/Save";
// import DeleteSaleIcon from "@material-ui/icons/Delete";

export default function ShoppingCartActions() {
  const [, setAnchorEl] = useState(null);
  return (
    <div>
      <button
        className={"icon-button-small-white relative"}
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
      <button className="icon-button-small-white">
        <SaveSaleIcon />
      </button>
      <button className="icon-button-small-white">
        <DiscardSaleIcon />
      </button>
    </div>
  );
}
