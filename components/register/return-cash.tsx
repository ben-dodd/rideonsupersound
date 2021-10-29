// Packages
import { useState } from "react";
import { useAtom } from "jotai";

// DB
import { viewAtom, clerkAtom, alertAtom } from "@/lib/atoms";
import { useRegisterID, usePettyCash } from "@/lib/swr-hooks";
import { ModalButton } from "@/lib/types";

// Functions
import { savePettyCashToRegister } from "@/lib/db-functions";

// Components
import Modal from "@/components/container/modal";
import TextField from "@/components/inputs/text-field";

export default function PettyCashDialog() {
  // SWR
  const { registerID } = useRegisterID();
  const { mutatePettyCash } = usePettyCash(registerID);

  // Atoms
  const [clerk] = useAtom(clerkAtom);
  const [view, setView] = useAtom(viewAtom);
  const [, setAlert] = useAtom(alertAtom);

  // State
  const [amount, setAmount] = useState("0");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const buttons: ModalButton[] = [
    {
      type: "ok",
      disabled:
        submitting ||
        parseFloat(amount) === 0 ||
        amount <= "" ||
        isNaN(parseFloat(amount)),
      loading: submitting,
      onClick: async () => {
        setSubmitting(true);
        await savePettyCashToRegister(
          registerID,
          clerk?.id,
          false,
          amount,
          notes
        );
        setSubmitting(false);
        mutatePettyCash();
        setView({ ...view, returnCashDialog: false });
        setAmount("0");
        setNotes("");
        setAlert({
          open: true,
          type: "success",
          message: `$${
            amount ? parseFloat(amount).toFixed(2) : 0.0
          } put in the till.`,
        });
      },
      text: "ADD THE CASH",
    },
  ];

  return (
    <Modal
      open={view?.returnCashDialog}
      closeFunction={() => setView({ ...view, returnCashDialog: false })}
      title={"ADD CASH"}
      buttons={buttons}
    >
      <>
        <TextField
          divClass="text-8xl"
          startAdornment="$"
          inputClass="text-center"
          value={amount}
          error={amount && isNaN(parseFloat(amount))}
          autoFocus={true}
          selectOnFocus
          onChange={(e: any) => setAmount(e.target.value)}
        />
        <TextField
          inputLabel="Notes"
          className="mt-1"
          value={notes}
          onChange={(e: any) => setNotes(e.target.value)}
          multiline
        />
      </>
    </Modal>
  );
}
