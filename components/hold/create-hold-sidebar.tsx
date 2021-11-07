// Packages
import { useState } from "react";
import { useAtom } from "jotai";

// DB
import { useContacts, useInventory, useLogs } from "@/lib/swr-hooks";
import {
  newSaleObjectAtom,
  clerkAtom,
  viewAtom,
  alertAtom,
  sellSearchBarAtom,
  loadedContactObjectAtom,
} from "@/lib/atoms";
import { ContactObject, ModalButton } from "@/lib/types";

// Functions
import { getItemSkuDisplayName } from "@/lib/data-functions";
import { saveHoldToDatabase, saveLog } from "@/lib/db-functions";

// Components
import TextField from "@/components/inputs/text-field";
import CreateableSelect from "@/components/inputs/createable-select";
import ListItem from "./list-item";
import SidebarContainer from "@/components/container/side-bar";

export default function CreateHoldSidebar() {
  // SWR
  const { contacts } = useContacts();
  const { inventory } = useInventory();
  const { logs, mutateLogs } = useLogs();

  // Atoms
  const [cart, setCart] = useAtom(newSaleObjectAtom);
  const [, setAlert] = useAtom(alertAtom);
  const [, setContact] = useAtom(loadedContactObjectAtom);
  const [view, setView] = useAtom(viewAtom);
  const [, setSearch] = useAtom(sellSearchBarAtom);
  const [clerk] = useAtom(clerkAtom);

  // State
  const [holdPeriod, setHoldPeriod] = useState(30);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Functions
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
        saveLog(
          {
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
          },
          logs,
          mutateLogs
        );
      }
    );
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

    // Reset vars and return to inventory scroll
    setSubmitting(false);
    setSearch(null);
    setCart(null);
    setView({ ...view, cart: false, createHold: false });
  }

  const buttons: ModalButton[] = [
    {
      type: "cancel",
      onClick: () => setView({ ...view, cart: false, createHold: false }),
      text: "CANCEL",
    },
    {
      type: "ok",
      onClick: onClickConfirmHold,
      disabled:
        !cart?.contact_id ||
        Object.keys(cart?.items || {}).length === 0 ||
        !holdPeriod,
      text: submitting ? "HOLDING..." : "CONFIRM HOLD",
    },
  ];

  return (
    <SidebarContainer
      show={view?.createHold}
      title={"Hold Items"}
      buttons={buttons}
    >
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
          onCreateOption={(inputValue: string) => {
            setContact({ name: inputValue });
            setView({ ...view, createContact: true });
          }}
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
    </SidebarContainer>
  );
}
