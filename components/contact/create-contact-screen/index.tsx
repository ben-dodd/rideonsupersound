import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { showCreateContactAtom, cartAtom } from "@/lib/atoms";
import { useContacts } from "@/lib/swr-hooks";
import { ContactObject } from "@/lib/types";
import TextField from "@/components/inputs/text-field";

export default function CreateContactScreen() {
  const [cart, setCart] = useAtom(cartAtom);
  const [contact, setContact]: [ContactObject, any] = useAtom(
    showCreateContactAtom
  );
  const [nameConflict, setNameConflict] = useState(false);
  const { contacts } = useContacts();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    contacts &&
      setNameConflict(
        contacts?.map((c: ContactObject) => c?.name).includes(contact?.name)
      );
  }, [contacts, contact?.name]);

  async function onClickCreateContact() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/create-contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: contact?.name || null,
          email: contact?.email || null,
          phone: contact?.phone || null,
          postal_address: contact?.postal_address || null,
          note: contact?.note || null,
        }),
      });
      setSubmitting(false);
      const json = await res.json();
      if (!res.ok) throw Error(json.message);
      setContact({ id: 0 });
      setCart({ ...cart, contact_id: json?.insertId });
    } catch (e) {
      throw Error(e.message);
    }
  }

  return (
    <div className="flex flex-col justify-between h-menu px-2 bg-blue-200 text-black">
      <div>
        <div className="text-lg my-2 tracking-wide self-center">
          Create New Contact
        </div>
        <TextField
          inputLabel="Name"
          fieldRequired
          error={nameConflict}
          errorText="Name already exists."
          value={contact?.name || ""}
          onChange={(e: any) =>
            setContact({ ...contact, name: e.target.value })
          }
        />
        <TextField
          inputLabel="Email"
          value={contact?.email || ""}
          onChange={(e: any) =>
            setContact({ ...contact, email: e.target.value })
          }
        />
        <TextField
          inputLabel="Phone"
          value={contact?.phone || ""}
          onChange={(e: any) =>
            setContact({ ...contact, phone: e.target.value })
          }
        />
        <TextField
          inputLabel="Postal Address"
          multiline
          rows={4}
          value={contact?.postal_address || ""}
          onChange={(e: any) =>
            setContact({ ...contact, postal_address: e.target.value })
          }
        />
        <TextField
          inputLabel="Notes"
          multiline
          rows={4}
          value={contact?.note || ""}
          onChange={(e: any) =>
            setContact({ ...contact, note: e.target.value })
          }
        />
      </div>
      <div>
        <button
          className="fab-button w-full my-4"
          disabled={!contact?.name || nameConflict}
          onClick={onClickCreateContact}
        >
          {submitting ? "CREATING..." : "CREATE"}
        </button>
      </div>
    </div>
  );
}
