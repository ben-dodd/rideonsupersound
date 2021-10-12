import { useState } from "react";
import { useAtom } from "jotai";
import { showReturnStockScreenAtom, clerkAtom } from "@/lib/atoms";
import { useInventory, useVendors } from "@/lib/swr-hooks";
import { InventoryObject, VendorObject } from "@/lib/types";

// Actions
import { returnStock, saveLog } from "@/lib/db-functions";
import { getItemDisplayName } from "@/lib/data-functions";

// Material UI Components
import TextField from "@/components/inputs/text-field";
import Modal from "@/components/modal";
import CreateableSelect from "@/components/inputs/createable-select";
import Select from "react-select";

// Material UI Icons
import DeleteIcon from "@mui/icons-material/Delete";

// Images
import defaultImage from "../../res/default.png";

export default function ReturnStockScreen() {
  const { inventory } = useInventory();
  const { vendors } = useVendors();
  const [clerk] = useAtom(clerkAtom);
  const [showReturnStockScreen, setShowReturnStockScreen] = useAtom(
    showReturnStockScreenAtom
  );
  const [doc, setDoc]: [any, Function] = useState({});
  const [submitting, setSubmitting] = useState(false);

  return (
    <Modal
      open={Boolean(showReturnStockScreen)}
      onClose={() => setShowReturnStockScreen(false)}
    >
      <div className="font-bold text-xl mt-4">Select Vendor</div>
      <CreateableSelect
        inputLabel="Select vendor"
        fieldRequired
        value={doc?.vendor_id}
        label={
          (vendors || []).filter(
            (v: VendorObject) => v?.id === doc?.vendor_id
          )[0]?.name || ""
        }
        onChange={(vendorObject: any) => {
          setDoc({
            ...doc,
            vendor_id: parseInt(vendorObject?.value),
          });
        }}
        onCreateOption={(inputValue: string) =>
          // setCreateContactScreen({
          //   id: 1,
          //   name: inputValue,
          // })
          null
        }
        options={(vendors || [])?.map((val: VendorObject) => ({
          value: val?.id,
          label: val?.name || "",
        }))}
      />
      <div className="font-bold text-xl mt-4">Add Items</div>
      <div className="flex justify-between">
        <Select
          className="w-full text-xs"
          isDisabled={!doc?.vendor_id}
          value={null}
          options={(inventory || [])
            .filter(
              (item: InventoryObject) =>
                item?.vendor_id === parseInt(doc?.vendor_id) &&
                !doc?.items[item?.id]
            )
            .map((item: InventoryObject) => ({
              value: item?.id,
              label: getItemDisplayName(item),
            }))}
          onChange={(item: any) => {
            setDoc({
              ...doc,
              items: {
                ...(doc?.items || {}),
                [item?.value]:
                  (inventory || []).filter(
                    (i: InventoryObject) => i?.id === parseInt(item?.value)
                  )[0]?.quantity || 1,
              },
            });
          }}
        />
      </div>
      <div style={{ minHeight: "800px" }}>
        {(doc?.items || {}).length > 0 ? (
          <div className="mt-6 mb-2">
            <div className="flex justify-between">
              <div className="font-bold text-xl">Current Items</div>
              <div className="font-bold mr-12">Quantity Returned</div>
            </div>
            {Object.entries(doc?.items || {}).map(([itemId, itemQuantity]) => {
              const item = (inventory || []).filter(
                (i: InventoryObject) => i?.id === parseInt(itemId)
              )[0];
              return (
                <div className="flex justify-between my-2 border-b">
                  <div className="flex">
                    <div className="ml-2">
                      {getItemDisplayName(item)}
                      <div
                        className={`mt-2 text-sm font-bold ${
                          item?.quantity <= 0 ? "text-tertiary" : "text-black"
                        }`}
                      >{`${item?.quantity || 0} in stock.`}</div>
                    </div>
                  </div>
                  <div className="self-center flex items-center">
                    <TextField
                      className="w-12 mr-6"
                      inputType="number"
                      max={item?.quantity || 0}
                      min={0}
                      value={`${itemQuantity}`}
                      onChange={(e: any) =>
                        setDoc({
                          ...doc,
                          items: {
                            ...(doc?.items || {}),
                            [itemId]: e.target.value,
                          },
                        })
                      }
                    />
                    <button
                      className="bg-gray-200 hover:bg-gray-300 p-1 w-10 h-10 rounded-full mr-8"
                      onClick={() => {
                        let newItems = doc?.items || {};
                        delete newItems[itemId];
                        setDoc({ ...doc, newItems });
                      }}
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div>Select vendor to add items to return.</div>
        )}
      </div>
      <div className="flex">
        <button
          className="dialog-action__ok-cancel mb-8"
          onClick={() => setShowReturnStockScreen(false)}
        >
          CANCEL
        </button>
        <button
          className="dialog-action__ok-button mb-8"
          disabled={
            submitting ||
            !doc?.vendor_id ||
            Object.keys(doc?.items || {}).length === 0 ||
            Object.entries(doc?.items || {}).filter(
              ([id, itemQuantity]) =>
                isNaN(parseFloat(`${itemQuantity}`)) ||
                (inventory || []).filter(
                  (i: InventoryObject) => i?.id === parseInt(id)
                )[0]?.quantity < parseFloat(`${itemQuantity}`) ||
                parseFloat(`${itemQuantity}`) < 0
            ).length > 0
          }
          onClick={async () => {
            setSubmitting(true);
            await returnStock(doc, clerk);
            setSubmitting(false);
            setShowReturnStockScreen(false);
          }}
        >
          RETURN
        </button>
      </div>
    </Modal>
  );
}
