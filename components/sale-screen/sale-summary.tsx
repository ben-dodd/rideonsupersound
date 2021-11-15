// Packages
import { useAtom } from "jotai";
import { format, parseISO } from "date-fns";
import nz from "date-fns/locale/en-NZ";

// DB
import {
  useCustomer,
  useClerks,
  useSaleItemsForSale,
  useSaleTransactionsForSale,
  useStockInventory,
} from "@/lib/swr-hooks";
import { newSaleObjectAtom, loadedSaleObjectAtom } from "@/lib/atoms";
import {
  SaleTransactionObject,
  SaleItemObject,
  SaleStateTypes,
} from "@/lib/types";

// Functions
import {
  convertMPStoKPH,
  convertDegToCardinal,
  getSaleVars,
} from "@/lib/data-functions";

// Components
import ItemListItem from "./item-list-item";
import TransactionListItem from "./transaction-list-item";

export default function SaleSummary({ isNew }) {
  // Atoms
  const [sale] = useAtom(isNew ? newSaleObjectAtom : loadedSaleObjectAtom);

  // SWR
  const { clerks } = useClerks();
  const { customer } = useCustomer(sale?.customer_id);
  const { items } = useSaleItemsForSale(sale?.id);
  const { transactions } = useSaleTransactionsForSale(sale?.id);
  const { inventory } = useStockInventory();

  // Constants
  const saleComplete = Boolean(sale?.state === SaleStateTypes.Completed);
  const {
    totalRemaining,
    totalStoreCut,
    totalVendorCut,
    totalPrice,
  } = getSaleVars(items, transactions, inventory);

  // Functions
  function SaleItems() {
    return (
      <div className="h-1/3 overflow-y-scroll">
        {items?.length > 0 ? (
          items?.map((saleItem: SaleItemObject) => (
            <ItemListItem
              key={saleItem?.item_id}
              saleItem={saleItem}
              isNew={isNew}
            />
          ))
        ) : (
          <div>No items in cart...</div>
        )}
      </div>
    );
  }

  function SaleDetails() {
    return (
      <div className="h-1/3">
        <div className="flex justify-end mt-2 pt-2 border-t border-gray-500">
          <div>VENDOR CUT</div>
          <div
            className={`text-right w-2/12 text-gray-600 ${
              totalVendorCut < 0 && "text-red-400"
            }`}
          >
            {`$${totalVendorCut?.toFixed(2)}`}
          </div>
        </div>
        <div className="flex justify-end border-gray-500">
          <div>STORE CUT</div>
          <div
            className={`text-right w-2/12 text-gray-600 ${
              totalStoreCut < 0 && "text-tertiary-dark"
            }`}
          >
            {`$${totalStoreCut?.toFixed(2)}`}
          </div>
        </div>
        <div className="flex justify-end mt-1">
          <div>TOTAL</div>
          <div className="text-right w-2/12 font-bold">
            ${totalPrice !== null ? totalPrice?.toFixed(2) : "0.00"}
          </div>
        </div>
        <div className="flex justify-end mt-1">
          <div>TOTAL PAID</div>
          <div className="text-right w-2/12 font-bold text-secondary-dark">
            ${(totalPrice - totalRemaining)?.toFixed(2)}
          </div>
        </div>
        <div className="flex justify-end mt-1">
          <div>TOTAL OWING</div>
          <div className="text-right w-2/12 font-bold text-tertiary-dark">
            ${totalRemaining?.toFixed(2)}
          </div>
        </div>
      </div>
    );
  }

  function TransactionItems() {
    return (
      <div className="h-1/3 mt-1 pt-1 border-t border-gray-500 overflow-y-scroll">
        {transactions?.map((transaction: SaleTransactionObject) => (
          <TransactionListItem
            key={transaction?.id}
            sale={sale}
            transaction={transaction}
            // let transactions = {
            //   ...get(saleDialog, "transactions", {}),
            //   [id]: { ...payment, deleted: doDelete },
            // };
            // dispatch(
            //   updateLocal("sale", {
            //     transactions,
            //   })
            // );
            // dispatch(
            //   updateDialog("sale", {
            //     transactions,
            //   })
            // );
            // if (payment.type === "GIFT")
            //   returnMoneyToGiftCard({ payment, giftCards, dispatch });
            // else if (payment.type === "ACCT")
            //   returnMoneyToAccount({ payment, customerVendor, dispatch });
            // }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col justify-start h-dialoglg bg-gray-100 p-4 rounded-md`}
    >
      <SaleItems />
      <SaleDetails />
      <TransactionItems />
    </div>
  );
}
