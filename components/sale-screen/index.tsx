// Packages
import { useState } from "react";
import { useAtom } from "jotai";

// DB
import {
  useSaleItemsForSale,
  useSaleTransactionsForSale,
  useCustomers,
  useSaleInventory,
  useStockInventory,
  useLogs,
  useVendorTotalSales,
  useVendorTotalPayments,
  useSales,
} from "@/lib/swr-hooks";
import {
  clerkAtom,
  alertAtom,
  loadedSaleObjectAtom,
  newSaleObjectAtom,
  viewAtom,
} from "@/lib/atoms";
import {
  ModalButton,
  CustomerObject,
  SaleItemObject,
  SaleObject,
  InventoryObject,
} from "@/lib/types";

// Functions
import { getSaleVars, writeItemList } from "@/lib/data-functions";
import {
  saveSaleAndItemsToDatabase,
  saveSaleAndPark,
  saveLog,
  saveStockMovementToDatabase,
  updateSaleInDatabase,
  updateSaleItemInDatabase,
  validateGiftCard,
} from "@/lib/db-functions";

// Components
import Pay from "./pay";
import SaleSummary from "./sale-summary";
import Acct from "./payment/acct";
import Card from "./payment/card";
import Cash from "./payment/cash";
import Gift from "./payment/gift";
import ScreenContainer from "@/components/container/screen";
import CreateCustomerSidebar from "@/components/customer/create-customer-sidebar";

// TODO add returns to sale items
// TODO refund dialog like PAY, refund with store credit, cash or card

