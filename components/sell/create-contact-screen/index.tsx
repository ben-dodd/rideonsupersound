import { useAtom } from "jotai";
import { showCreateContactAtom } from "@/lib/atoms";
import { ContactObject } from "@/lib/types";
import TextField from "@/components/inputs/text-field";

export default function CreateContactScreen() {
  const [contact, setContact]: [ContactObject, any] = useAtom(
    showCreateContactAtom
  );

  const onClickCreateContact = () => {
    // let holdMap = {
    //   contact_id: cart?.contact_id || null,
    //   note: cart?.note || null
    // }
    //
  };

  return (
    <div className="flex flex-col justify-between h-menu px-2 bg-blue-200 text-black">
      <div>
        <div className="text-lg my-2 tracking-wide self-center">
          Create New Contact
        </div>
        <TextField
          inputLabel="Name"
          fieldRequired
          value={contact?.name}
          onChange={(e: any) =>
            setContact({ ...contact, name: e.target.value })
          }
        />
        <TextField
          inputLabel="Email"
          value={contact?.email}
          onChange={(e: any) =>
            setContact({ ...contact, email: e.target.value })
          }
        />
        <TextField
          inputLabel="Phone"
          value={contact?.phone}
          onChange={(e: any) =>
            setContact({ ...contact, phone: e.target.value })
          }
        />
        <TextField
          inputLabel="Postal Address"
          multiline
          rows={4}
          value={contact?.postal_address}
          onChange={(e: any) =>
            setContact({ ...contact, postal_address: e.target.value })
          }
        />
        <TextField
          inputLabel="Notes"
          multiline
          rows={4}
          value={contact?.note}
          onChange={(e: any) =>
            setContact({ ...contact, note: e.target.value })
          }
        />
      </div>
      <div>
        <button
          className="fab-button w-full my-4"
          disabled={!contact?.name}
          onClick={onClickCreateContact}
        >
          CONFIRM HOLD
        </button>
      </div>
    </div>
  );
}
