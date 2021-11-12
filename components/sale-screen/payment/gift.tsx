// Packages
import { useState, useMemo } from "react";
import { useAtom } from "jotai";

// DB
import {
  useSaleTransactionsForSale,
  useSaleItemsForSale,
  useGiftCards,
  useLogs,
  useCustomers,
  useRegisterID,
  useSaleInventory,
} from "@/lib/swr-hooks";
import {
  viewAtom,
  newSaleObjectAtom,
  loadedSaleObjectAtom,
  clerkAtom,
  alertAtom,
} from "@/lib/atoms";
import {
  GiftCardObject,
  ModalButton,
  CustomerObject,
  SaleTransactionObject,
} from "@/lib/types";

// Functions
import { getSaleVars } from "@/lib/data-functions";
import {
  saveSaleTransaction,
  saveLog,
  updateStockItemInDatabase,
} from "@/lib/db-functions";

// Components
import Modal from "@/components/container/modal";
import TextField from "@/components/inputs/text-field";

export default function Gift({ isNew }) {
  // Atoms
  const [clerk] = useAtom(clerkAtom);
  const [view, setView] = useAtom(viewAtom);
  const [sale] = useAtom(isNew ? newSaleObjectAtom : loadedSaleObjectAtom);
  const [, setAlert] = useAtom(alertAtom);

  // SWR
  const { giftCards, mutateGiftCards } = useGiftCards();
  const { customers } = useCustomers();
  const { transactions, mutateSaleTransactions } = useSaleTransactionsForSale(
    sale?.id
  );
  const { items } = useSaleItemsForSale(sale?.id);
  const { logs, mutateLogs } = useLogs();
  const { registerID } = useRegisterID();
  const { saleInventory } = useSaleInventory();

  const { totalRemaining } = getSaleVars(items, transactions, saleInventory);

  // State
  const [giftCardPayment, setGiftCardPayment] = useState(`${totalRemaining}`);
  const [giftCardCode, setGiftCardCode] = useState("");
  const giftCard: GiftCardObject = useMemo(
    () =>
      giftCards?.filter(
        (giftCard: GiftCardObject) =>
          giftCard?.gift_card_code === giftCardCode.toUpperCase()
      )[0],
    [giftCardCode, giftCards]
  );
  const [submitting, setSubmitting] = useState(false);

  // Constants
  const remainingOnGiftCard = giftCard?.gift_card_remaining / 100;
  const leftOver: number = remainingOnGiftCard - parseFloat(giftCardPayment);

  // TODO handle take gift card and give change
  const buttons: ModalButton[] = [
    {
      type: "ok",
      disabled:
        submitting ||
        parseFloat(giftCardPayment) > totalRemaining ||
        totalRemaining < parseFloat(giftCardPayment) ||
        parseFloat(giftCardPayment) === 0 ||
        giftCardPayment <= "" ||
        isNaN(parseFloat(giftCardPayment)) ||
        !giftCard ||
        !giftCard?.gift_card_is_valid ||
        leftOver < 0,
      loading: submitting,
      onClick: async () => {
        setSubmitting(true);
        let giftCardUpdate: GiftCardObject = { ...giftCard };
        giftCardUpdate.gift_card_remaining = leftOver * 100;
        if (leftOver < 10) {
          giftCardUpdate.gift_card_is_valid = false;
          giftCardUpdate.gift_card_remaining = 0;
        }
        updateStockItemInDatabase(giftCardUpdate);
        const otherGiftCards = giftCards?.filter(
          (g: GiftCardObject) => g?.id !== giftCard?.id
        );
        mutateGiftCards([...otherGiftCards, giftCardUpdate], false);
        // TODO gift card taken and gift card change given should be in transaction object
        // TODO make save sale transaction a cleaner function, bundle transaction into object
        let transaction: SaleTransactionObject = {
          sale_id: sale?.id,
          clerk_id: clerk?.id,
          payment_method: "acct",
          amount:
            parseFloat(giftCardPayment) >= totalRemaining
              ? totalRemaining * 100
              : parseFloat(giftCardPayment) * 100,
          register_id: registerID,
          gift_card_id: giftCardUpdate?.id,
          gift_card_taken: giftCardUpdate?.gift_card_is_valid,
          gift_card_remaining: giftCardUpdate?.gift_card_remaining,
          gift_card_change: leftOver < 10 ? leftOver * 100 : 0,
        };
        const id = await saveSaleTransaction(
          transaction,
          transactions,
          mutateSaleTransactions
        );
        setSubmitting(false);
        setView({ ...view, giftPaymentDialog: false });
        saveLog(
          {
            log: `$${parseFloat(giftCardPayment)?.toFixed(
              2
            )} gift card payment from ${
              sale?.customer_id
                ? customers?.filter(
                    (c: CustomerObject) => c?.id === sale?.customer_id
                  )[0]?.name
                : "customer"
            } (sale #${sale?.id}). Gift card #${giftCardCode?.toUpperCase()}. ${
              leftOver < 10
                ? `Card taken.${
                    leftOver > 0
                      ? ` $${leftOver?.toFixed(
                          2
                        )} change given for remainder on card.`
                      : ""
                  }`
                : `$${remainingOnGiftCard?.toFixed(2)} remaining on card.`
            }`,
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
          message: `$${parseFloat(giftCardPayment)?.toFixed(
            2
          )} GIFT CARD PAYMENT`,
        });
      },
      text: "COMPLETE",
    },
  ];
  // BUG gift card props change when submit clicked

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
          totalRemaining || 0
        )?.toFixed(2)}`}</div>
        <div className="text-center font-bold">
          {!giftCardCode || giftCardCode === ""
            ? "ENTER GIFT CARD CODE"
            : !giftCard
            ? "INVALID GIFT CARD CODE"
            : `$${remainingOnGiftCard?.toFixed(2)} LEFT ON CARD`}
        </div>
        <div className="text-center text-xl font-bold my-4">
          {!giftCardCode ||
          giftCardCode === "" ||
          giftCardPayment === "" ||
          parseFloat(giftCardPayment) === 0 ||
          !giftCard ? (
            <div>...</div>
          ) : isNaN(parseFloat(giftCardPayment)) ? (
            <div>NUMBERS ONLY PLEASE</div>
          ) : parseFloat(giftCardPayment) > totalRemaining ? (
            <div>PAYMENT TOO HIGH</div>
          ) : !giftCard?.gift_card_is_valid ? (
            <div>GIFT CARD IS NOT VALID</div>
          ) : remainingOnGiftCard < parseFloat(giftCardPayment) ? (
            <div>NOT ENOUGH ON CARD</div>
          ) : leftOver >= 10 ? (
            <div>{`$${leftOver.toFixed(2)} REMAINING ON CARD`}</div>
          ) : leftOver === 0 ? (
            <div>CARD USED UP, TAKE CARD</div>
          ) : leftOver < 10 ? (
            <div>{`TAKE CARD AND GIVE $${leftOver.toFixed(2)} IN CHANGE`}</div>
          ) : (
            <div />
          )}
        </div>
      </>
    </Modal>
  );
}
