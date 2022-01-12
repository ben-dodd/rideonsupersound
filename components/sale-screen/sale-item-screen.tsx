// Packages
import { useState, useEffect, useCallback } from "react";
import { useAtom } from "jotai";

// DB
import {
  useSaleItemsForSale,
  useSaleTransactionsForSale,
  useCustomers,
  useInventory,
  useLogs,
  useSales,
  useGiftCards,
  useRegisterID,
} from "@/lib/swr-hooks";
import {
  clerkAtom,
  alertAtom,
  cartAtom,
  loadedSaleIdAtom,
  viewAtom,
  pageAtom,
} from "@/lib/atoms";
import {
  ModalButton,
  SaleItemObject,
  SaleObject,
  SaleStateTypes,
} from "@/lib/types";

// Functions
import { getSaleVars } from "@/lib/data-functions";
import { loadSaleToCart } from "@/lib/db-functions";

// Components
import SaleDetails from "./sale-details";
import SaleSummary from "./sale-summary";
import ScreenContainer from "@/components/_components/container/screen";
import ReturnItemsDialog from "./return-item-dialog";

// TODO add returns to sale items
// TODO refund dialog like PAY, refund with store credit, cash or card

export default function SaleItemScreen() {
  // Atoms
  const [loadedSaleId, setLoadedSaleId] = useAtom(loadedSaleIdAtom);
  const [clerk] = useAtom(clerkAtom);
  const [cart, setCart] = useAtom(cartAtom);
  const [, setAlert] = useAtom(alertAtom);
  const [view, setView] = useAtom(viewAtom);
  const [page, setPage] = useAtom(pageAtom);

  // SWR
  const { customers } = useCustomers();
  const { inventory, mutateInventory } = useInventory();
  const { giftCards, mutateGiftCards } = useGiftCards();
  const { items, isSaleItemsLoading } = useSaleItemsForSale(loadedSaleId[page]);
  const { transactions, isSaleTransactionsLoading } =
    useSaleTransactionsForSale(loadedSaleId[page]);
  const { sales, mutateSales } = useSales();
  const { logs, mutateLogs } = useLogs();
  const { registerID } = useRegisterID();

  // State
  const [saleLoading, setSaleLoading] = useState(false);
  const [loadToCartLoading, setLoadToCartLoading] = useState(false);

  // State
  const [sale, setSale]: [SaleObject, Function] = useState({});

  // Load
  useEffect(() => {
    setSaleLoading(true);
    if (!isSaleItemsLoading && !isSaleTransactionsLoading) {
      let loadedSale =
        sales?.filter((s: SaleObject) => s?.id === loadedSaleId[page])[0] || {};
      loadedSale.items = items;
      loadedSale.transactions = transactions;
      console.log(loadedSale);
      setSale(loadedSale);
      setSaleLoading(false);
    }
  }, [loadedSaleId[page], isSaleItemsLoading, isSaleTransactionsLoading]);

  // TODO make sale info screen for LAYBY and SALES screen that needs to be activated to go to the SELL screen. So only one active sale will be present at a time.
  // BUG fix bug where close register screen appears (pressing TAB) - have fixed by just hiding sidebars and screens
  // BUG fix bug where bottom of dialog is visible
  // BUG dates are wrong on vercel
  // BUG why are some sales showing items as separate line items, not 2x quantity

  const { totalRemaining } = getSaleVars(sale, inventory);

  // Functions
  async function loadSale() {
    setLoadToCartLoading(true);
    await loadSaleToCart(
      cart,
      setCart,
      sale,
      clerk,
      registerID,
      customers,
      logs,
      mutateLogs,
      sales,
      mutateSales,
      inventory,
      mutateInventory,
      giftCards,
      mutateGiftCards
    );
    setLoadToCartLoading(false);
    setSale(null);
    setLoadedSaleId({ ...loadedSaleId, [page]: null });
    setView({ ...view, saleScreen: true });
    setPage("sell");
  }

  // Constants
  const buttons: ModalButton[] = [
    {
      type: "ok",
      onClick: loadSale,
      loading: loadToCartLoading,
      text: totalRemaining === 0 ? "RETURN ITEMS" : "LOAD SALE TO CART",
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
        loading={saleLoading}
        buttons={
          sale?.items?.filter(
            (s: SaleItemObject) => !s?.is_refunded && !s?.is_deleted
          )?.length > 0
            ? buttons
            : null
        }
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
    </>
  );
}
