// Packages
import { useState, useEffect } from "react";
import { useAtom } from "jotai";

// DB
import { useLogs, useInventory, useStockItem } from "@/lib/swr-hooks";
import {
  viewAtom,
  clerkAtom,
  alertAtom,
  loadedItemIdAtom,
  pageAtom,
} from "@/lib/atoms";
import { ModalButton, StockObject } from "@/lib/types";

// Functions
import { getItemDisplayName } from "@/lib/data-functions";
import { saveLog, saveStockPriceToDatabase } from "@/lib/db-functions";

// Components
import Modal from "@/components/_components/container/modal";
import TextField from "@/components/_components/inputs/text-field";

export default function ChangePriceDialog() {
  // Atoms
  const [loadedItemId] = useAtom(loadedItemIdAtom);
  const [clerk] = useAtom(clerkAtom);
  const [page] = useAtom(pageAtom);
  const [view, setView] = useAtom(viewAtom);
  const [, setAlert] = useAtom(alertAtom);

  // SWR
  const { inventory, mutateInventory } = useInventory();
  const { stockItem, isStockItemLoading, mutateStockItem } = useStockItem(
    loadedItemId[page]
  );
  const { logs, mutateLogs } = useLogs();

  // State
  const [totalSell, setTotalSell] = useState("");
  const [vendorCut, setVendorCut] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setTotalSell(`${(stockItem?.total_sell / 100)?.toFixed(2)}`);
    setVendorCut(`${(stockItem?.vendor_cut / 100)?.toFixed(2)}`);
  }, [stockItem]);

  const buttons: ModalButton[] = [
    {
      type: "ok",
      disabled:
        (totalSell !== "" && isNaN(parseFloat(totalSell))) ||
        (vendorCut !== "" && isNaN(parseFloat(vendorCut))),
      loading: submitting,
      onClick: async () => {
        setSubmitting(true);
        const totalSellNum = parseFloat(totalSell) * 100;
        const vendorCutNum = parseFloat(vendorCut) * 100;
        const otherInventoryItems = inventory?.filter(
          (i: StockObject) => i?.id !== stockItem?.id
        );
        let inventoryItem = inventory?.filter(
          (i: StockObject) => i?.id === stockItem?.id
        )[0];
        inventoryItem = {
          ...inventoryItem,
          total_sell: totalSellNum,
          vendor_cut: vendorCutNum,
        };
        console.log(inventoryItem);
        mutateInventory([...otherInventoryItems, inventoryItem], false);
        console.log(stockItem);
        mutateStockItem(
          [
            {
              ...stockItem,
              total_sell: totalSellNum,
              vendor_cut: vendorCutNum,
            },
          ],
          false
        );
        const id = await saveStockPriceToDatabase(
          stockItem?.id,
          clerk,
          totalSellNum,
          vendorCutNum,
          notes
        );
        setSubmitting(false);
        setView({ ...view, changePriceDialog: false });
        saveLog(
          {
            log: `Price for ${getItemDisplayName(stockItem)} changed from $${(
              stockItem?.total_sell / 100
            )?.toFixed(2)} [$${(stockItem?.vendor_cut / 100)?.toFixed(
              2
            )}] to $${parseFloat(totalSell)?.toFixed(2)} [$${parseFloat(
              vendorCut
            )?.toFixed(2)}].`,
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
          message: `PRICE CHANGED`,
        });
      },
      text: "CHANGE PRICE",
    },
  ];

  return (
    <Modal
      open={view?.changePriceDialog}
      closeFunction={() => setView({ ...view, changePriceDialog: false })}
      title={"CHANGE STOCK PRICE"}
      buttons={buttons}
      loading={isStockItemLoading}
    >
      <>
        <div className="grid grid-cols-2 gap-4">
          <TextField
            inputLabel="Total Sell"
            divClass="text-4xl"
            startAdornment="$"
            inputClass="text-center"
            value={totalSell}
            error={isNaN(parseFloat(totalSell))}
            onChange={(e: any) => setTotalSell(e.target.value)}
          />
          <TextField
            inputLabel="Vendor Cut"
            divClass="text-4xl w-full"
            startAdornment="$"
            inputClass="text-center"
            value={vendorCut}
            error={isNaN(parseFloat(vendorCut))}
            onChange={(e: any) => setVendorCut(e.target.value)}
          />
          <TextField
            inputLabel="Margin"
            divClass="text-4xl"
            endAdornment="%"
            inputClass="text-center"
            displayOnly
            value={
              (
                ((parseFloat(totalSell) - parseFloat(vendorCut)) /
                  parseFloat(totalSell)) *
                100
              )?.toFixed(1) || "N/A"
            }
          />
          <TextField
            inputLabel="Store Cut"
            divClass="text-4xl"
            startAdornment="$"
            inputClass="text-center"
            displayOnly
            value={
              (parseFloat(totalSell) - parseFloat(vendorCut)).toFixed(2) ||
              "N/A"
            }
          />
        </div>
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
