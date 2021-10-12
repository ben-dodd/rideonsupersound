import { useState, useMemo } from "react";
import { useAtom } from "jotai";
import { showCashPaymentDialogAtom, clerkAtom } from "@/lib/atoms";
import {
  useInventory,
  useVendors,
  useVendorPayments,
  useSalesJoined,
  useRegisterID,
} from "@/lib/swr-hooks";
import {
  VendorSaleItemObject,
  VendorPaymentObject,
  InventoryObject,
  VendorObject,
} from "@/lib/types";

// Actions
import { saveLog, saveVendorPaymentToDatabase } from "@/lib/db-functions";
import { getTotalOwing } from "@/lib/data-functions";

// Material UI Components
import TextField from "@/components/inputs/text-field";
import Modal from "@/components/modal";
import CreateableSelect from "@/components/inputs/createable-select";

export default function CashPaymentDialog() {
  const { registerID } = useRegisterID();
  const { inventory } = useInventory();
  const { vendors } = useVendors();
  const { sales } = useSalesJoined();
  const { vendorPayments } = useVendorPayments();
  const [clerk] = useAtom(clerkAtom);
  const [showCashPaymentDialog, setShowCashPaymentDialog] = useAtom(
    showCashPaymentDialogAtom
  );
  const [submitting, setSubmitting] = useState(false);
  const [vendor_id, setVendor]: [number, Function] = useState();
  const [payment, setPayment] = useState("0");
  const [notes, setNotes] = useState("");
  const totalOwing = useMemo(
    () =>
      getTotalOwing(
        (vendorPayments || []).filter(
          (v: VendorPaymentObject) => v?.vendor_id === vendor_id
        ),
        (sales || []).filter(
          (v: VendorSaleItemObject) =>
            (inventory || []).filter(
              (i: InventoryObject) => i?.id === v?.item_id
            )[0]?.vendor_id === vendor_id
        )
      ),
    [vendor_id]
  );
  const vendor = useMemo(
    () => (vendors || []).filter((v: VendorObject) => v?.id === vendor_id),
    [vendor_id, vendors]
  );

  return (
    <Modal
      open={Boolean(showCashPaymentDialog)}
      onClose={() => setShowCashPaymentDialog(false)}
    >
      <CreateableSelect
        inputLabel="Select vendor"
        fieldRequired
        value={vendor_id}
        label={
          (vendors || []).filter((v: VendorObject) => v?.id === vendor_id)[0]
            ?.name || ""
        }
        onChange={(vendorObject: any) => setVendor(vendorObject?.value)}
        onCreateOption={(inputValue: string) =>
          // setCreateContactScreen({
          //   id: 1,
          //   name: inputValue,
          // })
          null
        }
        options={(vendors || [])?.map((val: VendorObject) => ({
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
        {`VENDOR OWED $${totalOwing.toFixed(2)}`}
      </div>
      <div className="my-4 text-center text-xl font-bold">
        {totalOwing < parseFloat(payment)
          ? `YOU CANNOT PAY VENDOR MORE THAN THEY ARE OWED`
          : "PAYMENT OK"}
      </div>
      <div className="flex">
        <div className="dialog-action__button-div mb-4">
          <button
            className="dialog-action__cancel-button mr-2"
            onClick={() => setShowCashPaymentDialog(false)}
          >
            CANCEL
          </button>

          <button
            className="dialog-action__ok-button mb-8"
            disabled={
              totalOwing < parseFloat(payment) ||
              !payment ||
              parseFloat(payment) <= 0
            }
            onClick={async () => {
              const vendorPaymentId = await saveVendorPaymentToDatabase({
                amount: Math.round(parseFloat(payment) * 100),
                bank_account_number: vendor?.bank_account_number,
                batch_number: `${registerID}`,
                sequence_number: "Test",
                clerk_id: clerk?.id,
                vendor_id: vendor?.id,
                register_id: registerID,
                type: "cash",
              });
              await saveLog({
                log: `Cash payment made to Vendor (${vendor?.id || ""}).`,
                clerk_id: clerk?.id,
                table_id: "vendor_payment",
                row_id: vendorPaymentId,
              });
              setSubmitting(false);
              setShowCashPaymentDialog(false);
            }}
          >
            PAY VENDOR
          </button>
        </div>
      </div>
    </Modal>
  );
}
