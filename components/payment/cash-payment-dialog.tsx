// Packages
import { useState, useMemo } from "react";
import { useAtom } from "jotai";
import Select from "react-select";

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
  StockObject,
  VendorObject,
  ModalButton,
  PaymentMethodTypes,
  VendorPaymentTypes,
} from "@/lib/types";

// Functions
import { saveLog, saveVendorPaymentToDatabase } from "@/lib/db-functions";
import { getTotalOwing } from "@/lib/data-functions";

// Components
import TextField from "@/components/_components/inputs/text-field";
import Modal from "@/components/_components/container/modal";
import CreateableSelect from "@/components/_components/inputs/createable-select";
import dayjs from "dayjs";

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
  const [isLoading, setIsLoading] = useState(false);
  const [paymentType, setPaymentType] = useState(VendorPaymentTypes.Cash);

  // Constants
  const totalOwing = useMemo(
    () =>
      getTotalOwing(
        vendorPayments?.filter(
          (v: VendorPaymentObject) => v?.vendor_id === vendor_id
        ),
        sales?.filter(
          (v: VendorSaleItemObject) =>
            inventory?.filter((i: StockObject) => i?.id === v?.item_id)[0]
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
          date: dayjs.utc().format(),
          amount: Math.round(parseFloat(payment) * 100),
          clerk_id: clerk?.id,
          vendor_id: vendor?.id,
          register_id: registerID,
          type: paymentType,
        };
        saveVendorPaymentToDatabase(vendorPayment).then((id) => {
          mutateVendorPayments([...vendorPayments, { ...vendorPayment, id }]);
          if (paymentType === VendorPaymentTypes.Cash) mutateCashGiven();
          saveLog(
            {
              log: `${
                paymentType === VendorPaymentTypes.Cash
                  ? "Cash"
                  : "Direct deposit"
              } payment made to Vendor (${vendor?.id || ""}).`,
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
      title={`VENDOR PAYMENT`}
      buttons={buttons}
    >
      <>
        <div className="text-sm mt-2">Select Payment Method</div>
        <Select
          className="w-full"
          value={{ value: paymentType, label: paymentType?.toUpperCase() }}
          options={[VendorPaymentTypes.Cash, VendorPaymentTypes.DD]?.map(
            (type) => ({
              value: type,
              label: type?.toUpperCase(),
            })
          )}
          onChange={(paymentObject: any) =>
            setPaymentType(paymentObject?.value)
          }
        />
        <div className="text-sm mt-2">Select Vendor</div>
        <Select
          className="w-full"
          value={{
            value: vendor_id,
            label:
              vendors?.filter((v: VendorObject) => v?.id === vendor_id)[0]
                ?.name || "",
          }}
          options={vendors?.map((val: VendorObject) => ({
            value: val?.id,
            label: val?.name || "",
          }))}
          onChange={(vendorObject: any) => setVendor(vendorObject?.value)}
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
