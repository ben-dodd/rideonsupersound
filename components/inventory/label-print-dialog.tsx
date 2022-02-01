// Packages
import { useState } from "react";
import { useAtom } from "jotai";

// DB
import { useInventory, useLogs } from "@/lib/swr-hooks";
import { viewAtom, clerkAtom } from "@/lib/atoms";
import { StockObject, ModalButton } from "@/lib/types";

// Functions
import { getCSVData, getItemSkuDisplayName } from "@/lib/data-functions";
import { saveLog } from "@/lib/db-functions";

// Components
import Modal from "@/components/_components/container/modal";
import TextField from "@/components/_components/inputs/text-field";
import Select from "react-select";
import dayjs from "dayjs";

export default function LabelPrintDialog() {
  // Atoms
  const [view, setView] = useAtom(viewAtom);
  const [clerk] = useAtom(clerkAtom);

  // SWR
  const { inventory } = useInventory();
  const { logs, mutateLogs } = useLogs();

  // State
  const initItems = {
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
  };
  const [items, setItems] = useState(initItems);

  function closeDialog() {
    setItems(initItems);
    setView({ ...view, labelPrintDialog: false });
  }

  // Constants
  const buttons: ModalButton[] = [
    {
      type: "cancel",
      onClick: closeDialog,
      text: "CANCEL",
    },
    {
      type: "ok",
      data: getCSVData(items),
      headers: ["SKU", "ARTIST", "TITLE", "NEW/USED", "SELL PRICE", "GENRE"],
      fileName: `label-print-${dayjs().format("YYYY-MM-DD")}.csv`,
      text: "PRINT LABELS",
      onClick: () => {
        saveLog(
          {
            log: "Labels printed from label print dialog.",
            clerk_id: clerk?.id,
          },
          logs,
          mutateLogs
        );
        closeDialog();
      },
    },
  ];

  return (
    <Modal
      open={view?.labelPrintDialog}
      closeFunction={closeDialog}
      title={"LABEL PRINT"}
      buttons={buttons}
      width={"max-w-xl"}
    >
      <>
        <div className="help-text">
          Select item from dropdown list and enter the quantity of labels you
          wish to print. Then click print to download the CSV file for the label
          printer.
        </div>
        <div className="input-label">Add Items</div>
        {Array.from(Array(10).keys()).map((key) => (
          <div key={`${key}`} className="flex mb-1 items-center">
            <div className="w-full mr-2">
              <Select
                className="w-full self-stretch"
                value={items[key]?.item}
                options={inventory?.map((item: StockObject) => ({
                  value: item,
                  label: getItemSkuDisplayName(item),
                }))}
                onChange={(item) =>
                  setItems({ ...items, [key]: { ...items[key], item } })
                }
              />
            </div>
            <div className="w-1/3">
              <TextField
                inputType="number"
                min={0}
                valueNum={items[key]?.printQuantity}
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
