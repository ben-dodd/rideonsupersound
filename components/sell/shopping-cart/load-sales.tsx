// Packages
import { useState } from "react";
import { useAtom } from "jotai";

// DB
import {
  useSales,
  useSaleItems,
  useLogs,
  useRegisterID,
  useCustomers,
  useStockInventory,
} from "@/lib/swr-hooks";
import { viewAtom, clerkAtom, alertAtom, newSaleObjectAtom } from "@/lib/atoms";
import {
  SaleObject,
  SaleItemObject,
  CustomerObject,
  SaleStateTypes,
} from "@/lib/types";

// Functions
import { fDateTime, nzDate, writeItemList } from "@/lib/data-functions";
import { loadSaleToCart } from "@/lib/db-functions";

// Components
import Modal from "@/components/container/modal";

export default function LoadSales() {
  // Atoms
  const [clerk] = useAtom(clerkAtom);
  const [view, setView] = useAtom(viewAtom);
  const [cart, setCart] = useAtom(newSaleObjectAtom);
  const [, setAlert] = useAtom(alertAtom);

  // SWR
  const { registerID } = useRegisterID();
  const { logs, mutateLogs } = useLogs();
  const { sales, isSalesLoading, mutateSales } = useSales();
  const { saleItems, isSaleItemsLoading, mutateSaleItems } = useSaleItems();
  const { customers, isCustomersLoading } = useCustomers();
  const { inventory, isInventoryLoading } = useStockInventory();

  // State
  const [submitting, setSubmitting] = useState(false);

  // Constants
  const parkedSales = sales?.filter(
    (s: SaleObject) =>
      s?.state !== SaleStateTypes.Completed && s?.id !== cart?.id
  );

  // Functions
  async function loadSale(sale: SaleObject, items: SaleItemObject[]) {
    setSubmitting(true);
    await loadSaleToCart(
      cart,
      items,
      setCart,
      sale,
      clerk,
      customers,
      logs,
      mutateLogs,
      sales,
      mutateSales,
      saleItems,
      mutateSaleItems
    );
    setSubmitting(false);
    setView({ ...view, loadSalesDialog: false });
  }

  return (
    <Modal
      open={view?.loadSalesDialog}
      closeFunction={() => setView({ ...view, loadSalesDialog: false })}
      title={"PARKED SALES AND LAYBYS"}
      loading={
        isSalesLoading ||
        isSaleItemsLoading ||
        isCustomersLoading ||
        submitting ||
        isInventoryLoading
      }
      width="max-w-6xl"
    >
      {parkedSales?.length > 0 ? (
        <div className="flex flex-col overflow-y-auto max-h-dialog">
          {parkedSales?.map((s: SaleObject, i: number) => {
            const items = saleItems?.filter(
              (i: SaleItemObject) => i?.sale_id === s?.id
            );
            return (
              <div
                key={i}
                className="flex p-4 my-2 cursor-pointer hover:bg-gray-100"
                onClick={() => loadSale(s, items)}
              >
                <div className="font-bold w-1/12">#{s?.id}</div>
                <div className="w-1/12">{s?.state}</div>
                <div className="w-3/12">
                  {fDateTime(nzDate(s?.date_sale_opened))}
                </div>
                <div className="w-3/12">
                  {customers?.filter(
                    (c: CustomerObject) => c?.id === s?.customer_id
                  )[0]?.name || ""}
                </div>
                <div className="w-2/6">{writeItemList(inventory, items)}</div>
              </div>
            );
          })}
        </div>
      ) : (
        <div>No parked sales or laybys.</div>
      )}
    </Modal>
  );
}
