// Packages
import { useAtom } from "jotai";
import { format, parseISO } from "date-fns";
import nz from "date-fns/locale/en-NZ";

// DB
import {
  useGiftCard,
  useVendorFromVendorPayment,
  useSaleTransactionsForSale,
  useLogs,
} from "@/lib/swr-hooks";
import { alertAtom, clerkAtom } from "@/lib/atoms";
import {
  SaleTransactionObject,
  GiftCardObject,
  VendorObject,
  SaleObject,
  PaymentMethodTypes,
} from "@/lib/types";

// Functions
import { deleteSaleTransactionFromDatabase, saveLog } from "@/lib/db-functions";

// Icons
import DeleteIcon from "@mui/icons-material/Delete";

// Types
type TransactionListItemProps = {
  transaction: SaleTransactionObject;
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
  // Atoms
  const [clerk] = useAtom(clerkAtom);
  const [, setAlert] = useAtom(alertAtom);

  // SWR
  const { giftCard }: UseGiftCardProps = useGiftCard(transaction?.gift_card_id);
  const { vendor }: UseVendorProps = useVendorFromVendorPayment(
    transaction?.vendor_payment_id
  );
  const { transactions, mutateSaleTransactions } = useSaleTransactionsForSale(
    sale?.id
  );
  const { logs, mutateLogs } = useLogs();

  // Functions
  const onClickDelete = () => {
    // Delete transaction item from cart
    deleteSaleTransactionFromDatabase(
      transaction?.id,
      transactions,
      mutateSaleTransactions
    );
    saveLog(
      {
        log: `$${(transaction?.amount / 100)?.toFixed(2)} ${
          transaction?.payment_method
        } transaction deleted.`,
        clerk_id: clerk?.id,
        table_id: "sale_transaction",
        row_id: transaction?.id,
      },
      logs,
      mutateLogs
    );
    setAlert({
      open: true,
      type: "success",
      message: `$${(transaction?.amount / 100)?.toFixed(
        2
      )} ${transaction?.payment_method?.toUpperCase()} PAYMENT DELETED`,
    });
  };

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
            onClick={onClickDelete}
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
          ${(transaction?.amount / 100 || 0)?.toFixed(2)}
        </div>
        <div className="text-right text-xs">
          {transaction?.payment_method === PaymentMethodTypes.Cash
            ? transaction?.change_given
              ? `($${(transaction.change_given / 100)?.toFixed(2)} CHANGE)`
              : "(NO CHANGE)"
            : transaction?.payment_method === PaymentMethodTypes.Account
            ? `[${(vendor?.name || "").toUpperCase()}]`
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
              : `[${(giftCard?.gift_card_code || "").toUpperCase()}]`
            : ""}
        </div>
      </div>
    </div>
  );
}

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
