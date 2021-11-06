// Packages
import { useState, useMemo } from "react";
import { useAtom } from "jotai";

// DB
import {
  useSaleTransactionsForSale,
  useGiftCards,
  useVendorTotalPayments,
  useVendorTotalSales,
  useVendorFromContact,
  useLogs,
  useContacts,
  useRegisterID,
} from "@/lib/swr-hooks";
import {
  viewAtom,
  newSaleObjectAtom,
  loadedSaleObjectAtom,
  clerkAtom,
  alertAtom,
} from "@/lib/atoms";
import { GiftCardObject, ModalButton, ContactObject } from "@/lib/types";

// Functions
import { getTotalOwing } from "@/lib/data-functions";
import { saveSaleTransaction, saveLog } from "@/lib/db-functions";

// Components
import Modal from "@/components/container/modal";
import TextField from "@/components/inputs/text-field";

export default function Gift({ isNew }) {
  // Atoms
  const [clerk] = useAtom(clerkAtom);
  const [view, setView] = useAtom(viewAtom);
  const [sale, setSale] = useAtom(
    isNew ? newSaleObjectAtom : loadedSaleObjectAtom
  );
  const [, setAlert] = useAtom(alertAtom);

  // SWR
  const { giftCards } = useGiftCards();
  const { contacts } = useContacts();
  const { vendor } = useVendorFromContact(sale?.contact_id);
  const { totalPayments } = useVendorTotalPayments(sale?.contact_id);
  const { totalSales } = useVendorTotalSales(sale?.contact_id);
  const { mutateSaleTransactions } = useSaleTransactionsForSale(sale?.id);
  const { mutateLogs } = useLogs();
  const { registerID } = useRegisterID();

  // State
  const [giftCardPayment, setGiftCardPayment] = useState(
    `${sale?.totalRemaining}`
  );
  const [giftCardCode, setGiftCardCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Constants
  const totalOwing = useMemo(
    () =>
      totalPayments && totalSales
        ? getTotalOwing(totalPayments, totalSales) / 100
        : 0,
    [totalPayments, totalSales]
  );
  const giftCard = useMemo(
    () =>
      giftCards &&
      giftCards.filter(
        (giftCard: GiftCardObject) =>
          giftCard?.code === giftCardCode.toUpperCase()
      )[0],
    [giftCardCode, giftCards]
  );

  // TODO handle take gift card and give change
  const buttons: ModalButton[] = [
    {
      type: "ok",
      disabled:
        submitting ||
        parseFloat(giftCardPayment) > sale?.totalRemaining ||
        totalOwing < parseFloat(giftCardPayment) ||
        parseFloat(giftCardPayment) === 0 ||
        giftCardPayment <= "" ||
        isNaN(parseFloat(giftCardPayment)),
      loading: submitting,
      onClick: async () => {
        setSubmitting(true);
        const id = await saveSaleTransaction(
          sale,
          clerk,
          giftCardPayment,
          "acct",
          registerID,
          false,
          mutateSaleTransactions,
          setSale,
          vendor
        );
        setSubmitting(false);
        setView({ ...view, giftPaymentDialog: false });
        saveLog(
          {
            log: `$${parseFloat(giftCardPayment)?.toFixed(
              2
            )} gift card payment from ${
              sale?.contact_id
                ? contacts?.filter(
                    (c: ContactObject) => c?.id === sale?.contact_id
                  )[0]?.name
                : "customer"
            } (sale #${sale?.id}). Gift card #${giftCardCode}.`,
            clerk_id: clerk?.id,
            table_id: "sale_transaction",
            row_id: id,
          },
          mutateLogs
        );
        setAlert({
          open: true,
          type: "success",
          message: `$${parseFloat(giftCardPayment)?.toFixed(
            2
          )} GIFT CARD PAYMENT`,
        });
      },
      text: "COMPLETE",
    },
  ];

  return (
    <Modal
      open={view?.giftPaymentDialog}
      closeFunction={() => setView({ ...view, giftPaymentDialog: false })}
      title={"GIFT CARD PAYMENT"}
      buttons={buttons}
    >
      <>
        <TextField
          divClass="text-8xl"
          inputClass="text-center text-red-800 font-mono uppercase"
          value={giftCardCode}
          autoFocus={true}
          onChange={(e: any) => setGiftCardCode(e.target.value)}
        />
        <TextField
          divClass="text-8xl"
          startAdornment="$"
          inputClass="text-center"
          value={giftCardPayment}
          selectOnFocus
          onChange={(e: any) => setGiftCardPayment(e.target.value)}
        />
        <div className="text-center">{`Remaining to pay: $${(
          sale?.totalRemaining || 0
        )?.toFixed(2)}`}</div>
        <div className="text-center font-bold">
          {!giftCardCode || giftCardCode === ""
            ? "ENTER GIFT CARD CODE"
            : !giftCard
            ? "INVALID GIFT CARD CODE"
            : giftCard?.amount_remaining > 0
            ? `$${giftCard?.amount_remaining?.toFixed(2)} ON CARD`
            : ""}
        </div>
        <div className="text-center text-xl font-bold my-4">
          {!giftCardCode ||
          giftCardCode === "" ||
          giftCardPayment === "" ||
          parseFloat(giftCardPayment) === 0 ||
          !giftCard
            ? "..."
            : isNaN(parseFloat(giftCardPayment))
            ? "NUMBERS ONLY PLEASE"
            : parseFloat(giftCardPayment) > sale?.totalRemaining
            ? `PAYMENT TOO HIGH`
            : totalOwing < parseFloat(giftCardPayment)
            ? `NOT ENOUGH IN ACCOUNT`
            : parseFloat(giftCardPayment) < sale?.totalRemaining
            ? `AMOUNT SHORT BY $${(
                sale?.totalRemaining - parseFloat(giftCardPayment)
              )?.toFixed(2)}`
            : "ALL GOOD!"}
        </div>
      </>
    </Modal>
  );
}
