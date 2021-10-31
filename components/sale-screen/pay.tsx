// Packages
import { useState } from "react";
import { useAtom } from "jotai";

// DB
import { useContacts, useVendorFromContact } from "@/lib/swr-hooks";
import {
  newSaleObjectAtom,
  loadedSaleObjectAtom,
  viewAtom,
  loadedContactObjectAtom,
} from "@/lib/atoms";
import { ContactObject } from "@/lib/types";

// Components
import CreateableSelect from "@/components/inputs/createable-select";
import TextField from "@/components/inputs/text-field";

export default function Pay({ isNew }) {
  // Atoms
  const [sale, setSale] = useAtom(
    isNew ? newSaleObjectAtom : loadedSaleObjectAtom
  );
  const [, setContact] = useAtom(loadedContactObjectAtom);
  const [view, setView] = useAtom(viewAtom);

  // SWR
  const { contacts } = useContacts();
  const { vendor } = useVendorFromContact(sale?.contact_id);

  // State
  const [note, setNote] = useState("");

  return (
    <div className="flex flex-col justify-between">
      <div className="flex justify-between my-2">
        <div className="text-2xl font-bold">LEFT TO PAY</div>
        <div className="text-2xl text-red-500 font-bold text-xl">
          ${(sale?.totalRemaining || 0)?.toFixed(2)}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-4">
        <button
          className="square-button"
          disabled={sale?.totalRemaining === 0}
          onClick={() => setView({ ...view, cashPaymentDialog: true })}
        >
          CASH
        </button>
        <button
          className="square-button"
          disabled={sale?.totalRemaining === 0}
          onClick={() => setView({ ...view, cardPaymentDialog: true })}
        >
          CARD
        </button>
        <button
          className="square-button"
          disabled={!sale?.contact_id || !vendor || sale?.totalRemaining === 0}
          onClick={() => setView({ ...view, acctPaymentDialog: true })}
        >
          ACCT
          <div className={`text-xs ${sale?.contact_id ? "hidden" : "w-full"}`}>
            Contact Required
          </div>
        </button>
        <button
          className="square-button"
          disabled={true || sale?.totalRemaining === 0}
          onClick={() => setView({ ...view, giftPaymentDialog: true })}
        >
          GIFT
          <div className={`text-xs`}>Out of Order</div>
        </button>
      </div>
      <div className="font-bold">
        Select contact to enable laybys and account payments.
      </div>
      {/* TODO once contact has been used for ACCT or layby lock in contact */}
      <CreateableSelect
        inputLabel="Select contact"
        value={sale?.contact_id}
        label={
          (contacts || []).filter(
            (c: ContactObject) => c?.id === sale?.contact_id
          )[0]?.name || ""
        }
        onChange={(contactObject: any) => {
          setSale({
            ...sale,
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
        inputLabel="Note"
        multiline
        value={note}
        onChange={(e: any) => setNote(e.target.value)}
      />
    </div>
  );
}
