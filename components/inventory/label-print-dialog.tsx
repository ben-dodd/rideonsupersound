// Packages
import { useState } from "react";
import { useAtom } from "jotai";

// DB
import { useInventory, useLogs } from "@/lib/swr-hooks";
import { viewAtom, clerkAtom } from "@/lib/atoms";
import { InventoryObject, ModalButton } from "@/lib/types";

// Functions
import {
  getItemDisplayName,
  getCSVData,
  fFileDate,
} from "@/lib/data-functions";
import { saveLog } from "@/lib/db-functions";

// Components
import Modal from "@/components/container/modal";
import TextField from "@/components/inputs/text-field";
import Select from "react-select";

export default function LabelPrintDialog() {
  // Atoms
  const [view, setView] = useAtom(viewAtom);
  const [clerk] = useAtom(clerkAtom);

  // SWR
  const { inventory } = useInventory();
  const { mutateLogs } = useLogs();

  // State
  const [items, setItems] = useState({
    0: { item: {}, printQuantity: 1 },
    1: { item: {}, printQuantity: 1 },
    2: { item: {}, printQuantity: 1 },
    3: { item: {}, printQuantity: 1 },
    4: { item: {}, printQuantity: 1 },
    5: { item: {}, printQuantity: 1 },
    6: { item: {}, printQuantity: 1 },
    7: { item: {}, printQuantity: 1 },
    8: { item: {}, printQuantity: 1 },
    9: { item: {}, printQuantity: 1 },
  });

  // Constants
  const buttons: ModalButton[] = [
    {
      type: "cancel",
      onClick: () => setView({ ...view, labelPrintDialog: false }),
      text: "CANCEL",
    },
    {
      type: "ok",
      data: getCSVData(items, inventory),
      headers: ["SKU", "ARTIST", "TITLE", "NEW/USED", "SELL PRICE", "GENRE"],
      fileName: `label-print-${fFileDate()}.csv`,
      text: "PRINT LABELS",
      onClick: () =>
        saveLog(
          {
            log: "Labels printed from label print dialog.",
            clerk_id: clerk?.id,
          },
          mutateLogs
        ),
    },
  ];

  return (
    <Modal
      open={view?.labelPrintDialog}
      closeFunction={() => setView({ ...view, labelPrintDialog: false })}
      title={"LABEL PRINT"}
      buttons={buttons}
    >
      <>
        <div className="input-label">Add Items</div>
        {Array.from(Array(10).keys()).map((key) => (
          <div key={key} className="flex mb-1 items-center">
            <div className="w-full mr-2">
              <Select
                className="w-full self-stretch"
                value={items[key]?.item}
                options={(inventory || []).map((item: InventoryObject) => ({
                  value: item?.id,
                  label: getItemDisplayName(item),
                }))}
                onChange={(item) =>
                  setItems({ ...items, [key]: { ...items[key], item } })
                }
              />
            </div>
            <div className="w-1/6">
              <TextField
                inputType="number"
                min={0}
                value={items[key]?.printQuantity || 1}
                onChange={(e: any) =>
                  setItems({
                    ...items,
                    [key]: { ...items[key], printQuantity: e.target.value },
                  })
                }
              />
            </div>
          </div>
        ))}
      </>
    </Modal>
  );
}
