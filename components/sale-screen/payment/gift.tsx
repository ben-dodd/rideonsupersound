import { useState, useMemo } from "react";
import Modal from "@/components/container/modal";
import { useAtom } from "jotai";
import { paymentDialogAtom, cartAtom, saleAtom, clerkAtom } from "@/lib/atoms";
import { GiftCardObject } from "@/lib/types";
import TextField from "@/components/inputs/text-field";
import {
  useSaleTransactionsForSale,
  useGiftCards,
  useVendorTotalPayments,
  useVendorTotalSales,
  useVendorFromContact,
} from "@/lib/swr-hooks";
import { getTotalOwing } from "@/lib/data-functions";
import { saveSaleTransaction } from "@/lib/db-functions";
import { ModalButton } from "@/lib/types";

export default function Gift({ isCart }) {
  const [clerk] = useAtom(clerkAtom);
  const [paymentDialog, setPaymentDialog] = useAtom(paymentDialogAtom);
  const [cart, setCart] = useAtom(isCart ? cartAtom : saleAtom);
  const { giftCards } = useGiftCards();
  const { vendor } = useVendorFromContact(cart?.contact_id);
  const { totalPayments } = useVendorTotalPayments(cart?.contact_id);
  const { totalSales } = useVendorTotalSales(cart?.contact_id);
  const { mutateSaleTransactions } = useSaleTransactionsForSale(cart?.id);
  const totalOwing = useMemo(
    () =>
      totalPayments && totalSales
        ? getTotalOwing(totalPayments, totalSales) / 100
        : 0,
    [totalPayments, totalSales]
  );
  const [giftCardPayment, setGiftCardPayment] = useState(
    `${paymentDialog?.remainingBalance}`
  );
  const [giftCardCode, setGiftCardCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const giftCard = useMemo(
    () =>
      giftCards &&
      giftCards.filter(
        (giftCard: GiftCardObject) =>
          giftCard?.code === giftCardCode.toUpperCase()
      )[0],
    [giftCardCode, giftCards]
  );

  const buttons: ModalButton[] = [
    {
      type: "ok",
      disabled:
        submitting ||
        parseFloat(giftCardPayment) > paymentDialog?.remainingBalance ||
        totalOwing < parseFloat(giftCardPayment) ||
        parseFloat(giftCardPayment) === 0 ||
        giftCardPayment <= "" ||
        isNaN(parseFloat(giftCardPayment)),
      onClick: async () => {
        setSubmitting(true);
        await saveSaleTransaction(
          cart,
          clerk,
          giftCardPayment,
          paymentDialog?.remainingBalance,
          "acct",
          mutateSaleTransactions,
          setCart,
          vendor
        );
        setSubmitting(false);
        setPaymentDialog(null);
      },
      text: "COMPLETE",
    },
  ];
  return (
    <Modal
      open={paymentDialog?.method === "gift"}
      closeFunction={() => setPaymentDialog(null)}
      title={"GIFT CARD PAYMENT"}
      buttons={buttons}
    >
      <>
        <TextField
          divClass="text-8xl"
          inputClass="text-center text-red-800 font-mono uppercase"
          value={giftCardCode}
          autoFocus
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
          paymentDialog?.remainingBalance || 0
        ).toFixed(2)}`}</div>
        <div className="text-center font-bold">
          {!giftCardCode || giftCardCode === ""
            ? "ENTER GIFT CARD CODE"
            : !giftCard
            ? "INVALID GIFT CARD CODE"
            : giftCard?.amount_remaining > 0
            ? `$${giftCard?.amount_remaining.toFixed(2)} ON CARD`
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
            : parseFloat(giftCardPayment) > paymentDialog?.remainingBalance
            ? `PAYMENT TOO HIGH`
            : totalOwing < parseFloat(giftCardPayment)
            ? `NOT ENOUGH IN ACCOUNT`
            : parseFloat(giftCardPayment) < paymentDialog?.remainingBalance
            ? `AMOUNT SHORT BY $${(
                paymentDialog?.remainingBalance - parseFloat(giftCardPayment)
              ).toFixed(2)}`
            : "ALL GOOD!"}
        </div>
      </>
    </Modal>
  );
}
