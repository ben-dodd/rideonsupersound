// Packages
import { useState } from "react";
import { useAtom } from "jotai";
import formatISO from "date-fns/formatISO";

// DB
import {
  useSaleItemsForSale,
  useSaleTransactionsForSale,
  useCustomers,
  useStockInventory,
  useLogs,
  useVendorTotalSales,
  useVendorTotalPayments,
  useSales,
  useSaleItems,
} from "@/lib/swr-hooks";
import {
  clerkAtom,
  alertAtom,
  loadedSaleObjectAtom,
  newSaleObjectAtom,
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
  const [clerk] = useAtom(clerkAtom);
  const [, setAlert] = useAtom(alertAtom);
  const [view, setView] = useAtom(viewAtom);
  const [, setPage] = useAtom(pageAtom);

  // SWR
  const { customers } = useCustomers();
  const { inventory, mutateInventory } = useStockInventory();
  const { items, isSaleItemsLoading } = useSaleItemsForSale(sale?.id);
  const {
    transactions,
    isSaleTransactionsLoading,
  } = useSaleTransactionsForSale(sale?.id);
  const { sales, mutateSales } = useSales();
  const { saleItems, mutateSaleItems } = useSaleItems();
  const { logs, mutateLogs } = useLogs();
  useVendorTotalPayments(sale?.customer_id);
  useVendorTotalSales(sale?.customer_id);

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
  const { totalRemaining, totalPrice } = getSaleVars(
    items,
    transactions,
    inventory
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
      saleItems,
      mutateSaleItems,
      mutateInventory
    );
    setAlert({
      open: true,
      type: "success",
      message: "SALE PARKED",
    });
    setSale(null);
    if (isNew) setView({ ...view, saleScreen: false });
    setParkSaleLoading(false);
  }

  async function clickAddMoreItems() {
    setAddMoreItemsLoading(true);
    console.log(cart);
    console.log(items);
    console.log(sale);
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
    setPage("sell");
    setView({ ...view, saleScreen: false });
  }

  async function clickLayby() {
    setLaybyLoading(true);
    // Change quantity for all items if it wasn't a layby previously
    for await (const saleItem of items) {
      // For each item, add quantity on layby, remove quantity in sale
      saveStockMovementToDatabase(saleItem, clerk, SaleStateTypes.Layby, null);
    }
    if (sale?.state !== SaleStateTypes.Layby) {
      // If not already a layby in progress...
      // Change sale state to layby
      // date_layby_started
      // layby_started_by
      let date = new Date();
      let laybySale = {
        ...sale,
        state: SaleStateTypes.Layby,
        date_layby_started: date.toISOString(),
        layby_started_by: clerk?.id,
      };
      updateSaleInDatabase(laybySale);
      let numberOfItems = items?.reduce(
        (acc: number, i: SaleItemObject) => acc + parseInt(i?.quantity),
        0
      );
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
          } (${numberOfItems} item${
            numberOfItems === 1 ? "" : "s"
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
    if (isNew) setView({ ...view, saleScreen: false });
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
    // Update sale to 'complete', add date_sale_closed, sale_closed_by
    items?.forEach((saleItem: SaleItemObject) => {
      console.log(saleItem);
      if (sale?.state === SaleStateTypes.Layby && !saleItem?.is_gift_card) {
        saveStockMovementToDatabase(saleItem, clerk, "unlayby", null);
      }
      if (saleItem?.is_gift_card) {
        // Add to collection
        let updatedGiftCard = inventory?.filter(
          (s: InventoryObject) => s?.id === saleItem?.item_id
        );
        updatedGiftCard.gift_card_is_valid = true;
        let otherSaleStock = inventory?.filter(
          (s: InventoryObject) => s?.id !== saleItem?.item_id
        );
        mutateInventory([...otherSaleStock, updatedGiftCard]);
        validateGiftCard(saleItem?.item_id);
        // Add gift card to sale items
      } else if (saleItem?.is_misc_item) {
        // Do something
        // Add misc item to sale items
      } else {
        if (saleItem?.id)
          updateSaleItemInDatabase({ ...saleItem, sale_id: sale?.id });
        saveStockMovementToDatabase(saleItem, clerk, "sold", null);
      }
    });
    let completedSale = {
      ...sale,
      state: SaleStateTypes.Completed,
      sale_closed_by: clerk?.id,
      date_sale_closed: "CURRENT_TIMESTAMP",
    };
    updateSaleInDatabase(completedSale);
    setSale(null);
    if (isNew) setView({ ...view, saleScreen: false });
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
      text:
        sale?.state === SaleStateTypes.Layby ? "CANCEL LAYBY" : "DISCARD SALE",
    },
    {
      type: "alt3",
      onClick: clickParkSale,
      disabled: sale?.state === SaleStateTypes.Layby || totalRemaining === 0,
      loading: parkSaleLoading,
      text: "PARK SALE",
    },
    {
      type: "alt2",
      onClick: () =>
        isNew ? setView({ ...view, saleScreen: false }) : clickAddMoreItems(),
      disabled: sale?.state === SaleStateTypes.Layby || totalRemaining === 0,
      loading: addMoreItemsLoading,
      text: "CHANGE ITEMS",
    },
    {
      type: "alt1",
      onClick: clickLayby,
      disabled: laybyLoading || !sale?.customer_id || totalRemaining <= 0,
      loading: laybyLoading,
      text:
        sale?.state === SaleStateTypes.Layby ? "CONTINUE LAYBY" : "START LAYBY",
    },
    {
      type: "ok",
      onClick: clickCompleteSale,
      disabled:
        completeSaleLoading ||
        totalRemaining > 0 ||
        sale?.state === SaleStateTypes.Completed,
      loading: completeSaleLoading,
      text: "COMPLETE SALE",
    },
  ];

  return (
    <>
      <ScreenContainer
        show={isNew ? view?.saleScreen : Boolean(sale?.id)}
        closeFunction={() =>
          isNew ? setView({ ...view, saleScreen: false }) : setSale(null)
        }
        title={`SALE #${sale?.id} [${
          sale?.state ? sale?.state.toUpperCase() : "IN PROGRESS"
        }]`}
        loading={isSaleItemsLoading || isSaleTransactionsLoading}
        buttons={sale?.state === SaleStateTypes.Completed ? null : buttons}
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
