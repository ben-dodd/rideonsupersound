import { useState } from "react";
import { useAtom } from "jotai";
import {
  cartAtom,
  clerkAtom,
  showCartAtom,
  showHoldAtom,
  alertAtom,
  sellSearchBarAtom,
  showCreateContactAtom,
} from "@/lib/atoms";
import { ContactObject } from "@/lib/types";
import { getItemSkuDisplayName } from "@/lib/data-functions";
import { saveHoldToDatabase, saveLog } from "@/lib/db-functions";
import TextField from "@/components/inputs/text-field";
import CreateableSelect from "@/components/inputs/createable-select";
import ListItem from "./list-item";
import { useContacts, useInventory } from "@/lib/swr-hooks";

export default function HoldScreen() {
  const [cart, setCart] = useAtom(cartAtom);
  const [, setAlert] = useAtom(alertAtom);
  const [, setCreateContactScreen] = useAtom(showCreateContactAtom);
  const [, setShowCart] = useAtom(showCartAtom);
  const [, setShowHold] = useAtom(showHoldAtom);
  const [, setSearch] = useAtom(sellSearchBarAtom);
  const [clerk] = useAtom(clerkAtom);
  const { contacts } = useContacts();
  const { inventory } = useInventory();
  const [holdPeriod, setHoldPeriod] = useState(30);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onClickConfirmHold() {
    setSubmitting(true);
    // Create hold

    cart?.items.forEach(
      // Create hold for each item
      async (cartItem) => {
        const rowId = await saveHoldToDatabase(
          cart,
          cartItem,
          holdPeriod,
          note,
          clerk
        );
        saveLog({
          log: `${getItemSkuDisplayName(
            cartItem?.item_id,
            inventory
          )} put on hold for ${
            (contacts || []).filter(
              (c: ContactObject) => c?.id === cart?.contact_id
            )[0]?.name
          } for ${holdPeriod} day${holdPeriod === 1 ? "" : "s"}.`,
          clerk_id: clerk?.id,
          table_id: "hold",
          row_id: rowId,
        });
      }
    );
    // Reset vars and return to inventory scroll
    setAlert({
      open: true,
      type: "success",
      message: `ITEM${
        (cart?.items || []).length === 1 ? "" : "S"
      } PUT ON HOLD FOR ${(
        (contacts || []).filter(
          (c: ContactObject) => c?.id === cart?.contact_id
        )[0]?.name || ""
      ).toUpperCase()}.`,
    });
    setSubmitting(false);
    setSearch(null);
    setCart(null);
    setShowCart(false);
    setShowHold(false);
  }

  function onClickCancelHold() {
    setShowHold(false);
  }

  return (
    <div className="flex flex-col h-menu px-2 bg-blue-200 text-black">
      <div className="flex justify-between mb-2 relative">
        <div className="text-lg my-2 tracking-wide self-center">Hold Items</div>
      </div>
      <div className="flex-grow overflow-x-hidden overflow-y-scroll">
        {(cart?.items || []).length > 0 ? (
          cart?.items?.map((cartItem) => <ListItem cartItem={cartItem} />)
        ) : (
          <div>No items</div>
        )}
      </div>
      <div>
        <CreateableSelect
          inputLabel="Select contact"
          fieldRequired
          value={cart?.contact_id}
          label={
            (contacts || []).filter(
              (c: ContactObject) => c?.id === cart?.contact_id
            )[0]?.name || ""
          }
          onChange={(contactObject: any) => {
            setCart({
              ...cart,
              contact_id: parseInt(contactObject?.value),
            });
          }}
          onCreateOption={(inputValue: string) =>
            setCreateContactScreen({
              id: 1,
              name: inputValue,
            })
          }
          options={contacts?.map((val: ContactObject) => ({
            value: val?.id,
            label: val?.name || "",
          }))}
        />
        <TextField
          inputLabel="Hold for how many days?"
          selectOnFocus
          fieldRequired
          min={1}
          max={100}
          inputType="number"
          valueNum={holdPeriod}
          onChange={(e: any) => setHoldPeriod(e.target.value)}
        />
        <TextField
          inputLabel="Note"
          multiline
          value={note}
          onChange={(e: any) => setNote(e.target.value)}
        />
      </div>
      <div className="flex">
        <button
          className="fab-button__secondary w-full my-4 mr-2"
          onClick={onClickCancelHold}
        >
          CANCEL
        </button>
        <button
          className="fab-button w-full my-4 ml-2"
          disabled={
            !cart?.contact_id ||
            Object.keys(cart?.items || {}).length === 0 ||
            !holdPeriod
          }
          onClick={onClickConfirmHold}
        >
          {submitting ? "HOLDING..." : "CONFIRM HOLD"}
        </button>
      </div>
    </div>
  );
}
