import { useState, useEffect } from "react";
import { useAtom } from "jotai";

// Store
import { getAmountFromCashMap } from "@/lib/data-functions";
import { saveLog } from "@/lib/db-functions";
import { TillObject } from "@/lib/types";
import { clerkAtom } from "@/lib/atoms";

import TextField from "@/components/inputs/text-field";
import CashMap from "./cash-map";

function OpenRegisterScreen() {
  // State
  const [clerk] = useAtom(clerkAtom);
  const [till, setTill] = useState({});
  const [notes, setNotes] = useState("");
  const [openAmount, setOpenAmount] = useState(getAmountFromCashMap(till));
  useEffect(() => setOpenAmount(getAmountFromCashMap(till)), [till]);
  const invalidOpenAmount = isNaN(parseFloat(`${openAmount}`));

  const openRegister = () => {
    // updateData({
    //   dispatch,
    //   collection: "registers",
    //   update: {
    //     openStaff: get(currentStaff, "id"),
    //     openDate: new Date(),
    //     openAmount: parseFloat(openAmount),
    //     openNotes: notes,
    //     openTill: till,
    //   },
    //   onDataUpdated: (id) => {
    //     saveLog({log: `Register opened.`, table: "register", id, clerk_id: clerk?.id);
    //     updateData({
    //       dispatch,
    //       collection: "registers",
    //       doc: "state",
    //       update: { registerOpen: true, currentRegister: id },
    //     });
    //   },
    // });
  };

  return (
    <div className="flex justify-center">
      <div className="flex flex-col justify-center h-full pt-12 max-w-md">
        <div className="text-sm">
          Open register by entering the total float in the till. Either enter
          the notes and coins or enter the total directly.
        </div>
        <TextField
          startAdornment="$"
          inputLabel="Total Float"
          divClass="text-5xl"
          error={isError(till)}
          value={`${openAmount}`}
          onChange={(e: any) => setOpenAmount(e.target.value)}
        />
        <CashMap till={till} setTill={setTill} />
        <TextField
          inputLabel="Notes"
          value={notes}
          onChange={(e: any) => setNotes(e.target.value)}
          multiline
        />
        <button
          disabled={isError(till)}
          className="my-6 dialog-action__ok-button"
          onClick={openRegister}
        >
          Open Register
        </button>
      </div>
    </div>
  );
}

function isError(till: TillObject) {
  let error = false;
  ["100d", "50d", "20d", "10d", "5d", "2d", "1d", "50c", "20c", "10c"].forEach(
    (denom) => {
      if (
        till[denom] &&
        (isNaN(parseInt(till[denom])) || parseInt(till[denom]) < 0)
      )
        error = true;
    }
  );
  return error;
}

export default OpenRegisterScreen;
