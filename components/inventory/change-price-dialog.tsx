// Packages
import { useState } from "react";
import { useAtom } from "jotai";

// DB
import { useLogs, useStockItem } from "@/lib/swr-hooks";
import {
  viewAtom,
  clerkAtom,
  alertAtom,
  loadedItemIdAtom,
  pageAtom,
} from "@/lib/atoms";
import { ModalButton } from "@/lib/types";

// Functions
import { getItemDisplayName } from "@/lib/data-functions";
import { saveLog, saveStockPriceToDatabase } from "@/lib/db-functions";

// Components
import Modal from "@/components/container/modal";
import TextField from "@/components/inputs/text-field";

export default function ChangePriceDialog() {
  // Atoms
  const [loadedItemId] = useAtom(loadedItemIdAtom);
  const [clerk] = useAtom(clerkAtom);
  const [page] = useAtom(pageAtom);
  const [view, setView] = useAtom(viewAtom);
  const [, setAlert] = useAtom(alertAtom);

  // SWR
  const { stockItem, isStockItemLoading } = useStockItem(loadedItemId[page]);
  const { logs, mutateLogs } = useLogs();

  // State
  const [totalSell, setTotalSell] = useState(
    `${(stockItem?.total_sell / 100)?.toFixed(2)}`
  );
  const [vendorCut, setVendorCut] = useState(
    `${(stockItem?.vendor_cut / 100)?.toFixed(2)}`
  );
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const buttons: ModalButton[] = [
    {
      type: "ok",
      disabled:
        (totalSell !== "" && isNaN(parseFloat(totalSell))) ||
        (vendorCut !== "" && isNaN(parseFloat(vendorCut))),
      loading: submitting,
      onClick: async () => {
        setSubmitting(true);
        const id = await saveStockPriceToDatabase(
          stockItem?.id,
          clerk,
          parseFloat(totalSell) * 100,
          parseFloat(vendorCut) * 100,
          notes
        );
        setView({ ...view, giftCardDialog: false, cart: true });
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
        <TextField
          className="mt-8"
          divClass="text-8xl"
          startAdornment="$"
          inputClass="text-center"
          value={totalSell}
          error={isNaN(parseFloat(totalSell))}
          onChange={(e: any) => setTotalSell(e.target.value)}
        />
        <TextField
          className="mt-8"
          divClass="text-8xl"
          startAdornment="$"
          inputClass="text-center"
          value={vendorCut}
          error={isNaN(parseFloat(vendorCut))}
          onChange={(e: any) => setVendorCut(e.target.value)}
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
