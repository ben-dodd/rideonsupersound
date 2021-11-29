// Packages
import { useState } from "react";
import { useAtom } from "jotai";

// DB
import {
  useSaleItemsForSale,
  useSaleTransactionsForSale,
  useInventory,
  useLogs,
} from "@/lib/swr-hooks";
import {
  viewAtom,
  newSaleObjectAtom,
  loadedSaleObjectAtom,
  clerkAtom,
  alertAtom,
} from "@/lib/atoms";
import {
  ModalButton,
  CustomerObject,
  SaleItemObject,
  PaymentMethodTypes,
} from "@/lib/types";

// Functions
import {
  getSaleVars,
  getItemDisplayName,
  writeItemList,
} from "@/lib/data-functions";
import { updateSaleItemInDatabase, saveLog } from "@/lib/db-functions";

// Components
import Modal from "@/components/_components/container/modal";
import TextField from "@/components/_components/inputs/text-field";
import ItemListItem from "./item-list-item";

export default function RefundPaymentDialog({ isNew }) {
  // Atoms
  const [clerk] = useAtom(clerkAtom);
  const [view, setView] = useAtom(viewAtom);
  const [sale, setSale] = useAtom(
    isNew ? newSaleObjectAtom : loadedSaleObjectAtom
  );
  const [, setAlert] = useAtom(alertAtom);

  // SWR
  const { transactions } = useSaleTransactionsForSale(sale?.id);
  const { items, mutateSaleItems } = useSaleItemsForSale(sale?.id);
  const { logs, mutateLogs } = useLogs();
  const { inventory } = useInventory();

  const { totalRemaining } = getSaleVars(items, transactions, inventory);

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
      onClick: async () => {
        const otherSaleItems = items?.filter(
          (item: SaleItemObject) => !refundItems.includes(item?.id)
        );
        const refundedItems = [];
        refundItems?.forEach((x: number) => {
          let saleItem: SaleItemObject =
            items?.filter((i: SaleItemObject) => i?.id === x)[0] || {};
          saleItem = {
            ...saleItem,
            is_refunded: true,
            refund_note: notes,
            sale_id: sale?.id,
          };
          updateSaleItemInDatabase(saleItem);
          refundedItems.push(saleItem);
        });
        mutateSaleItems([...otherSaleItems, ...refundedItems], false);
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
                isNew={isNew}
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
