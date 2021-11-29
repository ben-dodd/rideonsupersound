// Packages
import { useState, useMemo } from "react";
import { useAtom } from "jotai";

// DB
import {
  useInventory,
  useVendors,
  useVendorPayments,
  useSalesJoined,
  useRegisterID,
  useCashGiven,
  useLogs,
} from "@/lib/swr-hooks";
import { viewAtom, clerkAtom } from "@/lib/atoms";
import {
  VendorSaleItemObject,
  VendorPaymentObject,
  InventoryObject,
  VendorObject,
  ModalButton,
  PaymentMethodTypes,
} from "@/lib/types";

// Functions
import { saveLog, saveVendorPaymentToDatabase } from "@/lib/db-functions";
import { getTotalOwing } from "@/lib/data-functions";

// Components
import TextField from "@/components/_components/inputs/text-field";
import Modal from "@/components/_components/container/modal";
import CreateableSelect from "@/components/_components/inputs/createable-select";

export default function CashPaymentDialog() {
  // SWR
  const { registerID } = useRegisterID();
  const { inventory } = useInventory();
  const { vendors } = useVendors();
  const { sales } = useSalesJoined();
  const { mutateCashGiven } = useCashGiven(registerID || 0);
  const { vendorPayments, mutateVendorPayments } = useVendorPayments();
  const { logs, mutateLogs } = useLogs();

  // Atoms
  const [clerk] = useAtom(clerkAtom);
  const [view, setView] = useAtom(viewAtom);

  // State
  const [submitting, setSubmitting] = useState(false);
  const [vendor_id, setVendor]: [number, Function] = useState(0);
  const [payment, setPayment] = useState("0");
  const [notes, setNotes] = useState("");

  // Constants
  const totalOwing = useMemo(
    () =>
      getTotalOwing(
        vendorPayments?.filter(
          (v: VendorPaymentObject) => v?.vendor_id === vendor_id
        ),
        sales?.filter(
          (v: VendorSaleItemObject) =>
            inventory?.filter((i: InventoryObject) => i?.id === v?.item_id)[0]
              ?.vendor_id === vendor_id
        )
      ),
    [vendor_id, vendorPayments]
  );
  const vendor = useMemo(
    () => vendors?.filter((v: VendorObject) => v?.id === vendor_id)[0],
    [vendor_id, vendors]
  );
  const buttons: ModalButton[] = [
    {
      type: "cancel",
      text: "CANCEL",
      onClick: resetAndCloseDialog,
    },
    {
      type: "ok",
      text: "PAY VENDOR",
      loading: submitting,
      onClick: async () => {
        setSubmitting(true);
        let vendorPayment = {
          amount: Math.round(parseFloat(payment) * 100),
          bank_account_number: vendor?.bank_account_number,
          batch_number: `${registerID}`,
          sequence_number: "Test",
          clerk_id: clerk?.id,
          vendor_id: vendor?.id,
          register_id: registerID,
          type: PaymentMethodTypes.Cash,
        };
        saveVendorPaymentToDatabase(vendorPayment).then((id) => {
          mutateVendorPayments([...vendorPayments, { ...vendorPayment, id }]);
          mutateCashGiven();
          saveLog(
            {
              log: `Cash payment made to Vendor (${vendor?.id || ""}).`,
              clerk_id: clerk?.id,
              table_id: "vendor_payment",
              row_id: id,
            },
            logs,
            mutateLogs
          );
          setSubmitting(false);
          resetAndCloseDialog();
        });
      },
      disabled:
        totalOwing < parseFloat(payment) ||
        !payment ||
        parseFloat(payment) <= 0,
    },
  ];

  // Functions
  function resetAndCloseDialog() {
    setView({ ...view, cashVendorPaymentDialog: false });
    setVendor(0);
    setPayment("0");
  }

  return (
    <Modal
      open={view?.cashVendorPaymentDialog}
      closeFunction={() => setView({ ...view, cashVendorPaymentDialog: false })}
      title={"CASH PAYMENT"}
      buttons={buttons}
    >
      <>
        <CreateableSelect
          inputLabel="Select vendor"
          fieldRequired
          value={vendor_id}
          label={
            vendors?.filter((v: VendorObject) => v?.id === vendor_id)[0]
              ?.name || ""
          }
          onChange={(vendorObject: any) => setVendor(vendorObject?.value)}
          onCreateOption={(inputValue: string) =>
            // REVIEW create vendor from select
            // setCreateCustomerSidebar({
            //   id: 1,
            //   name: inputValue,
            // })
            null
          }
          options={vendors?.map((val: VendorObject) => ({
            value: val?.id,
            label: val?.name || "",
          }))}
        />
        <TextField
          className="mt-4"
          divClass="text-8xl"
          inputClass="text-center"
          startAdornment="$"
          autoFocus
          selectOnFocus
          value={payment}
          onChange={(e: any) => setPayment(e.target.value)}
        />
        <TextField
          inputLabel="Notes"
          multiline
          rows={3}
          value={notes}
          onChange={(e: any) => setNotes(e.target.value)}
        />
        <div className="mt-4 text-center">
          {vendor_id > 0 && `VENDOR OWED $${(totalOwing / 100)?.toFixed(2)}`}
        </div>
        <div className="my-4 text-center text-xl font-bold">
          {vendor_id > 0
            ? totalOwing / 100 < parseFloat(payment)
              ? `YOU CANNOT PAY VENDOR MORE THAN THEY ARE OWED`
              : "PAYMENT OK"
            : "SELECT VENDOR"}
        </div>
      </>
    </Modal>
  );
}
