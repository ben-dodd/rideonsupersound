// Packages
import dayjs from "dayjs";

// DB
import { useGiftCards, useVendorFromVendorPayment } from "@/lib/swr-hooks";
import {
  SaleTransactionObject,
  GiftCardObject,
  VendorObject,
  SaleObject,
  PaymentMethodTypes,
} from "@/lib/types";

// Functions

// Types
type TransactionListItemProps = {
  transaction: SaleTransactionObject;
  sale: SaleObject;
};

type UseVendorProps = {
  vendor: VendorObject;
};

export default function TransactionListItem({
  transaction,
}: TransactionListItemProps) {
  // SWR
  const { giftCards } = useGiftCards();
  const { vendor }: UseVendorProps = useVendorFromVendorPayment(
    transaction?.vendor_payment_id
  );

  const giftCard = giftCards?.filter(
    (g: GiftCardObject) => g?.id === transaction?.gift_card_id
  )[0];

  return (
    <div
      className={`flex justify-end items-center mt-2 mb-3 ${
        transaction?.is_deleted
          ? "line-through text-gray-400"
          : transaction?.is_refund
          ? "text-red-500"
          : "text-blue-500"
      }`}
    >
      <div className="w-1/2">
        {dayjs(transaction?.date).format("D MMMM YYYY, h:mm A")}
      </div>
      <div className="w-1/4">
        {(
          `${transaction?.payment_method}${
            transaction?.is_refund ? " REFUND" : ""
          }` || "OTHER"
        ).toUpperCase()}
      </div>
      <div className="w-1/4">
        <div className="text-right">
          $
          {(transaction?.is_refund
            ? transaction?.amount / -100
            : transaction?.amount / 100 || 0
          )?.toFixed(2)}
        </div>
        <div className="text-right text-xs">
          {transaction?.payment_method === PaymentMethodTypes.Cash
            ? transaction?.is_refund
              ? ""
              : transaction?.change_given
              ? `($${(transaction.change_given / 100)?.toFixed(2)} CHANGE)`
              : "(NO CHANGE)"
            : transaction?.payment_method === PaymentMethodTypes.Account
            ? `[${(
                vendor?.name ||
                transaction?.vendor?.name ||
                ""
              ).toUpperCase()}]`
            : transaction?.payment_method === PaymentMethodTypes.GiftCard
            ? transaction?.gift_card_taken
              ? transaction?.change_given
                ? `CARD TAKEN, $${(
                    transaction?.gift_card_change / 100
                  )?.toFixed(2)} CHANGE [${(
                    giftCard?.gift_card_code || ""
                  ).toUpperCase()}]`
                : `CARD TAKEN [${(
                    giftCard?.gift_card_code || ""
                  ).toUpperCase()}]`
              : `[${(
                  giftCard?.gift_card_code ||
                  transaction?.gift_card_update?.gift_card_code ||
                  ""
                ).toUpperCase()}]`
            : ""}
        </div>
      </div>
    </div>
  );
}
