import { useState } from "react";
import { useAtom } from "jotai";
import { cartAtom, showCreateContactAtom } from "@/lib/atoms";
import TextField from "@/components/inputs/text-field";
import CreateableSelect from "@/components/inputs/createable-select";
import ListItem from "./list-item";
import { useContacts } from "@/lib/swr-hooks";

export default function HoldScreen() {
  const [cart, setCart] = useAtom(cartAtom);
  const [, setCreateContactScreen] = useAtom(showCreateContactAtom);
  const { contacts, isLoading } = useContacts();
  const [holdPeriod, setHoldPeriod] = useState(30);

  const onClickConfirmHold = () => {
    // let holdMap = {
    //   contact_id: cart?.contact_id || null,
    //   note: cart?.note || null
    // }
    //
  };

  console.table(cart);
  console.log(contacts);

  return (
    <div className="flex flex-col justify-between h-menu px-2 bg-blue-200 text-black">
      <div>
        <div className="flex justify-between mb-2 relative">
          <div className="text-lg my-2 tracking-wide self-center">
            Hold Items
          </div>
        </div>
        <div className="flex-grow overflow-x-hidden overflow-y-scroll">
          {Object.keys(cart?.items || {}).length > 0 ? (
            Object.entries(cart.items).map(([id, cartItem]) => (
              <ListItem id={id} cartItem={cartItem} />
            ))
          ) : (
            <div>No items</div>
          )}
        </div>
        <CreateableSelect
          inputLabel="Select contact"
          fieldRequired
          value={cart?.contact_id}
          label={(contacts && contacts[cart?.contact_id]?.name) || ""}
          onChange={(contactObject: any) =>
            setCart({
              ...cart,
              contact_id: contactObject?.value,
            })
          }
          onCreateOption={(inputValue: string) =>
            setCreateContactScreen({
              id: 1,
              name: inputValue,
            })
          }
          options={Object.entries(contacts || {}).map(
            ([id, val]: [string, any]) => ({
              value: id,
              label: val?.name || "",
            })
          )}
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
      </div>
      <div>
        <button
          className="fab-button w-full my-4"
          disabled={
            !cart?.contact_id ||
            Object.keys(cart?.items || {}).length === 0 ||
            !holdPeriod
          }
          onClick={onClickConfirmHold}
        >
          CONFIRM HOLD
        </button>
      </div>
    </div>
  );
}
