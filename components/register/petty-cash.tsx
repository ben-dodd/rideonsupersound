import { useState } from "react";
import Modal from "@/components/modal";
import { useAtom } from "jotai";
import { pettyCashAtom, clerkAtom } from "@/lib/atoms";
import TextField from "@/components/inputs/text-field";
import { savePettyCashToRegister } from "@/lib/db-functions";
import CloseButton from "@/components/button/close-button";
import { useRegisterID } from "@/lib/swr-hooks";

export default function PettyCashDialog() {
  const [clerk] = useAtom(clerkAtom);
  const { registerID } = useRegisterID();
  const [pettyCashDialog, setPettyCashDialog] = useAtom(pettyCashAtom);
  const isTake = pettyCashDialog === 2; // 1 means Give Cash Back, 0 means close dialog
  const [amount, setAmount] = useState("0");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  return (
    <Modal open={pettyCashDialog > 0} onClose={() => setPettyCashDialog(0)}>
      <CloseButton closeFunction={() => setPettyCashDialog(0)} />
      <div className="p-4">
        <div className="text-center text-4xl font-bold py-2">
          {isTake ? "TAKE CASH" : "RETURN CASH"}
        </div>

        <TextField
          startAdornment="$"
          inputLabel="Amount"
          divClass="text-5xl"
          error={amount && isNaN(parseFloat(amount))}
          value={amount}
          autoFocus
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
        <button
          className="dialog-action__ok-button mb-8"
          disabled={
            submitting ||
            parseFloat(amount) === 0 ||
            amount <= "" ||
            isNaN(parseFloat(amount))
          }
          onClick={async () => {
            setSubmitting(true);
            await savePettyCashToRegister(
              registerID,
              clerk?.id,
              isTake,
              amount,
              notes
            );
            setSubmitting(false);
            setPettyCashDialog(0);
          }}
        >
          {isTake ? "TAKE IT!" : "GIVE IT BACK!"}
        </button>
      </div>
    </Modal>
  );
}
