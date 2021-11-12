// Packages
import { useState } from "react";
import { useAtom } from "jotai";

// DB
import { useHold } from "@/lib/swr-hooks";
import { viewAtom, clerkAtom, loadedHoldIdAtom, pageAtom } from "@/lib/atoms";
import { ModalButton } from "@/lib/types";

// Functions
import { daysFrom } from "@/lib/data-functions";
import { returnHoldToStock, updateHoldInDatabase } from "@/lib/db-functions";

// Components
import Modal from "@/components/container/modal";
import TextField from "@/components/inputs/text-field";
import HoldListItem from "./list-item";

export default function HoldDialog() {
  // Atoms
  const [view] = useAtom(viewAtom);
  const [loadedHoldId, setLoadedHoldId] = useAtom(loadedHoldIdAtom);
  const [clerk] = useAtom(clerkAtom);
  const [page] = useAtom(pageAtom);

  // SWR
  const { hold } = useHold(loadedHoldId[page]);

  // States
  const [holdPeriod, setHoldPeriod] = useState(null);
  const [notes, setNotes] = useState(null);

  // Constants
  const buttons: ModalButton[] = [
    {
      type: "cancel",
      onClick: () => setLoadedHoldId({ ...loadedHoldId, [page]: 0 }),
    },
    {
      type: "alt2",
      onClick: () => returnHoldToStock(hold, clerk),
      text: "Return to Stock",
    },
    {
      type: "alt1",
      onClick: addHoldToCart,
      text: "Add To Cart",
    },
    {
      type: "ok",
      disabled: isNaN(parseInt(holdPeriod)),
      onClick: () => {
        if (holdPeriod !== null || notes !== null) {
          updateHoldInDatabase({
            id: loadedHoldId,
            hold_period:
              holdPeriod === null ? hold?.hold_period : parseInt(holdPeriod),
            note: notes === null ? hold?.note : notes,
          });
        }
        setLoadedHoldId({ ...loadedHoldId, [page]: 0 });
      },
    },
  ];

  return (
    <Modal
      open={view?.labelPrintDialog}
      closeFunction={() => setLoadedHoldId({ ...loadedHoldId, [page]: 0 })}
      title={"HOLD ITEM"}
      buttons={buttons}
    >
      <>
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
      </>
    </Modal>
  );

  function addHoldToCart() {
    // TODO add hold to cart
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
    //     get(cart, "customerId", null) &&
    //     get(cart, "customerId") !== get(hold, "customerId")
    //   ) {
    //     // Shopping cart belongs to different customer, save
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
    //       customerId: get(hold, "customerId", null),
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
