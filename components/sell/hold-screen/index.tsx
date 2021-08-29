import { useState } from "react";
import { useAtom } from "jotai";
import {
  cartAtom,
  clerkAtom,
  showCartAtom,
  showHoldAtom,
  sellSearchBarAtom,
  showCreateContactAtom,
} from "@/lib/atoms";
import { CartItem } from "@/lib/types";
import TextField from "@/components/inputs/text-field";
import CreateableSelect from "@/components/inputs/createable-select";
import ListItem from "./list-item";
import { useContacts } from "@/lib/swr-hooks";

export default function HoldScreen() {
  const [cart, setCart] = useAtom(cartAtom);
  const [, setCreateContactScreen] = useAtom(showCreateContactAtom);
  const [, setShowCart] = useAtom(showCartAtom);
  const [, setShowHold] = useAtom(showHoldAtom);
  const [, setSearch] = useAtom(sellSearchBarAtom);
  const [clerk] = useAtom(clerkAtom);
  const { contacts, isLoading } = useContacts();
  const [holdPeriod, setHoldPeriod] = useState(30);
  const [note, setNote] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function onClickConfirmHold() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/create-hold", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contact_id: cart?.contact_id,
          hold_period: holdPeriod,
          started_by: clerk?.id,
          note: cart?.note,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw Error(json.message);
      Object.entries<CartItem>(cart?.items || {}).forEach(
        async ([id, cartItem]) => {
          try {
            const res2 = await fetch("/api/create-hold-item", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                hold_id: json?.insertId,
                item_id: id,
                quantity: cartItem?.cart_quantity,
                vendor_discount: cartItem?.vendor_discount,
                store_discount: cartItem?.store_discount,
              }),
            });
            const json2 = await res2.json();
            if (!res2.ok) throw Error(json2.message);
          } catch (e2) {
            throw Error(e2.message);
          }
        }
      );
      setSubmitting(false);
      setCart({ ...cart, contact_id: json?.insertId });
      setSearch(null);
      setCart(null);
      setShowCart(false);
      setShowHold(false);
    } catch (e) {
      throw Error(e.message);
    }
  }

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
          label={
            (contacts || []).filter((c) => c?.id === cart?.contact_id)[0]
              ?.name || ""
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
          options={Object.entries(contacts || {}).map(
            ([id, val]: [string, any]) => ({
              value: val?.id,
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
        <TextField
          inputLabel="Note"
          multiline
          rows={3}
          value={note}
          onChange={(e: any) => setNote(e.target.value)}
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
          {submitting ? "HOLDING..." : "CONFIRM HOLD"}
        </button>
      </div>
    </div>
  );
}
