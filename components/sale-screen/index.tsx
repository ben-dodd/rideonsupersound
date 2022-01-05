// Packages
import { useState, useEffect } from "react";
import { useAtom } from "jotai";

// DB
import {
  useSaleItemsForSale,
  useSaleTransactionsForSale,
  useCustomers,
  useInventory,
  useLogs,
  useSales,
  useSaleItems,
  useGiftCards,
} from "@/lib/swr-hooks";
import {
  clerkAtom,
  alertAtom,
  cartAtom,
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
  saveSaleAndPark,
  saveLog,
  saveStockMovementToDatabase,
  updateSaleInDatabase,
  updateSaleItemInDatabase,
  validateGiftCard,
  loadSaleToCart,
  saveSaleItemsTransactionsToDatabase,
} from "@/lib/db-functions";

// Components
import Pay from "./pay";
import SaleSummary from "./sale-summary";
import Acct from "./payment/acct";
import Card from "./payment/card";
import Cash from "./payment/cash";
import Gift from "./payment/gift";
import ScreenContainer from "@/components/_components/container/screen";
import CreateCustomerSidebar from "@/components/customer/create-customer-sidebar";
import RefundPaymentDialog from "./refund-payment-dialog";
import ReturnItemDialog from "./return-item-dialog";
import dayjs from "dayjs";

// TODO add returns to sale items
// TODO refund dialog like PAY, refund with store credit, cash or card

