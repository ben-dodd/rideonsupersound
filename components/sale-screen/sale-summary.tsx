// DB
import { useInventory } from "@/lib/swr-hooks";
import { SaleTransactionObject, SaleItemObject } from "@/lib/types";

// Functions
import { getSaleVars } from "@/lib/data-functions";

// Components
import ItemListItem from "./item-list-item";
import TransactionListItem from "./transaction-list-item";
import dayjs from "dayjs";

export default function SaleSummary({ sale }) {
  // SWR
  const { inventory } = useInventory();

  // Constants
  const {
    totalRemaining,
    totalStoreCut,
    totalVendorCut,
    totalPrice,
    totalPaid,
    totalPostage,
  } = getSaleVars(sale, inventory);

  // Functions
  function SaleItems() {
    return (
      <div className={`h-2/5 overflow-y-scroll`}>
        {sale?.items?.length > 0 ? (
          sale?.items?.map((saleItem: SaleItemObject) => (
            <ItemListItem key={saleItem?.item_id} saleItem={saleItem} />
          ))
        ) : (
          <div>No items in cart...</div>
        )}
      </div>
    );
  }

  function TransactionItems() {
    return (
      <div
        className={`h-1/5 overflow-y-scroll mt-1 pt-1 border-t border-gray-500 ${
          !sale?.transactions || (sale?.transactions?.length === 0 && " hidden")
        }`}
      >
        {sale?.transactions
          ?.sort(
            (transA: SaleTransactionObject, transB: SaleTransactionObject) => {
              const a = dayjs(transA?.date);
              const b = dayjs(transB?.date);
              return a > b ? 1 : b > a ? -1 : 0;
            }
          )
          ?.map((transaction: SaleTransactionObject) => (
            <TransactionListItem
              key={transaction?.id}
              sale={sale}
              transaction={transaction}
            />
          ))}
      </div>
    );
  }
  function SaleDetails() {
    return (
      <div className="h-2/5 overflow-y-scroll">
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
        <div className="flex justify-end border-gray-500">
          <div>POSTAGE</div>
          <div
            className={`text-right w-2/12 text-gray-600 ${
              totalPostage < 0 && "text-tertiary-dark"
            }`}
          >
            {`$${totalPostage?.toFixed(2)}`}
          </div>
        </div>
        <div className="flex justify-end mt-1">
          <div>TOTAL</div>
          <div className="text-right w-2/12 font-bold">
            ${totalPrice?.toFixed(2)}
          </div>
        </div>
        <div className="flex justify-end mt-1">
          <div>TOTAL PAID</div>
          <div className="text-right w-2/12 font-bold text-secondary-dark">
            ${totalPaid?.toFixed(2)}
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

  return (
    <div
      className={`flex flex-col justify-start h-dialoglg bg-gray-100 p-4 rounded-md`}
    >
      <SaleItems />
      <TransactionItems />
      <SaleDetails />
    </div>
  );
}
