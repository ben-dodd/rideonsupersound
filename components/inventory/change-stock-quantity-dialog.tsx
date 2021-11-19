// Packages
import { useState } from "react";
import { useAtom } from "jotai";

// DB
import { useLogs, useStockInventory, useStockItem } from "@/lib/swr-hooks";
import {
  viewAtom,
  clerkAtom,
  alertAtom,
  loadedItemIdAtom,
  pageAtom,
} from "@/lib/atoms";
import { ModalButton, InventoryObject, StockMovementTypes } from "@/lib/types";

// Functions
import { getItemDisplayName } from "@/lib/data-functions";
import { saveLog, saveStockMovementToDatabase } from "@/lib/db-functions";

// Components
import Modal from "@/components/container/modal";
import TextField from "@/components/inputs/text-field";
import Select from "react-select";

export default function ChangePriceDialog() {
  // Atoms
  const [loadedItemId] = useAtom(loadedItemIdAtom);
  const [clerk] = useAtom(clerkAtom);
  const [page] = useAtom(pageAtom);
  const [view, setView] = useAtom(viewAtom);
  const [, setAlert] = useAtom(alertAtom);

  // SWR
  const { inventory, mutateInventory } = useStockInventory();
  const { stockItem, isStockItemLoading, mutateStockItem } = useStockItem(
    loadedItemId[page]
  );
  const { logs, mutateLogs } = useLogs();

  // State
  const [movement, setMovement] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const buttons: ModalButton[] = [
    {
      type: "ok",
      disabled:
        quantity === undefined ||
        quantity === null ||
        movement === null ||
        isNaN(parseInt(quantity)),
      loading: submitting,
      onClick: async () => {
        setSubmitting(true);
        let originalQuantity = stockItem?.quantity;
        let newQuantity = stockItem?.quantity;
        let adjustment = parseInt(quantity);
        if (movement === StockMovementTypes?.Adjustment) {
          newQuantity = parseInt(quantity);
          adjustment = newQuantity - originalQuantity;
        } else if (
          movement === StockMovementTypes?.Discarded ||
          movement === StockMovementTypes?.Lost
        ) {
          adjustment = adjustment * -1;
          newQuantity += adjustment;
        } else {
          newQuantity += adjustment;
        }
        const otherInventoryItems = inventory?.filter(
          (i: InventoryObject) => i?.id !== stockItem?.id
        );
        let inventoryItem = inventory?.filter(
          (i: InventoryObject) => i?.id === stockItem?.id
        )[0];
        inventoryItem = {
          ...inventoryItem,
          quantity: newQuantity,
        };
        mutateInventory([...otherInventoryItems, inventoryItem], false);
        mutateStockItem(
          [
            {
              ...stockItem,
              quantity: newQuantity,
              [`quantity_${movement}`]:
                (stockItem[`quantity_${movement}`] || 0) + adjustment,
            },
          ],
          false
        );
        const id = await saveStockMovementToDatabase(
          {
            item_id: stockItem?.id,
            quantity:
              movement === StockMovementTypes?.Adjustment
                ? adjustment?.toString()
                : quantity,
          },
          clerk,
          movement,
          notes
        );
        setSubmitting(false);
        setView({ ...view, changeStockQuantityDialog: false });
        setMovement(null);
        setQuantity("");
        setNotes("");
        saveLog(
          {
            log:
              movement === StockMovementTypes?.Adjustment
                ? `Quantity adjusted for ${getItemDisplayName(
                    stockItem
                  )} (${originalQuantity} => ${newQuantity})`
                : `${
                    parseInt(quantity) *
                    (movement === StockMovementTypes?.Discarded ||
                    movement === StockMovementTypes?.Lost
                      ? -1
                      : 1)
                  } copies of ${getItemDisplayName(
                    stockItem
                  )} marked as ${movement}.`,
            clerk_id: clerk?.id,
            table_id: "stock_price",
            row_id: id,
          },
          logs,
          mutateLogs
        );
        setAlert({
          open: true,
          type: "success",
          message: `${
            movement === StockMovementTypes?.Adjustment
              ? "STOCK QUANTITY ADJUSTED"
              : `STOCK MARKED AS ${movement?.toUpperCase()}`
          }`,
        });
      },
      text: "CHANGE QUANTITY",
    },
  ];

  return (
    <Modal
      open={view?.changeStockQuantityDialog}
      closeFunction={() =>
        setView({ ...view, changeStockQuantityDialog: false })
      }
      title={"CHANGE STOCK QUANTITY"}
      buttons={buttons}
      loading={isStockItemLoading}
    >
      <>
        <Select
          className="w-full"
          value={{ value: movement, label: movement?.toUpperCase() }}
          options={[
            StockMovementTypes?.Adjustment,
            StockMovementTypes?.Discarded,
            StockMovementTypes?.Found,
            StockMovementTypes?.Lost,
          ].map((m: string) => ({
            value: m,
            label: m?.toUpperCase(),
          }))}
          onChange={(item: any) => setMovement(item?.value)}
        />
        <div className="text-sm text-brown italic my-2">
          {movement === StockMovementTypes?.Adjustment
            ? "Enter the quantity of items currently in stock. Use this option for stock taking."
            : movement === StockMovementTypes?.Discarded
            ? "Enter the number of items discarded. Use this option for items that are not in a condition to sell."
            : movement === StockMovementTypes?.Found
            ? "Enter the number of items found. Use this option when uncounted stock has been discovered."
            : "Enter the number of items lost. Use this option when items are missing from stock."}
        </div>
        <TextField
          inputLabel="Quantity"
          divClass="text-4xl"
          value={quantity}
          onChange={(e: any) => setQuantity(e.target.value)}
        />
        <TextField
          inputLabel="Notes"
          value={notes}
          onChange={(e: any) => setNotes(e.target.value)}
          multiline
          rows={3}
        />
      </>
    </Modal>
  );
}
