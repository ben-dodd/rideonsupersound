// DB
import { useClerks } from "@/lib/swr-hooks";
import { SaleTransactionObject, ClerkObject } from "@/lib/types";

// Functions
import { fTimeDate } from "@/lib/data-functions";

// Types
interface CashItemProps {
  transaction: SaleTransactionObject;
  negative?: boolean;
}

export default function CashItem({ transaction, negative }: CashItemProps) {
  // SWR
  const { clerks } = useClerks();

  // Constants
  const transactionBy = (clerks || []).filter(
    (c: ClerkObject) => c?.id === transaction?.clerk_id
  )[0]?.name;
  const date = fTimeDate(transaction?.date);

  // TODO Add more info to cash items, possibly add receipt pop up info dialog

  return (
    <>
      <div className="flex justify-between text-sm">
        <div
          className={
            transaction?.amount < 0
              ? negative
                ? "text-secondary"
                : "text-tertiary"
              : negative
              ? "text-tertiary"
              : "text-secondary"
          }
        >{`${
          transaction?.amount < 0
            ? negative
              ? "+"
              : "-"
            : negative
            ? "-"
            : "+"
        } $${Math.abs(transaction?.amount / 100)?.toFixed(2)}`}</div>
        <div>{`${transactionBy} (${date})`}</div>
      </div>
      {/*transaction?.note && <div className="text-xs">{transaction?.note}</div>*/}
    </>
  );
}
