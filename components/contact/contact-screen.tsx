// Packages
import { useState, useEffect } from "react";
import { useAtom } from "jotai";

// DB
import { useContacts } from "@/lib/swr-hooks";
import {
  viewAtom,
  newSaleObjectAtom,
  loadedContactObjectAtom,
} from "@/lib/atoms";
import { ContactObject, ModalButton } from "@/lib/types";

// Components
import TextField from "@/components/inputs/text-field";
import SidebarContainer from "@/components/container/side-bar";

export default function CreateContactScreen() {
  // SWR
  const { contacts } = useContacts();

  // Atoms
  const [cart, setCart] = useAtom(newSaleObjectAtom);
  const [view, setView] = useAtom(viewAtom);
  const [contact, setContact] = useAtom(loadedContactObjectAtom);

  // State
  const [nameConflict, setNameConflict] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Load
  useEffect(() => {
    contacts &&
      setNameConflict(
        contacts?.map((c: ContactObject) => c?.name).includes(contact?.name)
      );
  }, [contacts, contact?.name]);

  // Functions
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
      setContact(null);
      setView({ ...view, createContact: false });
      setCart({ ...cart, contact_id: json?.insertId });
    } catch (e) {
      throw Error(e.message);
    }
  }

  // Constants
  const buttons: ModalButton[] = [
    {
      type: "cancel",
      onClick: () => {
        setContact(null);
        setView({ ...view, createContact: false });
      },
      text: "CANCEL",
    },
    {
      type: "ok",
      onClick: onClickCreateContact,
      disabled: !contact?.name || nameConflict,
      text: submitting ? "CREATING..." : "CREATE",
    },
  ];

  return (
    <SidebarContainer
      show={view?.createContact}
      title={"Create New Contact"}
      buttons={buttons}
    >
      <TextField
        inputLabel="Name"
        fieldRequired
        error={nameConflict}
        errorText="Name already exists."
        value={contact?.name || ""}
        onChange={(e: any) => setContact({ ...contact, name: e.target.value })}
      />
      <TextField
        inputLabel="Email"
        value={contact?.email || ""}
        onChange={(e: any) => setContact({ ...contact, email: e.target.value })}
      />
      <TextField
        inputLabel="Phone"
        value={contact?.phone || ""}
        onChange={(e: any) => setContact({ ...contact, phone: e.target.value })}
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
        onChange={(e: any) => setContact({ ...contact, note: e.target.value })}
      />
    </SidebarContainer>
  );
}
