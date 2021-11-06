// DB
import { useClerks } from "@/lib/swr-hooks";
import { SaleTransactionObject, ClerkObject } from "@/lib/types";

// Functions
import { fTimeDate } from "@/lib/data-functions";

// Types
interface CashItemProps {
  transaction: SaleTransactionObject;
  field?: string;
  negative?: boolean;
}

export default function CashItem({
  transaction,
  field,
  negative,
}: CashItemProps) {
  // SWR
  const { clerks } = useClerks();

  // Constants
  const transactionBy = (clerks || []).filter(
    (c: ClerkObject) => c?.id === transaction?.clerk_id
  )[0]?.name;
  const date = fTimeDate(transaction?.date);

  // REVIEW Add more info to cash items, possibly add receipt pop up info dialog
  const value = transaction[field || "amount"];

  return (
    <>
      <div className="flex justify-between text-sm">
        <div
          className={
            value < 0
              ? negative
                ? "text-secondary"
                : "text-tertiary"
              : negative
              ? "text-tertiary"
              : "text-secondary"
          }
        >{`${
          value < 0 ? (negative ? "+" : "-") : negative ? "-" : "+"
        } $${Math.abs(value / 100)?.toFixed(2)}`}</div>
        <div>{`${transactionBy} (${date})`}</div>
      </div>
      {/*transaction?.note && <div className="text-xs">{transaction?.note}</div>*/}
    </>
  );
}
