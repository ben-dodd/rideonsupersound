// Packages
import { useState } from "react";
import { useAtom } from "jotai";

// DB
import { useInventory, useRegisterID } from "@/lib/swr-hooks";
import { viewAtom, clerkAtom, receiveStockAtom } from "@/lib/atoms";
import { ModalButton } from "@/lib/types";

// Functions
import { receiveStock } from "@/lib/db-functions";

// Components
import ScreenContainer from "@/components/_components/container/screen";

// Icons

export default function BatchPaymentScreen() {
  // Atoms
  const { inventory, mutateInventory } = useInventory();
  const [view, setView] = useAtom(viewAtom);
  const [clerk] = useAtom(clerkAtom);
  const [step, setStep] = useState(0);
  const [receivedStock, setReceivedStock] = useState(null);

  // SWR
  const { registerID } = useRegisterID();

  const buttons: ModalButton[] = [
    // {
    //   type: "cancel",
    //   onClick: () => setView({ ...view, batchVendorPaymentScreen: false }),
    //   text: "CANCEL",
    // },
    {
      type: "ok",
      text: "OK",
      // disabled: !basket?.vendor_id,
      onClick: () => {
        setView({ ...view, batchVendorPaymentScreen: false });
      },
    },
  ];

  return (
    <ScreenContainer
      show={view?.batchVendorPaymentScreen}
      closeFunction={() =>
        setView({ ...view, batchVendorPaymentScreen: false })
      }
      title={"BATCH PAYMENTS"}
      buttons={buttons}
      titleClass="bg-col4"
    >
      <div className="flex">
        <div className="w-1/4"></div>
        <div className="w-3/4"></div>
      </div>
    </ScreenContainer>
  );
}