export default function SaleScreen() {
  // Atoms
  const [cart, setCart] = useAtom(cartAtom);
  const [clerk] = useAtom(clerkAtom);
  const [, setAlert] = useAtom(alertAtom);
  const [view, setView] = useAtom(viewAtom);
  const [, setPage] = useAtom(pageAtom);

  // SWR
  const { customers } = useCustomers();
  const { inventory, mutateInventory } = useInventory();
  const { items, isSaleItemsLoading } = useSaleItemsForSale(cart?.id);
  const { isSaleTransactionsLoading } = useSaleTransactionsForSale(cart?.id);
  const { sales, mutateSales } = useSales();
  const { giftCards, mutateGiftCards } = useGiftCards();
  const { logs, mutateLogs } = useLogs();

  // State
  // const [saleLoading, setSaleLoading] = useState(false);
  const [laybyLoading, setLaybyLoading] = useState(false);
  const [addMoreItemsLoading, setAddMoreItemsLoading] = useState(false);
  const [completeSaleLoading, setCompleteSaleLoading] = useState(false);
  const [parkSaleLoading, setParkSaleLoading] = useState(false);
  // BUG fix bug where close register screen appears (pressing TAB) - have fixed by just hiding sidebars and screens
  // BUG fix bug where bottom of dialog is visible
  // BUG dates are wrong on vercel
  // BUG why are some sales showing items as separate line items, not 2x quantity

  const itemList = writeItemList(inventory, items);
  const { totalRemaining, totalPrice, numberOfItems } = getSaleVars(
    cart,
    inventory
  );

  // Functions
  async function clickParkSale() {
    setParkSaleLoading(true);
    saveSaleAndPark(
      cart,
      clerk,
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
    setAlert({
      open: true,
      type: "success",
      message: "SALE PARKED",
    });
    setCart(null);
    setView({ ...view, saleScreen: false });
    setParkSaleLoading(false);
  }

  async function clickLayby() {
    setLaybyLoading(true);
    let laybySale = { ...cart };
    if (cart?.state !== SaleStateTypes.Layby) {
      // If not already a layby in progress...
      // Change cart state to layby
      // date_layby_started
      // layby_started_by
      laybySale = {
        ...laybySale,
        state: SaleStateTypes.Layby,
        date_layby_started: "CURRENT_TIMESTAMP",
        layby_started_by: clerk?.id,
      };
      saveLog(
        {
          log: `Layby started${
            cart?.customer_id
              ? ` for ${
                  customers?.filter(
                    (c: CustomerObject) => c?.id === cart?.customer_id
                  )[0]?.name
                }`
              : ""
          } (${numberOfItems} item${
            numberOfItems === 1 ? "" : "s"
          } / $${totalPrice?.toFixed(2)} with $${totalRemaining?.toFixed(
            2
          )} left to pay).`,
          clerk_id: clerk?.id,
        },
        logs,
        mutateLogs
      );
      setAlert({
        open: true,
        type: "success",
        message: "LAYBY STARTED.",
      });
    }
    saveSaleItemsTransactionsToDatabase(
      laybySale,
      clerk,
      sales,
      mutateSales,
      inventory,
      mutateInventory,
      giftCards,
      mutateGiftCards,
      cart?.state
    );
    // close dialog
    setLaybyLoading(false);
    setView({ ...view, saleScreen: false });
    setCart(null);
  }

  async function clickCompleteSale() {
    setCompleteSaleLoading(true);
    // Update sale to 'complete', add date_sale_closed, sale_closed_by
    let completedSale = {
      ...cart,
      state: SaleStateTypes.Completed,
      sale_closed_by: clerk?.id,
      date_sale_closed: dayjs().format(),
    };

    console.log(completedSale);
    saveSaleItemsTransactionsToDatabase(
      completedSale,
      clerk,
      sales,
      mutateSales,
      inventory,
      mutateInventory,
      giftCards,
      mutateGiftCards,
      cart?.state
    );
    setCart(null);
    setView({ ...view, saleScreen: false });
    setCompleteSaleLoading(false);
    saveLog(
      {
        log: `Sale #${cart?.id} completed. ${itemList}.`,
        clerk_id: clerk?.id,
        table_id: "sale",
        row_id: cart?.id,
      },
      logs,
      mutateLogs
    );
    setAlert({
      open: true,
      type: "success",
      message: "SALE COMPLETED.",
    });
  }

  // Constants
  const buttons: ModalButton[] = [
    // REVIEW discard sale, do confirm dialog
    {
      type: "cancel",
      onClick: () => {
        setCart(null);
        setView({ ...view, saleScreen: false });
      },
      disabled: Boolean(cart?.transactions) || totalRemaining === 0,
      text:
        cart?.state === SaleStateTypes.Layby ? "CANCEL LAYBY" : "DISCARD SALE",
    },
    {
      type: "alt2",
      onClick: () => setView({ ...view, saleScreen: false }),
      disabled: totalRemaining === 0,
      loading: addMoreItemsLoading,
      text: "CHANGE ITEMS",
    },
    {
      type: "alt3",
      onClick: clickParkSale,
      disabled: cart?.state === SaleStateTypes.Layby || totalRemaining === 0,
      loading: parkSaleLoading,
      text: "PARK SALE",
    },
    {
      type: "alt1",
      onClick: clickLayby,
      disabled: laybyLoading || !cart?.customer_id || totalRemaining <= 0,
      loading: laybyLoading,
      text:
        cart?.state === SaleStateTypes.Layby ? "CONTINUE LAYBY" : "START LAYBY",
    },
    {
      type: "ok",
      onClick: clickCompleteSale,
      disabled:
        completeSaleLoading ||
        totalRemaining !== 0 ||
        cart?.state === SaleStateTypes.Completed,
      loading: completeSaleLoading,
      text: "COMPLETE SALE",
    },
  ];

  console.log(cart);

  return (
    <>
      <ScreenContainer
        show={view?.saleScreen}
        closeFunction={() => setView({ ...view, saleScreen: false })}
        title={`${cart?.id ? `SALE #${cart?.id}` : `NEW SALE`} [${
          cart?.state ? cart?.state.toUpperCase() : "IN PROGRESS"
        }]`}
        loading={isSaleItemsLoading || isSaleTransactionsLoading}
        buttons={cart?.state === SaleStateTypes.Completed ? null : buttons}
      >
        <div className="flex items-start overflow-auto w-full">
          <div className="w-2/3">
            <SaleSummary sale={cart} />
          </div>
          <div className="w-1/3 p-2 flex flex-col justify-between">
            <Pay />
            {/*<Action />*/}
          </div>
        </div>
      </ScreenContainer>
      {view?.acctPaymentDialog && <Acct />}
      {view?.cardPaymentDialog && <Card />}
      {view?.cashPaymentDialog && <Cash />}
      {view?.giftPaymentDialog && <Gift />}
      {view?.createCustomer && <CreateCustomerSidebar />}
      {view?.refundPaymentDialog && <RefundPaymentDialog sale={cart} />}
      {view?.returnItemDialog && <ReturnItemDialog sale={cart} />}
    </>
  );
}

// TODO fix parked sale bug, make it easier to delete parked sales

// hidden sm:flex items-start overflow-auto

// <div className="sm:hidden flex flex-col justify-between px-2">
//   <Pay />
//   <SaleSummary />
//   <Action />
// </div>
