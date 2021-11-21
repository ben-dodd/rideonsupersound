// Packages
import { useState } from "react";
import { useAtom } from "jotai";

// DB
import {
  useSaleItemsForSale,
  useSaleTransactionsForSale,
  useInventory,
  useLogs,
  useVendors,
  useCashReceived,
  useCustomers,
  useGiftCards,
  useRegisterID,
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
  CustomerObject,
  VendorObject,
  PaymentMethodTypes,
  SaleTransactionObject,
  GiftCardObject,
} from "@/lib/types";

// Functions
import { getSaleVars, makeGiftCardCode } from "@/lib/data-functions";
import {
  saveSaleTransaction,
  saveStockToDatabase,
  saveLog,
} from "@/lib/db-functions";

// Components
import Modal from "@/components/container/modal";
import TextField from "@/components/inputs/text-field";
import RadioButton from "@/components/inputs/radio-button";
import Select from "react-select";

import SyncIcon from "@mui/icons-material/Sync";

export default function RefundPaymentDialog({ isNew }) {
  // Atoms
  const [clerk] = useAtom(clerkAtom);
  const [view, setView] = useAtom(viewAtom);
  const [sale, setSale] = useAtom(
    isNew ? newSaleObjectAtom : loadedSaleObjectAtom
  );
  const [, setAlert] = useAtom(alertAtom);

  // SWR
  const { registerID } = useRegisterID();
  const { transactions, mutateSaleTransactions } = useSaleTransactionsForSale(
    sale?.id
  );
  const { items } = useSaleItemsForSale(sale?.id);
  const { inventory, mutateInventory } = useInventory();
  const { vendors } = useVendors();
  const { logs, mutateLogs } = useLogs();
  const { customers } = useCustomers();
  const { giftCards, mutateGiftCards } = useGiftCards();
  const { mutateCashReceived } = useCashReceived(registerID);

  const { totalRemaining, totalPaid } = getSaleVars(
    items,
    transactions,
    inventory
  );

  // State
  const [refundAmount, setRefundAmount] = useState(`${totalPaid}`);
  const [paymentMethod, setPaymentMethod] = useState(PaymentMethodTypes.Cash);
  const [vendorWrapper, setVendorWrapper] = useState(null);
  const [giftCardCode, setGiftCardCode] = useState(makeGiftCardCode(giftCards));
  const [submitting, setSubmitting] = useState(false);

  function closeDialog() {
    setView({ ...view, refundPaymentDialog: false });
    setRefundAmount(null);
    setPaymentMethod(PaymentMethodTypes.Cash);
    setVendorWrapper(null);
  }

  // Constants
  const buttons: ModalButton[] = [
    {
      type: "ok",
      disabled:
        submitting ||
        parseFloat(refundAmount) === 0 ||
        refundAmount <= "" ||
        isNaN(parseFloat(refundAmount)),
      loading: submitting,
      onClick: async () => {
        setSubmitting(true);
        let giftCardId = null;
        if (paymentMethod === PaymentMethodTypes.GiftCard) {
          let newGiftCard: GiftCardObject = {
            is_gift_card: true,
            gift_card_code: giftCardCode,
            gift_card_amount: parseFloat(refundAmount) * 100,
            gift_card_remaining: parseFloat(refundAmount) * 100,
            note: `Gift card created as refund payment for sale #${sale?.id}.`,
            gift_card_is_valid: true,
          };
          giftCardId = await saveStockToDatabase(newGiftCard, clerk);
          giftCards &&
            mutateGiftCards(
              [...giftCards, { ...newGiftCard, giftCardId }],
              false
            );
          inventory &&
            mutateInventory(
              [...inventory, { ...newGiftCard, giftCardId }],
              false
            );
        }
        let transaction: SaleTransactionObject = {
          sale_id: sale?.id,
          clerk_id: clerk?.id,
          payment_method: paymentMethod,
          amount: parseFloat(refundAmount) * -100,
          cash_received:
            paymentMethod === PaymentMethodTypes.Cash
              ? parseFloat(refundAmount) * -100
              : null,
          gift_card_id: giftCardId,
          is_refund: true,
          register_id: registerID,
        };
        const id = await saveSaleTransaction(
          transaction,
          transactions,
          mutateSaleTransactions,
          paymentMethod === PaymentMethodTypes.Account
            ? vendorWrapper?.value
            : null
        );
        setSubmitting(false);
        closeDialog();
        mutateCashReceived();
        let method = "in cash";
        if (paymentMethod === PaymentMethodTypes.Card) method = "on card";
        else if (paymentMethod === PaymentMethodTypes.GiftCard)
          method = "with new Gift Card";
        else if (paymentMethod === PaymentMethodTypes.Account)
          method = `on ${
            vendors?.filter(
              (v: VendorObject) => v?.id === vendorWrapper?.value
            )[0]?.name
          } account`;
        saveLog(
          {
            log: `$${parseFloat(refundAmount)?.toFixed(2)} refunded to ${
              sale?.customer_id
                ? customers?.filter(
                    (c: CustomerObject) => c?.id === sale?.customer_id
                  )[0]?.name
                : "customer"
            } ${method} (sale #${sale?.id}).`,
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
          message: `$${parseFloat(refundAmount)?.toFixed(2)} REFUNDED.`,
        });
      },
      text: "COMPLETE",
    },
  ];

  return (
    <Modal
      open={view?.refundPaymentDialog}
      closeFunction={closeDialog}
      title={"REFUND"}
      buttons={buttons}
    >
      <>
        <RadioButton
          inputLabel="PAYMENT TYPE"
          group="payment"
          value={paymentMethod}
          onChange={(value: PaymentMethodTypes) => setPaymentMethod(value)}
          options={[
            {
              id: PaymentMethodTypes?.Cash,
              value: PaymentMethodTypes?.Cash,
              label: "Cash",
            },
            {
              id: PaymentMethodTypes?.Card,
              value: PaymentMethodTypes?.Card,
              label: "Card",
            },
            {
              id: PaymentMethodTypes?.Account,
              value: PaymentMethodTypes?.Account,
              label: "Account",
            },
            {
              id: PaymentMethodTypes?.GiftCard,
              value: PaymentMethodTypes?.GiftCard,
              label: "Gift Card",
            },
          ]}
        />
        {paymentMethod === PaymentMethodTypes.Account && (
          <>
            <div className="input-label">Select Vendor</div>
            <div className="helper-text">
              Select the vendor to allow account (store credit) refund payments.
            </div>
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
          </>
        )}

        {paymentMethod === PaymentMethodTypes.GiftCard && (
          <div className="flex justify-between items-center">
            <div className="text-8xl text-red-800 font-mono">
              {giftCardCode}
            </div>
            <button
              className="icon-button-small-mid"
              onClick={() => setGiftCardCode(makeGiftCardCode(giftCards))}
            >
              <SyncIcon />
            </button>
          </div>
        )}
        <TextField
          divClass="text-8xl"
          startAdornment="$"
          inputClass="text-center"
          value={refundAmount}
          autoFocus={true}
          selectOnFocus
          onChange={(e: any) => setRefundAmount(e.target.value)}
        />
      </>
    </Modal>
  );
}
