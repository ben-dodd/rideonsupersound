// Packages
import { useState } from "react";
import { useAtom } from "jotai";

// DB
import {
  useCustomers,
  useInventory,
  useLogs,
  useRegister,
  useRegisterID,
} from "@/lib/swr-hooks";
import {
  cartAtom,
  clerkAtom,
  viewAtom,
  alertAtom,
  sellSearchBarAtom,
  loadedCustomerObjectAtom,
} from "@/lib/atoms";
import { CustomerObject, StockObject, ModalButton } from "@/lib/types";

// Functions
import {
  getItemSkuDisplayNameById,
  getItemQuantity,
  getItemDisplayName,
  getItemSku,
} from "@/lib/data-functions";
import {
  addRestockTask,
  saveHoldToDatabase,
  saveLog,
  saveTaskToDatabase,
} from "@/lib/db-functions";

// Components
import TextField from "@/components/_components/inputs/text-field";
import CreateableSelect from "@/components/_components/inputs/createable-select";
import ListItem from "./list-item";
import SidebarContainer from "@/components/_components/container/side-bar";

export default function CreateHoldSidebar() {
  // SWR
  const { customers } = useCustomers();
  const { inventory } = useInventory();
  const { logs, mutateLogs } = useLogs();
  const { registerID } = useRegisterID();

  // Atoms
  const [cart, setCart] = useAtom(cartAtom);
  const [, setAlert] = useAtom(alertAtom);
  const [, setCustomer] = useAtom(loadedCustomerObjectAtom);
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
        const item = inventory?.filter(
          (i: StockObject) => i?.id === cartItem?.item_id
        )[0];
        const itemQuantity = getItemQuantity(item, cart?.items);
        if (itemQuantity > 0) {
          addRestockTask(cartItem?.item_id);
        }
        const rowId = await saveHoldToDatabase(
          cart,
          cartItem,
          holdPeriod,
          note,
          clerk,
          registerID
        );
        saveLog(
          {
            log: `${getItemSkuDisplayNameById(
              cartItem?.item_id,
              inventory
            )} put on hold for ${
              customers?.filter(
                (c: CustomerObject) => c?.id === cart?.customer_id
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
      message: `ITEM${cart?.items?.length === 1 ? "" : "S"} PUT ON HOLD FOR ${(
        customers?.filter((c: CustomerObject) => c?.id === cart?.customer_id)[0]
          ?.name || ""
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
        !cart?.customer_id ||
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
        {cart?.items?.length > 0 ? (
          cart?.items?.map((cartItem, i) => (
            <ListItem key={i} cartItem={cartItem} />
          ))
        ) : (
          <div>No items</div>
        )}
      </div>
      <div>
        <CreateableSelect
          inputLabel="Select customer"
          fieldRequired
          value={cart?.customer_id}
          label={
            customers?.filter(
              (c: CustomerObject) => c?.id === cart?.customer_id
            )[0]?.name || ""
          }
          onChange={(customerObject: any) => {
            setCart({
              ...cart,
              customer_id: parseInt(customerObject?.value),
            });
          }}
          onCreateOption={(inputValue: string) => {
            setCustomer({ name: inputValue });
            setView({ ...view, createCustomer: true });
          }}
          options={customers?.map((val: CustomerObject) => ({
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
