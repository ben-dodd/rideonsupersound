// Packages
import { useState } from "react";
import { useAtom } from "jotai";

// DB
import {
  useInventory,
  useVendors,
  useLogs,
  useRegisterID,
} from "@/lib/swr-hooks";
import { viewAtom, clerkAtom, alertAtom } from "@/lib/atoms";
import { InventoryObject, VendorObject, ModalButton } from "@/lib/types";

// Functions
import { returnStock, saveLog } from "@/lib/db-functions";
import { getItemDisplayName } from "@/lib/data-functions";

// Components
import TextField from "@/components/_components/inputs/text-field";
import Select from "react-select";

// Icons
import DeleteIcon from "@mui/icons-material/Delete";
import ScreenContainer from "../_components/container/screen";

export default function ReturnStockScreen() {
  // SWR
  const { inventory, mutateInventory } = useInventory();
  const { logs, mutateLogs } = useLogs();
  const { vendors } = useVendors();
  const { registerID } = useRegisterID();

  // Atoms
  const [clerk] = useAtom(clerkAtom);
  const [view, setView] = useAtom(viewAtom);
  const [, setAlert] = useAtom(alertAtom);

  // State
  const [vendorWrapper, setVendorWrapper] = useState(null);
  const [items, setItems] = useState({});
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);

  function closeFunction() {
    setView({ ...view, returnStockScreen: false });
    setVendorWrapper(null);
    setItems({});
    setNotes("");
  }

  const buttons: ModalButton[] = [
    {
      type: "cancel",
      onClick: closeFunction,
      text: "CANCEL",
    },
    {
      type: "ok",
      onClick: () => {
        setSubmitting(true);
        returnStock(
          vendorWrapper?.value,
          items,
          notes,
          clerk,
          registerID,
          inventory,
          mutateInventory,
          logs,
          mutateLogs
        );
        setSubmitting(false);
        setAlert({
          open: true,
          type: "success",
          message: `ITEMS RETURNED TO VENDOR`,
        });
        closeFunction();
      },
      loading: submitting,
      disabled:
        submitting ||
        !vendorWrapper?.value ||
        Object.keys(items)?.length === 0 ||
        Object.entries(items)?.filter(
          ([id, itemQuantity]: [string, number]) =>
            isNaN(itemQuantity) ||
            inventory?.filter((i: InventoryObject) => i?.id === parseInt(id))[0]
              ?.quantity < itemQuantity ||
            itemQuantity < 0
        ).length > 0,
      text: "RETURN STOCK",
    },
  ];

  return (
    <ScreenContainer
      show={view?.returnStockScreen}
      closeFunction={closeFunction}
      title={"RETURN STOCK"}
      buttons={buttons}
      titleClass="bg-col2"
    >
      <div className="w-full">
        <div className="help-text">
          Select the vendor that you are returning stock to, then select the
          items and add how many of each they are taking.
        </div>
        <div className="flex mt-4">
          <div className="w-1/3">
            <div className="font-bold text-xl">Select Vendor</div>
            <Select
              fieldRequired
              value={vendorWrapper}
              onChange={(vendorObject: any) => {
                setVendorWrapper(vendorObject);
                setItems({});
              }}
              options={vendors?.map((val: VendorObject) => ({
                value: val?.id,
                label: val?.name || "",
              }))}
            />
            <div className="font-bold text-xl mt-4">Add Items</div>
            <Select
              className="w-full text-xs"
              isDisabled={!vendorWrapper?.value}
              value={null}
              options={inventory
                ?.filter(
                  (item: InventoryObject) =>
                    item?.vendor_id === vendorWrapper?.value &&
                    !items[item?.id] &&
                    item?.quantity > 0
                )
                .map((item: InventoryObject) => ({
                  value: item?.id,
                  label: getItemDisplayName(item),
                }))}
              onChange={(item: any) =>
                setItems({
                  ...(items || {}),
                  [item?.value]:
                    inventory?.filter(
                      (i: InventoryObject) => i?.id === parseInt(item?.value)
                    )[0]?.quantity || 1,
                })
              }
            />
            <TextField
              inputLabel="Notes"
              value={notes}
              onChange={(e: any) => setNotes(e.target.value)}
              multiline
              rows={3}
            />
          </div>
          <div className="w-2/3 pl-8">
            <div className="font-bold text-xl">Items to Return</div>
            {Object.keys(items)?.length > 0 ? (
              <div>
                {Object.entries(items)?.map(
                  ([itemId, itemQuantity]: [string, number]) => {
                    console.log(items);
                    const item = inventory?.filter(
                      (i: InventoryObject) => i?.id === parseInt(itemId)
                    )[0];
                    return (
                      <div
                        className="flex justify-between my-2 border-b w-full"
                        key={itemId}
                      >
                        <div className="flex">
                          <div className="ml-2">
                            {getItemDisplayName(item)}
                            <div
                              className={`mt-2 text-sm font-bold ${
                                item?.quantity <= 0
                                  ? "text-tertiary"
                                  : "text-black"
                              }`}
                            >{`${item?.quantity || 0} in stock.`}</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-end">
                          <TextField
                            className="w-16 mr-6"
                            inputType="number"
                            error={!itemQuantity}
                            max={item?.quantity || 0}
                            min={0}
                            valueNum={itemQuantity}
                            onChange={(e: any) =>
                              setItems({
                                ...(items || {}),
                                [itemId]: e.target.value,
                              })
                            }
                          />
                          <button
                            className="bg-gray-200 hover:bg-gray-300 p-1 w-10 h-10 rounded-full mr-8"
                            onClick={() => {
                              let newItems = { ...items };
                              delete newItems[itemId];
                              setItems(newItems);
                            }}
                          >
                            <DeleteIcon />
                          </button>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            ) : vendorWrapper?.value ? (
              <div>Select items from the drop-down menu.</div>
            ) : (
              <div>Select vendor to add items to return.</div>
            )}
          </div>
        </div>
      </div>
    </ScreenContainer>
  );
}
