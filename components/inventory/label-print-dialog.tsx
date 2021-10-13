import { useState } from "react";
import { useAtom } from "jotai";

import {
  getItemDisplayName,
  getCSVData,
  fFileDate,
} from "@/lib/data-functions";
import { saveLog } from "@/lib/db-functions";
import { showLabelPrintDialogAtom, clerkAtom } from "@/lib/atoms";
import { useInventory } from "@/lib/swr-hooks";
import { InventoryObject, ModalButton } from "@/lib/types";

import Modal from "@/components/container/modal";
import TextField from "@/components/inputs/text-field";
import Select from "react-select";

export default function LabelPrintDialog() {
  const [labelPrintDialog, setLabelPrintDialog] = useAtom(
    showLabelPrintDialogAtom
  );
  const { inventory } = useInventory();
  const [clerk] = useAtom(clerkAtom);
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

  const buttons: ModalButton[] = [
    {
      type: "cancel",
      onClick: () => setLabelPrintDialog(false),
      text: "CANCEL",
    },
    {
      type: "ok",
      data: getCSVData(items, inventory),
      headers: ["SKU", "ARTIST", "TITLE", "NEW/USED", "SELL PRICE", "GENRE"],
      fileName: `label-print-${fFileDate()}.csv`,
      text: "PRINT LABELS",
      onClick: () =>
        saveLog({
          log: "Labels printed from label print dialog.",
          clerk_id: clerk?.id,
        }),
    },
  ];

  return (
    <Modal
      open={Boolean(labelPrintDialog)}
      closeFunction={() => setLabelPrintDialog(false)}
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
