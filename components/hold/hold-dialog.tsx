import { useState } from "react";
import { useAtom } from "jotai";
import { viewAtom, clerkAtom, loadedHoldIdAtom, pageAtom } from "@/lib/atoms";
import { useHold } from "@/lib/swr-hooks";
import Modal from "@/components/container/modal/base";
import { daysFrom } from "@/lib/data-functions";
import { returnHoldToStock, updateHoldInDatabase } from "@/lib/db-functions";

// Material UI Components
import TextField from "@/components/inputs/text-field";

// Custom Components
import HoldListItem from "./list-item";
import CloseButton from "@/components/button/close-button";

export default function HoldDialog() {
  const [view, setView] = useAtom(viewAtom);
  const [loadedHoldId, setLoadedHoldId] = useAtom(loadedHoldIdAtom);
  const [clerk] = useAtom(clerkAtom);
  const [page] = useAtom(pageAtom);
  const { hold } = useHold(loadedHoldId[page]);
  const [holdPeriod, setHoldPeriod] = useState(null);
  const [notes, setNotes] = useState(null);

  return (
    <Modal
      open={view?.holdDialog}
      onClose={() => setLoadedHoldId({ ...loadedHoldId, [page]: 0 })}
    >
      <CloseButton
        closeFunction={() => setLoadedHoldId({ ...loadedHoldId, [page]: 0 })}
      />
      <div className="p-4">
        <div className="text-center text-4xl font-bold py-2">HOLD ITEM</div>
      </div>
      <HoldListItem cartItem={hold} />
      <div>{`Item held for ${daysFrom(hold?.date_from)} of ${
        hold?.hold_period || 30
      } days.`}</div>
      <TextField
        inputLabel="Hold Period"
        value={hold?.hold_period}
        onChange={(e: any) => setHoldPeriod(e.target.value)}
      />
      <TextField
        inputLabel="Notes"
        className="mb-4"
        value={hold?.note}
        onChange={(e: any) => setNotes(e.target.value)}
        multiline
      />
      <div className="grid grid-cols-4">
        <button
          className="dialog__footer-buttons--cancel"
          onClick={() => setLoadedHoldId({ ...loadedHoldId, [page]: 0 })}
        >
          Cancel
        </button>
        <button
          className="dialog__footer-buttons--quarternary"
          onClick={() => returnHoldToStock(hold, clerk)}
        >
          Return to Stock
        </button>
        <button
          className="dialog__footer-buttons--secondary"
          onClick={addHoldToCart}
        >
          Add to Cart
        </button>
        <button
          className="dialog__footer-buttons--ok"
          disabled={isNaN(parseInt(holdPeriod))}
          onClick={() => {
            if (holdPeriod !== null || notes !== null) {
              updateHoldInDatabase({
                id: loadedHoldId,
                hold_period:
                  holdPeriod === null
                    ? hold?.hold_period
                    : parseInt(holdPeriod),
                note: notes === null ? hold?.note : notes,
              });
            }
            setLoadedHoldId({ ...loadedHoldId, [page]: 0 });
          }}
        >
          OK
        </button>
      </div>
    </Modal>
  );

  function addHoldToCart() {
    return null;
    // () => {
    //   const cartItems: SaleItemObject[] = cart?.items || []
    //   saveLog(
    //     `Hold added to sale [${saleId}].`,
    //     "holds",
    //     get(hold, "id", ""),
    //     currentStaff
    //   );
    //   updateData({
    //     dispatch,
    //     collection: "holds",
    //     doc: get(hold, "id", null),
    //     update: {
    //       deleted: true,
    //       dateRemovedFromHold: new Date(),
    //       removedFromHoldBy: get(currentStaff, "id", null),
    //       sold: true,
    //     },
    //   });
    //   if (
    //     get(cart, "contactId", null) &&
    //     get(cart, "contactId") !== get(hold, "contactId")
    //   ) {
    //     // Shopping cart belongs to different contact, save
    //     cartItems = {};
    //     updateData({
    //       dispatch,
    //       collection: "sales",
    //       doc: cart.uid,
    //       update: {
    //         ...cart,
    //         status: "parked",
    //         dateSaved: get(cart, "dateSaved", new Date()),
    //         lastModified: new Date(),
    //       },
    //     });
    //     dispatch(clearCart());
    //     dispatch(
    //       setAlert({
    //         type: "success",
    //         message: "CURRENT SALE SAVED AND CLOSED",
    //       })
    //     );
    //   }
    //   dispatch(
    //     setLocal("cart", {
    //       uid: saleId,
    //       dateSaleOpened: new Date(),
    //       saleOpenedBy: get(currentStaff, "id", null),
    //       contactId: get(hold, "contactId", null),
    //       notes: `${get(cart, "notes", "")}\n${get(hold, "notes", "")}`,
    //       items: {
    //         ...cartItems,
    //         [holdItemId]: {
    //           ...get(cartItems, holdItemId, {}),
    //           cartQuantity:
    //             parseInt(
    //               get(get(cartItems, holdItemId, {}), "cartQuantity", 0)
    //             ) + parseInt(holdItemQty),
    //         },
    //       },
    //     })
    //   );
    //   updateData({
    //     dispatch,
    //     collection: "inventory",
    //     doc: get(hold, "item.id", null),
    //     update: {
    //       quantity: get(stockItem, "quantity", 0) + holdItemQty,
    //       quantityOnHold:
    //         get(stockItem, "quantityOnHold", 0) - holdItemQty,
    //     },
    //   });
    //   setHold(null);
    //   dispatch(closeDialog("holdItem"));
    //   dispatch(setLocal("page", "sell"));
    // }}
  }
}
