import { useState } from "react";
import Modal from "@/components/container/modal";
import { useAtom } from "jotai";
import { viewAtom, clerkAtom } from "@/lib/atoms";
import TextField from "@/components/inputs/text-field";
import { ModalButton } from "@/lib/types";
import { savePettyCashToRegister } from "@/lib/db-functions";
import { useRegisterID, usePettyCash } from "@/lib/swr-hooks";

export default function PettyCashDialog() {
  const [clerk] = useAtom(clerkAtom);
  const { registerID } = useRegisterID();
  const { mutatePettyCash } = usePettyCash(registerID);
  const [view, setView] = useAtom(viewAtom);
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
      onClick: async () => {
        setSubmitting(true);
        await savePettyCashToRegister(
          registerID,
          clerk?.id,
          true,
          amount,
          notes
        );
        setAmount("0");
        setNotes("");
        mutatePettyCash();
        setSubmitting(false);
        setView({ ...view, takeCashDialog: false });
      },
      text: "TAKE IT!",
    },
  ];

  return (
    <Modal
      open={view?.takeCashDialog}
      closeFunction={() => setView({ ...view, takeCashDialog: false })}
      title={"TAKE CASH"}
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
