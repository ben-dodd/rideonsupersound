// Packages
import { useState } from "react";
import { useAtom } from "jotai";

// DB
import { useSales, useLogs, useRegisterID } from "@/lib/swr-hooks";
import { viewAtom, clerkAtom, alertAtom } from "@/lib/atoms";
import { SaleObject } from "@/lib/types";

// Functions

// Components
import Modal from "@/components/container/modal";

export default function LoadSales() {
  // Atoms
  const [clerk] = useAtom(clerkAtom);
  const [view, setView] = useAtom(viewAtom);
  const [, setAlert] = useAtom(alertAtom);

  // SWR
  const { registerID } = useRegisterID();
  const { mutateLogs } = useLogs();
  const { sales } = useSales();

  // State
  const [submitting, setSubmitting] = useState(false);

  // Constants
  const parkedSales = sales?.filter(
    (s: SaleObject) => s?.state === "parked" || s?.state === "layby"
  );

  return (
    <Modal
      open={view?.loadSalesDialog}
      closeFunction={() => setView({ ...view, loadSalesDialog: false })}
      title={"PARKED SALES AND LAYBYS"}
    >
      {parkedSales?.length > 0 ? (
        <div>
          {parkedSales?.map((p: SaleObject, i: number) => (
            <div key={i}>{p?.id}</div>
          ))}
        </div>
      ) : (
        <div>No parked sales or laybys.</div>
      )}
    </Modal>
  );
}
