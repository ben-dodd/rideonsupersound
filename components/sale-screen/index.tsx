// Packages
import { useState, useEffect } from "react";
import { useAtom } from "jotai";

// DB
import {
  useSaleItemsForSale,
  useSaleTransactionsForSale,
  useContacts,
  useInventory,
  useLogs,
} from "@/lib/swr-hooks";
import {
  clerkAtom,
  alertAtom,
  viewAtom,
  loadedSaleObjectAtom,
  newSaleObjectAtom,
} from "@/lib/atoms";
import { ModalButton, ContactObject } from "@/lib/types";

// Functions
import { getSaleVars, writeItemList } from "@/lib/data-functions";
import {
  saveSaleAndItemsToDatabase,
  saveLog,
  saveStockMovementToDatabase,
  updateSaleInDatabase,
  updateSaleItemInDatabase,
  saveGiftCardToDatabase,
} from "@/lib/db-functions";

// Components
import Pay from "./pay";
import SaleSummary from "./sale-summary";
import Acct from "./payment/acct";
import Card from "./payment/card";
import Cash from "./payment/cash";
import Gift from "./payment/gift";
import ScreenContainer from "@/components/container/screen";

// TODO add returns to sale items

export default function SaleScreen({ isNew }) {
  // Atoms
  const [sale, setSale] = useAtom(
    isNew ? newSaleObjectAtom : loadedSaleObjectAtom
  );

  console.log(sale);
  const [clerk] = useAtom(clerkAtom);
  const [, setAlert] = useAtom(alertAtom);
  const [view, setView] = useAtom(viewAtom);

  // SWR
  const { contacts } = useContacts();
  const { inventory, mutateInventory } = useInventory();
  const { items, isSaleItemsLoading, mutateSaleItems } = useSaleItemsForSale(
    sale?.id
  );
  console.log(items);
  const {
    transactions,
    isSaleTransactionsLoading,
    mutateSaleTransactions,
  } = useSaleTransactionsForSale(sale?.id);
  console.log(transactions);
  const { mutateLogs } = useLogs();

  // State
  const [laybyLoading, setLaybyLoading] = useState(false);
  const [completeSaleLoading, setCompleteSaleLoading] = useState(false);
  const [parkSaleLoading, setParkSaleLoading] = useState(false);

  // Load
  // useEffect(() => {
  //   mutateSaleItems();
  //   mutateSaleTransactions();
  // }, [sale?.id]);
  //
  // useEffect(() => {
  //   if (!isNew) {
  //     // console.log("setting sale");
  //     setSale({ ...sale, items, transactions });
  //   }
  // }, [items, transactions]);

  // Every time transactions or items are changed, recalculate the totals
  useEffect(() => {
    const saleVars = getSaleVars(sale, inventory);
    setSale({ ...sale, ...saleVars });
  }, [sale?.id, sale?.transactions, sale?.items]);

  const itemList = writeItemList(inventory, items);

  // Functions
  function clearSale() {
    setSale(null);
    setView({ ...view, saleScreen: false });
  }

  async function clickParkSale() {
    setParkSaleLoading(true);
    const saleId = await saveSaleAndItemsToDatabase(
      { ...sale, state: "parked" },
      clerk
    );
    saveLog(
      {
        log: `Sale parked (${sale?.items.length} item${
          sale?.items.length === 1 ? "" : "s"
        }${
          sale?.contact_id
            ? ` for ${
                (contacts || []).filter(
                  (c: ContactObject) => c?.id === sale?.contact_id
                )[0]?.name
              }.`
            : ""
        }).`,
        clerk_id: clerk?.id,
        table_id: "sale",
        row_id: saleId,
      },
      mutateLogs
    );
    setAlert({
      open: true,
      type: "success",
      message: "SALE PARKED",
    });
    clearSale();
    setParkSaleLoading(false);
    mutateInventory();
  }

  async function clickLayby() {
    setLaybyLoading(true);
    // Change quantity for all items if it wasn't a layby previously
    for await (const saleItem of sale?.items) {
      // For each item, add quantity on layby, remove quantity in sale
      saveStockMovementToDatabase(saleItem, clerk, "layby", null);
    }
    if (sale?.state !== "layby") {
      // If not already a layby in progress...
      // Change sale state to layby
      // date_layby_started
      // layby_started_by
      let date = new Date();
      await updateSaleInDatabase({
        ...sale,
        state: "layby",
        date_layby_started: date.toISOString(),
        layby_started_by: clerk?.id,
      });
    }
    saveLog(
      {
        log: `Layby started${
          sale?.contact_id
            ? ` for ${
                (contacts || []).filter(
                  (c: ContactObject) => c?.id === sale?.contact_id
                )[0]?.name
              }`
            : ""
        } (${sale?.items.length} item${
          sale?.items.length === 1 ? "" : "s"
        } / $${sale?.totalPrice?.toFixed(
          2
        )} with $${sale?.totalRemaining?.toFixed(2)} left to pay).`,
        clerk_id: clerk?.id,
        table_id: "sale",
        row_id: sale?.id,
      },
      mutateLogs
    );
    setAlert({
      open: true,
      type: "success",
      message: "LAYBY STARTED.",
    });
    // close dialog
    clearSale();
    setLaybyLoading(false);
    mutateInventory();
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
    sale?.items.forEach((saleItem) => {
      if (sale?.state === "layby" && !saleItem?.is_gift_card) {
        saveStockMovementToDatabase(saleItem, clerk, "unlayby", null);
      }
      if (saleItem?.is_gift_card) {
        // Add to collection
        saveGiftCardToDatabase();
        // Add gift card to sale items
      } else if (saleItem?.is_misc_item) {
        // Do something
        // Add misc item to sale items
      } else {
        if (saleItem?.id) updateSaleItemInDatabase(saleItem, sale);
        saveStockMovementToDatabase(saleItem, clerk, "sold", null);
      }
    });
    updateSaleInDatabase({ ...sale, state: "completed" });
    clearSale();
    setCompleteSaleLoading(false);
    saveLog(
      {
        log: `Sale #${sale?.id} completed. ${itemList}.`,
        clerk_id: clerk?.id,
        table_id: "sale",
        row_id: sale?.id,
      },
      mutateLogs
    );
    setAlert({
      open: true,
      type: "success",
      message: "SALE COMPLETED.",
    });
    mutateInventory();
  }

  // Constants
  const buttons: ModalButton[] = [
    {
      type: "cancel",
      onClick: () => setView({ ...view, saleScreen: false }),
      disabled: true || sale?.totalRemaining === 0,
      text: sale?.state === "layby" ? "CANCEL LAYBY" : "DISCARD SALE",
    },
    {
      type: "alt3",
      onClick: clickParkSale,
      disabled:
        (sale?.state && sale?.state !== "in_progress") ||
        sale?.totalRemaining === 0,
      loading: parkSaleLoading,
      text: "PARK SALE",
    },
    {
      type: "alt2",
      onClick: () => setView({ ...view, saleScreen: false }),
      disabled:
        (sale?.state && sale?.state !== "in_progress") ||
        sale?.totalRemaining === 0,
      text: "ADD MORE ITEMS",
    },
    {
      type: "alt1",
      onClick: clickLayby,
      disabled: laybyLoading || !sale?.contact_id || sale?.totalRemaining <= 0,
      loading: laybyLoading,
      text: sale?.state === "layby" ? "CONTINUE LAYBY" : "START LAYBY",
    },
    {
      type: "ok",
      onClick: clickCompleteSale,
      disabled:
        completeSaleLoading ||
        sale?.totalRemaining > 0 ||
        sale?.state === "complete",
      loading: completeSaleLoading,
      text: "COMPLETE SALE",
    },
  ];

  return (
    <>
      {view?.acctPaymentDialog && <Acct isNew={isNew} />}
      {view?.cardPaymentDialog && <Card isNew={isNew} />}
      {view?.cashPaymentDialog && <Cash isNew={isNew} />}
      {view?.giftPaymentDialog && <Gift isNew={isNew} />}
      <ScreenContainer
        show={view?.saleScreen}
        closeFunction={() => setView({ ...view, saleScreen: false })}
        title={`SALE #${sale?.id} [${
          sale?.state ? sale?.state.toUpperCase() : "IN PROGRESS"
        }]`}
        loading={isSaleItemsLoading || isSaleTransactionsLoading}
        buttons={buttons}
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
    </>
  );
}

// hidden sm:flex items-start overflow-auto

// <div className="sm:hidden flex flex-col justify-between px-2">
//   <Pay />
//   <SaleSummary />
//   <Action />
// </div>
