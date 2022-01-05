// Packages
import { useState } from "react";
import { useAtom } from "jotai";

// DB
import { useSaleItemsForSale, useInventory, useLogs } from "@/lib/swr-hooks";
import { viewAtom, clerkAtom, alertAtom, cartAtom } from "@/lib/atoms";
import { ModalButton, SaleItemObject, SaleStateTypes } from "@/lib/types";

// Functions
import { writeItemList } from "@/lib/data-functions";
import { saveLog } from "@/lib/db-functions";

// Components
import Modal from "@/components/_components/container/modal";
import TextField from "@/components/_components/inputs/text-field";
import ItemListItem from "./item-list-item";

export default function ReturnItemsDialog({ sale }) {
  // Atoms
  const [clerk] = useAtom(clerkAtom);
  const [view, setView] = useAtom(viewAtom);
  const [, setAlert] = useAtom(alertAtom);
  const [cart, setCart] = useAtom(cartAtom);

  // SWR
  const { items, mutateSaleItems } = useSaleItemsForSale(sale?.id);
  const { logs, mutateLogs } = useLogs();
  const { inventory } = useInventory();

  // State
  const [refundItems, setRefundItems] = useState([]);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function closeDialog() {
    setView({ ...view, returnItemDialog: false });
    setRefundItems([]);
    setNotes("");
  }

  // Constants
  const buttons: ModalButton[] = [
    {
      type: "ok",
      loading: submitting,
      onClick: () => {
        const updatedCartItems = cart?.items?.map((item: SaleItemObject) =>
          refundItems.includes(item?.id)
            ? { ...item, is_refunded: true, refund_note: notes }
            : item
        );
        setCart({
          ...cart,
          items: updatedCartItems,
          state:
            cart?.state === SaleStateTypes.Completed
              ? SaleStateTypes.InProgress
              : cart?.state,
        });
        closeDialog();
        saveLog(
          {
            log: `${writeItemList(
              inventory,
              items?.filter((i: SaleItemObject) => refundItems?.includes(i?.id))
            )} refunded (sale #${sale?.id}).`,
            clerk_id: clerk?.id,
          },
          logs,
          mutateLogs
        );
        setAlert({
          open: true,
          type: "success",
          message: `ITEM${refundItems?.length === 1 ? "" : "S"} REFUNDED.`,
        });
      },
      text: "COMPLETE",
    },
  ];

  // REVIEW allow returning less than the total quantity of an item

  return (
    <Modal
      open={view?.returnItemDialog}
      closeFunction={closeDialog}
      title={"RETURN ITEMS"}
      buttons={buttons}
      width="max-w-xl"
    >
      <>
        <div className="help-text">Select items to return.</div>
        {items
          ?.filter(
            (item: SaleItemObject) => !item?.is_deleted && !item?.is_refunded
          )
          ?.map((item: SaleItemObject) => (
            <div className="flex" key={item?.id}>
              <ItemListItem
                saleItem={item}
                sale={sale}
                selected={refundItems.includes(item?.id)}
                onClick={() => {
                  let newRefundItems = [...refundItems];
                  if (refundItems?.includes(item?.id))
                    newRefundItems = newRefundItems.filter(
                      (x: number) => x !== item?.id
                    );
                  else newRefundItems.push(item?.id);
                  setRefundItems(newRefundItems);
                }}
              />
            </div>
          ))}
        <TextField
          inputLabel="Notes"
          multiline
          rows={3}
          value={notes}
          onChange={(e: any) => setNotes(e.target.value)}
        />
      </>
    </Modal>
  );
}
