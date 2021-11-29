// Packages
import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import formatISO from "date-fns/formatISO";

// DB
import {
  useSaleItemsForSale,
  useSaleTransactionsForSale,
  useCustomers,
  useInventory,
  useLogs,
  useSales,
  useSaleItems,
} from "@/lib/swr-hooks";
import {
  clerkAtom,
  alertAtom,
  saleObjectAtom,
  loadedSaleIdAtom,
  viewAtom,
  pageAtom,
} from "@/lib/atoms";
import {
  ModalButton,
  CustomerObject,
  SaleItemObject,
  SaleObject,
  InventoryObject,
  SaleStateTypes,
} from "@/lib/types";

// Functions
import { getSaleVars, writeItemList } from "@/lib/data-functions";
import {
  saveLog,
  saveStockMovementToDatabase,
  updateSaleInDatabase,
  loadSaleToCart,
} from "@/lib/db-functions";

// Components
import SaleDetails from "./sale-details";
import SaleSummary from "./sale-summary";
import ScreenContainer from "@/components/_components/container/screen";
import RefundPaymentDialog from "./refund-payment-dialog";
import ReturnItemDialog from "./return-item-dialog";

// TODO add returns to sale items
// TODO refund dialog like PAY, refund with store credit, cash or card

export default function SaleItemScreen() {
  // Atoms
  const [loadedSaleId, setLoadedSaleId] = useAtom(loadedSaleIdAtom);
  const [clerk] = useAtom(clerkAtom);
  const [cart, setCart] = useAtom(saleObjectAtom);
  const [, setAlert] = useAtom(alertAtom);
  const [view, setView] = useAtom(viewAtom);
  const [page, setPage] = useAtom(pageAtom);

  // SWR
  const { customers } = useCustomers();
  const { inventory, mutateInventory } = useInventory();
  const { items, isSaleItemsLoading } = useSaleItemsForSale(loadedSaleId[page]);
  const {
    transactions,
    isSaleTransactionsLoading,
  } = useSaleTransactionsForSale(loadedSaleId[page]);
  const { sales, mutateSales } = useSales();
  const { saleItems, mutateSaleItems } = useSaleItems();
  const { logs, mutateLogs } = useLogs();

  // State
  // const [saleLoading, setSaleLoading] = useState(false);
  const [laybyLoading, setLaybyLoading] = useState(false);
  const [addMoreItemsLoading, setAddMoreItemsLoading] = useState(false);
  const [completeSaleLoading, setCompleteSaleLoading] = useState(false);
  const [parkSaleLoading, setParkSaleLoading] = useState(false);

  // State
  const [sale, setSale]: [SaleObject, Function] = useState({});
  const [tab, setTab] = useState(0);

  // Load
  useEffect(() => {
    console.log(loadedSaleId[page]);
    setSale(sales?.filter((s: SaleObject) => s?.id === loadedSaleId[page])[0]);
  }, [loadedSaleId[page], sales]);

  // TODO make sale info screen for LAYBY and SALES screen that needs to be activated to go to the SELL screen. So only one active sale will be present at a time.
  // BUG fix bug where close register screen appears (pressing TAB) - have fixed by just hiding sidebars and screens
  // BUG fix bug where bottom of dialog is visible
  // BUG dates are wrong on vercel
  // BUG why are some sales showing items as separate line items, not 2x quantity

  const itemList = writeItemList(inventory, items);
  const { totalRemaining, totalPrice } = getSaleVars(
    items,
    transactions,
    inventory
  );

  // Functions
  async function clickAddMoreItems() {
    setAddMoreItemsLoading(true);
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
    setAddMoreItemsLoading(false);
    setSale(null);
    setLoadedSaleId({ ...loadedSaleId, [page]: null });
    setView({ ...view, saleScreen: false });
    setPage("sell");
  }

  // Constants
  const buttons: ModalButton[] = [
    {
      type: "cancel",
      onClick: () => setSale(null),
      disabled: true || totalRemaining === 0,
      text: "CLOSE",
    },
    {
      type: "ok",
      onClick: clickAddMoreItems,
      disabled: sale?.state === SaleStateTypes.Layby || totalRemaining === 0,
      loading: addMoreItemsLoading,
      text: "LOAD SALE TO CART",
    },
  ];

  return (
    <>
      <ScreenContainer
        show={loadedSaleId[page]}
        closeFunction={() => setLoadedSaleId({ ...loadedSaleId, [page]: null })}
        title={`SALE #${sale?.id} [${
          sale?.state ? sale?.state.toUpperCase() : "IN PROGRESS"
        }]`}
        loading={isSaleItemsLoading || isSaleTransactionsLoading}
        buttons={sale?.state === SaleStateTypes.Completed ? null : buttons}
      >
        <div className="flex items-start overflow-auto w-full">
          <div className="w-2/3">
            <SaleSummary sale={sale} />
          </div>
          <div className="w-1/3 p-2 flex flex-col justify-between">
            <SaleDetails sale={sale} />
          </div>
        </div>
      </ScreenContainer>
      {view?.refundPaymentDialog && <RefundPaymentDialog sale={sale} />}
      {view?.returnItemDialog && <ReturnItemDialog sale={sale} />}
    </>
  );
}

// TODO fix parked sale bug, make it easier to delete parked sales
