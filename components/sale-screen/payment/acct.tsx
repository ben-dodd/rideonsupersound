// Packages
import { useState, useMemo } from "react";
import { useAtom } from "jotai";

// DB
import {
  useSaleTransactionsForSale,
  useSaleItemsForSale,
  useInventory,
  useLogs,
  useVendors,
  useRegisterID,
  useVendorPayments,
  useSalesJoined,
} from "@/lib/swr-hooks";
import {
  viewAtom,
  newSaleObjectAtom,
  loadedSaleObjectAtom,
  clerkAtom,
  alertAtom,
} from "@/lib/atoms";
import {
  ModalButton,
  SaleTransactionObject,
  VendorObject,
  PaymentMethodTypes,
} from "@/lib/types";

// Functions
import { getPaymentVars, getSaleVars } from "@/lib/data-functions";
import { saveSaleTransaction, saveLog } from "@/lib/db-functions";

// Components
import Modal from "@/components/_components/container/modal";
import TextField from "@/components/_components/inputs/text-field";
import Select from "react-select";

export default function Acct({ isNew }) {
  // Atoms
  const [clerk] = useAtom(clerkAtom);
  const [view, setView] = useAtom(viewAtom);
  const [sale] = useAtom(isNew ? newSaleObjectAtom : loadedSaleObjectAtom);
  const [, setAlert] = useAtom(alertAtom);

  // State
  const [vendorWrapper, setVendorWrapper] = useState(null);

  // SWR
  const { registerID } = useRegisterID();

  const { transactions, mutateSaleTransactions } = useSaleTransactionsForSale(
    sale?.id
  );
  const { items } = useSaleItemsForSale(sale?.id);
  const { inventory } = useInventory();
  const { logs, mutateLogs } = useLogs();
  const { vendors } = useVendors();
  const { sales } = useSalesJoined();
  const { vendorPayments } = useVendorPayments();

  const { totalRemaining } = getSaleVars(items, transactions, inventory);

  // State
  const [acctPayment, setAcctPayment] = useState(`${totalRemaining}`);
  const [submitting, setSubmitting] = useState(false);

  // Constants
  const vendorVars = useMemo(
    () =>
      getPaymentVars(
        inventory,
        sales,
        vendorPayments,
        vendorWrapper?.value?.id
      ),
    [inventory, sales, vendorPayments, vendorWrapper?.value?.id]
  );

  const buttons: ModalButton[] = [
    {
      type: "ok",
      disabled:
        submitting ||
        parseFloat(acctPayment) > totalRemaining ||
        vendorVars?.totalOwing / 100 < parseFloat(acctPayment) ||
        parseFloat(acctPayment) === 0 ||
        acctPayment <= "" ||
        isNaN(parseFloat(acctPayment)),
      loading: submitting,
      onClick: async () => {
        setSubmitting(true);
        let transaction: SaleTransactionObject = {
          sale_id: sale?.id,
          clerk_id: clerk?.id,
          payment_method: PaymentMethodTypes.Account,
          amount:
            parseFloat(acctPayment) >= totalRemaining
              ? totalRemaining * 100
              : parseFloat(acctPayment) * 100,
          register_id: registerID,
        };
        const id = await saveSaleTransaction(
          transaction,
          transactions,
          mutateSaleTransactions,
          vendorWrapper?.value
        );
        setSubmitting(false);
        setView({ ...view, acctPaymentDialog: false });
        saveLog(
          {
            log: `$${parseFloat(acctPayment)?.toFixed(
              2
            )} account payment from vendor ${
              vendorWrapper?.value?.name
            } (sale #${sale?.id}).`,
            clerk_id: clerk?.id,
            table_id: "sale_transaction",
            row_id: id,
          },
          logs,
          mutateLogs
        );
        setAlert({
          open: true,
          type: "success",
          message: `$${parseFloat(acctPayment)?.toFixed(2)} ACCOUNT PAYMENT`,
        });
      },
      text: "COMPLETE",
    },
  ];

  return (
    <Modal
      open={view?.acctPaymentDialog}
      closeFunction={() => setView({ ...view, acctPaymentDialog: false })}
      title={"ACCOUNT PAYMENT"}
      buttons={buttons}
    >
      <>
        <TextField
          divClass="text-8xl"
          startAdornment="$"
          inputClass="text-center"
          value={acctPayment}
          autoFocus={true}
          selectOnFocus
          onChange={(e: any) => setAcctPayment(e.target.value)}
        />
        <div className="input-label">Select Vendor</div>
        <div className="pb-32">
          <Select
            className="w-full self-stretch"
            value={vendorWrapper}
            options={vendors
              ?.sort((vendorA: VendorObject, vendorB: VendorObject) => {
                const a = vendorA?.name;
                const b = vendorB?.name;
                return a > b ? 1 : b > a ? -1 : 0;
              })
              ?.map((vendor: VendorObject) => ({
                value: vendor,
                label: vendor?.name,
              }))}
            onChange={(v: any) => setVendorWrapper(v)}
          />
        </div>
        <div className="text-center">{`Remaining to pay: $${(
          totalRemaining || 0
        )?.toFixed(2)}`}</div>
        <div className="text-center font-bold">
          {`Remaining in account: ${
            false
              ? `Loading...`
              : `$${(vendorVars?.totalOwing / 100)?.toFixed(2)}`
          }`}
        </div>
        <div className="text-center text-xl font-bold my-4">
          {acctPayment === "" || parseFloat(acctPayment) === 0
            ? "..."
            : isNaN(parseFloat(acctPayment))
            ? "NUMBERS ONLY PLEASE"
            : parseFloat(acctPayment) > totalRemaining
            ? `PAYMENT TOO HIGH`
            : vendorVars?.totalOwing / 100 < parseFloat(acctPayment)
            ? `NOT ENOUGH IN ACCOUNT`
            : parseFloat(acctPayment) < totalRemaining
            ? `AMOUNT SHORT BY $${(
                totalRemaining - parseFloat(acctPayment)
              )?.toFixed(2)}`
            : "ALL GOOD!"}
        </div>
      </>
    </Modal>
  );
}
