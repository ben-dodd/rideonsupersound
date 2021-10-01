import {
  TransactionObject,
  GiftCardObject,
  VendorObject,
  SaleObject,
} from "@/lib/types";
import {
  useGiftCard,
  useVendorFromVendorPayment,
  useSaleTransactions,
} from "@/lib/swr-hooks";
import { deleteSaleTransactionFromDatabase } from "@/lib/db-functions";
import { format, parseISO } from "date-fns";
import nz from "date-fns/locale/en-NZ";
import DeleteIcon from "@material-ui/icons/Delete";

type TransactionListItemProps = {
  transaction: TransactionObject;
  sale: SaleObject;
};

type UseGiftCardProps = {
  giftCard: GiftCardObject;
};

type UseVendorProps = {
  vendor: VendorObject;
};

export default function TransactionListItem({
  transaction,
  sale,
}: TransactionListItemProps) {
  const { giftCard }: UseGiftCardProps = useGiftCard(transaction?.gift_card_id);
  const { vendor }: UseVendorProps = useVendorFromVendorPayment(
    transaction?.vendor_payment_id
  );
  const onClickDelete = () => {
    // Delete transaction item from cart
  };
  // const { mutateSaleTransactions } = useSaleTransactions(sale?.id);
  // const onClickDelete = () => {
  //   deleteSaleTransactionFromDatabase(transaction?.id, mutateSaleTransactions);
  // };
  return (
    <div
      className={`flex justify-end items-center mt-2 mb-3 ${
        transaction?.is_deleted && "line-through text-gray-400"
      }`}
    >
      <div className="w-2/12">
        {transaction?.is_deleted ? (
          <div />
        ) : (
          <button
            className="bg-gray-200 hover:bg-gray-300 p-1 w-10 h-10 rounded-full mr-8"
            onClick={
              onClickDelete
              // dispatch(
              //   openDialog("confirm", {
              //     title: `Delete Transaction`,
              //     message: `Are you sure you want to delete this transaction? This action cannot be reversed.`,
              //     yesText: "YES",
              //     action: () => {
              //       addLog(
              //         `Transaction [${payment.id}] deleted.`,
              //         "sales",
              //         sale.uid,
              //         currentStaff
              //       );
              //       updateData({
              //         dispatch,
              //         collection: "sale",
              //         doc: `${sale.uid}`,
              //         update: {
              //           ...sale,
              //           transactions: {
              //             ...get(sale, "transactions", {}),
              //             [payment.id]: { ...payment, deleted: true },
              //           },
              //         },
              //       });
              //       onDelete && onDelete(true);
              //       dispatch(closeDialog("confirm"));
              //       dispatch(
              //         setAlert({
              //           type: "warning",
              //           message: `TRANSACTION DELETED`,
              //           undo: () => {
              //             addLog(
              //               `Undo transaction [${payment.id}] delete.`,
              //               "sales",
              //               sale.uid,
              //               currentStaff
              //             );
              //             updateData({
              //               dispatch,
              //               collection: "sale",
              //               doc: `${sale.uid}`,
              //               update: {
              //                 ...sale,
              //                 transactions: {
              //                   ...get(sale, "transactions", {}),
              //                   [payment.id]: { ...payment, deleted: true },
              //                 },
              //               },
              //             });
              //             onDelete && onDelete(false);
              //             dispatch(closeAlert());
              //           },
              //         })
              //       );
              //     },
              //   })
              // )
            }
          >
            <DeleteIcon />
          </button>
        )}
      </div>
      <div className="w-4/12">
        {format(parseISO(transaction?.date), "d MMMM yyyy, p", { locale: nz })}
      </div>
      <div className="w-3/12 text-right">
        {(transaction?.payment_method || "OTHER").toUpperCase()}
      </div>
      <div className="w-3/12">
        <div className="text-right">
          ${(transaction?.total_amount / 100 || 0).toFixed(2)}
        </div>
        <div className="text-right text-xs">
          {transaction?.payment_method === "cash"
            ? transaction?.change_given
              ? `($${transaction.change_given.toFixed(2)} CHANGE)`
              : "(NO CHANGE)"
            : transaction?.payment_method === "acct"
            ? `[${(vendor?.name || "").toUpperCase()}]`
            : transaction?.payment_method === "gift"
            ? transaction?.card_taken
              ? transaction?.change_given
                ? `CARD TAKEN, $${(transaction.change_given / 100).toFixed(
                    2
                  )} CHANGE [${(giftCard?.code || "").toUpperCase()}]`
                : `CARD TAKEN [${(giftCard?.code || "").toUpperCase()}]`
              : `[${(giftCard?.code || "").toUpperCase()}]`
            : ""}
        </div>
      </div>
    </div>
  );
}
