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
import { writeKiwiBankBatchFile } from "@/lib/data-functions";
import dayjs from "dayjs";

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
      // onClick: () => {
      //   payVendors
      //     .filter(
      //       (vendor: VendorObject) =>
      //         vendor?.bank_account_number &&
      //         parseFloat(
      //           paymentAmounts[vendor?.id] || vendor?.totalOwing || "0"
      //         ) > 0
      //     )
      //     .forEach(async (vendor: VendorObject) => {
      //       let vendorPayment = {
      //         amount: Math.round(
      //           parseFloat(
      //             paymentAmounts[vendor?.id] || vendor?.totalOwing || "0"
      //           ) * 100
      //         ),
      //         bank_account_number: vendor?.bank_account_number,
      //         batch_number: "Test",
      //         sequence_number: "Test",
      //         clerk_id: clerk?.id,
      //         vendor_id: vendor?.id,
      //         register_id: registerID,
      //         type: "batch",
      //       };
      //       saveVendorPaymentToDatabase(vendorPayment).then((id) => {
      //         mutateVendorPayments([
      //           ...vendorPayments,
      //           { ...vendorPayment, id },
      //         ]);
      //         mutateCashGiven();
      //         saveLog(
      //           {
      //             log: `Batch payment made to Vendor (${vendor?.id || ""}).`,
      //             clerk_id: clerk?.id,
      //             table_id: "vendor_payment",
      //             row_id: id,
      //           },
      //           logs,
      //           mutateLogs
      //         );
      //       });
      //     });
      // },
      fileName: `batch-payment-${dayjs().format("YYYY-MM-DD")}.csv`,
      data: writeKiwiBankBatchFile({
        transactions: [],
        // transactions: payVendors
        //   .filter(
        //     (vendor: VendorObject) =>
        //       vendor?.bank_account_number &&
        //       parseFloat(
        //         paymentAmounts[vendor?.id] || vendor?.totalOwing || "0"
        //       ) > 0
        //   )
        //   .map((vendor: VendorObject) => ({
        //     name: vendor?.name || "",
        //     vendor_id: `${vendor?.id || ""}`,
        //     accountNumber: vendor?.bank_account_number || "",
        //     amount: parseFloat(
        //       paymentAmounts[vendor?.id] || vendor?.totalOwing || "0"
        //     ),
        //   })),
        batchNumber: `${registerID}`,
        sequenceNumber: "Test",
      }),
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