export default function SaleScreen({ isNew }) {
  // Atoms
  const [sale, setSale] = useAtom(
    isNew ? newSaleObjectAtom : loadedSaleObjectAtom
  );
  const [cart, setCart] = useAtom(newSaleObjectAtom);

  console.log(sale);
  const [clerk] = useAtom(clerkAtom);
  const [, setAlert] = useAtom(alertAtom);
  const [view] = useAtom(viewAtom);

  // SWR
  const { customers } = useCustomers();
  const { saleInventory, mutateSaleInventory } = useSaleInventory();
  const { mutateInventory } = useStockInventory();
  const { items, isSaleItemsLoading } = useSaleItemsForSale(sale?.id);
  const {
    transactions,
    isSaleTransactionsLoading,
  } = useSaleTransactionsForSale(sale?.id);
  const { sales, mutateSales } = useSales();
  const { logs, mutateLogs } = useLogs();
  useVendorTotalPayments(sale?.customer_id);
  useVendorTotalSales(sale?.customer_id);

  // State
  // const [saleLoading, setSaleLoading] = useState(false);
  const [laybyLoading, setLaybyLoading] = useState(false);
  const [completeSaleLoading, setCompleteSaleLoading] = useState(false);
  const [parkSaleLoading, setParkSaleLoading] = useState(false);

  // BUG fix bug where close register screen appears (pressing TAB) - have fixed by just hiding sidebars and screens
  // BUG fix bug where bottom of dialog is visible
  // BUG dates are wrong on vercel
  // BUG why are some sales showing items as separate line items, not 2x quantity

  const itemList = writeItemList(saleInventory, items);
  const { totalRemaining, totalPrice } = getSaleVars(
    items,
    transactions,
    saleInventory
  );

  // Functions
  async function clickParkSale() {
    setParkSaleLoading(true);
    saveSaleAndPark(
      cart,
      items,
      clerk,
      customers,
      logs,
      mutateLogs,
      sales,
      mutateSales,
      mutateInventory
    );
    setAlert({
      open: true,
      type: "success",
      message: "SALE PARKED",
    });
    setSale(null);
    setParkSaleLoading(false);
  }

  async function clickLayby() {
    setLaybyLoading(true);
    // Change quantity for all items if it wasn't a layby previously
    for await (const saleItem of items) {
      // For each item, add quantity on layby, remove quantity in sale
      saveStockMovementToDatabase(saleItem, clerk, "layby", null);
    }
    if (sale?.state !== "layby") {
      // If not already a layby in progress...
      // Change sale state to layby
      // date_layby_started
      // layby_started_by
      let date = new Date();
      let laybySale = {
        ...sale,
        state: "layby",
        date_layby_started: date.toISOString(),
        layby_started_by: clerk?.id,
      };
      updateSaleInDatabase(laybySale);
      saveLog(
        {
          log: `Layby started${
            sale?.customer_id
              ? ` for ${
                  customers?.filter(
                    (c: CustomerObject) => c?.id === sale?.customer_id
                  )[0]?.name
                }`
              : ""
          } (${items.length} item${
            items.length === 1 ? "" : "s"
          } / $${totalPrice?.toFixed(2)} with $${totalRemaining?.toFixed(
            2
          )} left to pay).`,
          clerk_id: clerk?.id,
          table_id: "sale",
          row_id: sale?.id,
        },
        logs,
        mutateLogs
      );
      setAlert({
        open: true,
        type: "success",
        message: "LAYBY STARTED.",
      });
      let otherSales = sales?.filter((s: SaleObject) => s?.id !== sale?.id);
      mutateSales([...otherSales, laybySale], false);
      mutateInventory();
    }
    // close dialog
    setLaybyLoading(false);
    setSale(null);
  }

  async function clickCompleteSale() {
    setCompleteSaleLoading(true);
    // If was a layby, complete layby
    //    For all items, remove from layby
    // For all items,
    //    If gift card, add to the collection
    //    If misc item, ignore
    //    If other item, change quantity sold
    // Update sale to 'complete', add date_sale_completed, sale_completed_by
    items?.forEach((saleItem: SaleItemObject) => {
      console.log(saleItem);
      if (sale?.state === "layby" && !saleItem?.is_gift_card) {
        saveStockMovementToDatabase(saleItem, clerk, "unlayby", null);
      }
      if (saleItem?.is_gift_card) {
        // Add to collection
        let updatedGiftCard = saleInventory?.filter(
          (s: InventoryObject) => s?.id === saleItem?.item_id
        );
        updatedGiftCard.gift_card_is_valid = true;
        let otherSaleStock = saleInventory?.filter(
          (s: InventoryObject) => s?.id !== saleItem?.item_id
        );
        mutateSaleInventory([...otherSaleStock, updatedGiftCard]);
        validateGiftCard(saleItem?.item_id);
        // Add gift card to sale items
      } else if (saleItem?.is_misc_item) {
        // Do something
        // Add misc item to sale items
      } else {
        if (saleItem?.id) updateSaleItemInDatabase(saleItem, sale);
        saveStockMovementToDatabase(saleItem, clerk, "sold", null);
      }
    });
    let completedSale = { ...sale, state: "completed" };
    updateSaleInDatabase(completedSale);
    setSale(null);
    setCompleteSaleLoading(false);
    saveLog(
      {
        log: `Sale #${sale?.id} completed. ${itemList}.`,
        clerk_id: clerk?.id,
        table_id: "sale",
        row_id: sale?.id,
      },
      logs,
      mutateLogs
    );
    setAlert({
      open: true,
      type: "success",
      message: "SALE COMPLETED.",
    });
    let otherSales = sales?.filter((s: SaleObject) => s?.id !== sale?.id);
    mutateSales([...otherSales, completedSale], false);
    mutateInventory();
  }

  // Constants
  const buttons: ModalButton[] = [
    // REVIEW discard sale, do confirm dialog
    {
      type: "cancel",
      onClick: () => setSale(null),
      disabled: true || totalRemaining === 0,
      text: sale?.state === "layby" ? "CANCEL LAYBY" : "DISCARD SALE",
    },
    {
      type: "alt3",
      onClick: clickParkSale,
      disabled:
        (sale?.state && sale?.state !== "in progress") || totalRemaining === 0,
      loading: parkSaleLoading,
      text: "PARK SALE",
    },
    {
      type: "alt2",
      // TODO add more items, load sale into cart
      onClick: () => setSale(null),
      disabled:
        (sale?.state && sale?.state !== "in progress") || totalRemaining === 0,
      text: "ADD MORE ITEMS",
    },
    {
      type: "alt1",
      onClick: clickLayby,
      disabled: laybyLoading || !sale?.customer_id || totalRemaining <= 0,
      loading: laybyLoading,
      text: sale?.state === "layby" ? "CONTINUE LAYBY" : "START LAYBY",
    },
    {
      type: "ok",
      onClick: clickCompleteSale,
      disabled:
        completeSaleLoading || totalRemaining > 0 || sale?.state === "complete",
      loading: completeSaleLoading,
      text: "COMPLETE SALE",
    },
  ];

  return (
    <>
      <ScreenContainer
        show={Boolean(sale?.id)}
        closeFunction={() => setSale(null)}
        title={`SALE #${sale?.id} [${
          sale?.state ? sale?.state.toUpperCase() : "IN PROGRESS"
        }]`}
        loading={isSaleItemsLoading || isSaleTransactionsLoading}
        buttons={sale?.state === "completed" ? null : buttons}
      >
        <div className="flex items-start overflow-auto w-full">
          <div className="w-2/3">
            <SaleSummary isNew={isNew} />
          </div>
          <div className="w-1/3 p-2 flex flex-col justify-between">
            <Pay isNew={isNew} />
            {/*<Action />*/}
          </div>
        </div>
      </ScreenContainer>
      {view?.acctPaymentDialog && <Acct isNew={isNew} />}
      {view?.cardPaymentDialog && <Card isNew={isNew} />}
      {view?.cashPaymentDialog && <Cash isNew={isNew} />}
      {view?.giftPaymentDialog && <Gift isNew={isNew} />}
      {view?.createCustomer && <CreateCustomerSidebar />}
    </>
  );
}

// hidden sm:flex items-start overflow-auto

// <div className="sm:hidden flex flex-col justify-between px-2">
//   <Pay />
//   <SaleSummary />
//   <Action />
// </div>
