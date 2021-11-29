// Packages
import { useState } from "react";
import { useAtom } from "jotai";

// DB
import {
  useHolds,
  useCustomers,
  useClerks,
  useInventory,
} from "@/lib/swr-hooks";
import {
  viewAtom,
  clerkAtom,
  loadedHoldIdAtom,
  pageAtom,
  alertAtom,
} from "@/lib/atoms";
import {
  ModalButton,
  HoldObject,
  CustomerObject,
  ClerkObject,
} from "@/lib/types";

// Functions
import { daysFrom } from "@/lib/data-functions";
import {
  returnHoldToStock,
  updateHoldInDatabase,
  loadSaleToCart,
} from "@/lib/db-functions";

// Components
import Modal from "@/components/_components/container/modal";
import TextField from "@/components/_components/inputs/text-field";
import HoldListItem from "./list-item";

export default function HoldDialog() {
  // Atoms
  const [view] = useAtom(viewAtom);
  const [, setAlert] = useAtom(alertAtom);
  const [loadedHoldId, setLoadedHoldId] = useAtom(loadedHoldIdAtom);
  const [clerk] = useAtom(clerkAtom);
  const [page] = useAtom(pageAtom);

  // SWR
  const { holds, isHoldsLoading, mutateHolds } = useHolds();
  const { inventory, mutateInventory } = useInventory();
  const { customers } = useCustomers();
  const { clerks } = useClerks();

  // States
  const originalHold = holds?.filter(
    (h: HoldObject) => h?.id === loadedHoldId[page]
  )[0];
  const [hold, setHold] = useState(originalHold);
  const customerName = customers?.filter(
    (c: CustomerObject) => c?.id === hold?.customer_id
  )[0]?.name;
  const clerkName = clerks?.filter(
    (c: ClerkObject) => c?.id === hold?.started_by
  )[0]?.name;

  function closeDialog() {
    setLoadedHoldId({ ...loadedHoldId, [page]: 0 });
    setHold(null);
  }

  // Constants
  const buttons: ModalButton[] = [
    {
      type: "cancel",
      text: "Close",
      onClick: () => setLoadedHoldId({ ...loadedHoldId, [page]: 0 }),
    },
    {
      type: "alt2",
      text: "Return to Stock",
      onClick: () => {
        returnHoldToStock(
          hold,
          clerk,
          holds,
          mutateHolds,
          inventory,
          mutateInventory
        );
      },
    },
    {
      type: "alt1",
      text: "Add To Cart",
      onClick: () => {
        addHoldToCart();
      },
    },
    {
      type: "ok",
      text: "Update",
      disabled:
        (hold?.hold_period === originalHold?.hold_period &&
          hold?.note === originalHold?.note) ||
        isNaN(parseInt(hold?.hold_period)),
      onClick: () => {
        if (hold?.hold_period !== null || hold?.note !== null) {
          const otherHolds = holds?.filter(
            (h: HoldObject) => h?.id !== loadedHoldId
          );
          mutateHolds([...otherHolds, hold], false);
          updateHoldInDatabase(hold);
        }
        closeDialog();
      },
    },
  ];

  return (
    <Modal
      open={Boolean(loadedHoldId[page])}
      closeFunction={closeDialog}
      title={"HOLD ITEM"}
      loading={isHoldsLoading}
      buttons={buttons}
    >
      <>
        <HoldListItem cartItem={hold} />
        <div>{`Item held for ${customerName} (started by ${clerkName})`}</div>
        <div>{`Item held for ${daysFrom(hold?.date_from, "day")} of ${
          hold?.hold_period || 30
        } days.`}</div>
        <TextField
          inputLabel="Hold Period"
          inputType="number"
          min={0}
          error={isNaN(parseInt(hold?.hold_period)) || hold?.hold_period < 0}
          valueNum={hold?.hold_period}
          onChange={(e: any) =>
            setHold({ ...hold, hold_period: e.target.value })
          }
        />
        <TextField
          inputLabel="Notes"
          className="mb-4"
          value={hold?.note}
          onChange={(e: any) => setHold({ ...hold, note: e.target.value })}
          multiline
        />
      </>
    </Modal>
  );

  function addHoldToCart() {
    // TODO add hold to cart

    // await loadSaleToCart(
    //   cart,
    //   items,
    //   setCart,
    //   sale,
    //   clerk,
    //   customers,
    //   logs,
    //   mutateLogs,
    //   sales,
    //   mutateSales,
    //   saleItems,
    //   mutateSaleItems
    // );
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
