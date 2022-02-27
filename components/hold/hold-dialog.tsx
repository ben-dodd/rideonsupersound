// Packages
import { useEffect, useState } from "react";
import { useAtom } from "jotai";

// DB
import {
  useHolds,
  useCustomers,
  useClerks,
  useInventory,
  useRegister,
  useRegisterID,
  useWeather,
  useLogs,
} from "@/lib/swr-hooks";
import {
  viewAtom,
  clerkAtom,
  loadedHoldIdAtom,
  pageAtom,
  alertAtom,
  cartAtom,
} from "@/lib/atoms";
import {
  ModalButton,
  HoldObject,
  CustomerObject,
  ClerkObject,
  StockObject,
} from "@/lib/types";

// Functions
import {
  returnHoldToStock,
  updateHoldInDatabase,
  loadSaleToCart,
  saveLog,
  saveSystemLog,
} from "@/lib/db-functions";

// Components
import Modal from "@/components/_components/container/modal";
import TextField from "@/components/_components/inputs/text-field";
import HoldListItem from "./list-item";
import dayjs from "dayjs";
import { getItemDisplayName } from "@/lib/data-functions";

export default function HoldDialog() {
  const { weather } = useWeather();
  // State
  const [geolocation, setGeolocation] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by your browser");
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGeolocation(position?.coords);
        },
        () => console.log("Unable to retrieve location.")
      );
    }
  }, []);
  // Atoms
  const [view, setView] = useAtom(viewAtom);
  const [, setAlert] = useAtom(alertAtom);
  const [loadedHoldId, setLoadedHoldId] = useAtom(loadedHoldIdAtom);
  const [clerk] = useAtom(clerkAtom);
  const [page, setPage] = useAtom(pageAtom);
  const [cart, setCart] = useAtom(cartAtom);

  // SWR
  const { holds, isHoldsLoading, mutateHolds } = useHolds();
  const { inventory, mutateInventory } = useInventory();
  const { logs, mutateLogs } = useLogs();
  const { customers } = useCustomers();
  const { clerks } = useClerks();
  const { registerID } = useRegisterID();

  // States
  const originalHold = holds?.filter(
    (h: HoldObject) => h?.id === loadedHoldId[page]
  )[0];
  const [hold, setHold] = useState(originalHold);
  const customerName = customers?.filter(
    (c: CustomerObject) => c?.id === hold?.customer_id
  )[0]?.name;
  const clerkName = clerks?.filter(
    (c: ClerkObject) => c?.id === hold?.started_by
  )[0]?.name;

  function closeDialog() {
    setLoadedHoldId({ ...loadedHoldId, [page]: 0 });
    setHold(null);
  }

  // Constants
  const buttons: ModalButton[] = [
    {
      type: "cancel",
      text: "Return to Stock",
      onClick: () => {
        saveSystemLog("Hold dialog - Return hold to stock clicked.", clerk?.id);
        returnHoldToStock(
          hold,
          clerk,
          holds,
          mutateHolds,
          mutateInventory,
          registerID
        );
        closeDialog();
        saveLog(
          {
            log: `${getItemDisplayName(
              inventory?.filter((i: StockObject) => i?.id === hold?.item_id)[0]
            )} removed from hold and added back to stock.`,
            clerk_id: clerk?.id,
          },
          logs,
          mutateLogs
        );
        setAlert({
          open: true,
          type: "success",
          message: `ITEM RETURNED TO STOCK FROM HOLD`,
        });
      },
    },
    {
      type: "alt1",
      text: "Add To Cart",
      onClick: addHoldToCart,
    },
    {
      type: "ok",
      text: "Update",
      disabled:
        (hold?.hold_period === originalHold?.hold_period &&
          hold?.note === originalHold?.note) ||
        isNaN(parseInt(hold?.hold_period)),
      onClick: () => {
        saveSystemLog("Hold dialog - Update hold clicked.", clerk?.id);
        if (hold?.hold_period !== null || hold?.note !== null) {
          const otherHolds = holds?.filter(
            (h: HoldObject) => h?.id !== loadedHoldId
          );
          mutateHolds([...otherHolds, hold], false);
          updateHoldInDatabase(hold);
        }
        closeDialog();
      },
    },
  ];

  return (
    <Modal
      open={Boolean(loadedHoldId[page])}
      closeFunction={closeDialog}
      title={"HOLD ITEM"}
      loading={isHoldsLoading}
      buttons={buttons}
    >
      <>
        <HoldListItem cartItem={hold} />
        <div>{`Item held for ${customerName} (hold set up by ${clerkName})`}</div>
        <div>{`Item held for ${dayjs().diff(hold?.date_from, "day")} of ${
          hold?.hold_period || 30
        } days.`}</div>
        <TextField
          inputLabel="Hold Period"
          inputType="number"
          min={0}
          error={isNaN(parseInt(hold?.hold_period)) || hold?.hold_period < 0}
          valueNum={hold?.hold_period}
          onChange={(e: any) =>
            setHold({ ...hold, hold_period: e.target.value })
          }
        />
        <TextField
          inputLabel="Notes"
          className="mb-4"
          value={hold?.note}
          onChange={(e: any) => setHold({ ...hold, note: e.target.value })}
          multiline
        />
      </>
    </Modal>
  );

  function addHoldToCart() {
    // TODO do we need to check if it is another customer?
    saveSystemLog("Hold dialog - Add hold to cart.", clerk?.id);
    returnHoldToStock(
      hold,
      clerk,
      holds,
      mutateHolds,
      mutateInventory,
      registerID
    );
    closeDialog();

    let newItems = cart?.items || [];
    let index = newItems.findIndex(
      (cartItem) => cartItem.item_id === hold?.item_id
    );
    if (index < 0)
      newItems.push({
        item_id: hold?.item_id,
        quantity: hold?.quantity,
      });
    else
      newItems[index].quantity = `${
        parseInt(newItems[index].quantity) + hold?.quantity
      }`;
    setCart({
      id: cart?.id || null,
      date_sale_opened: cart?.date_sale_opened || dayjs.utc().format(),
      sale_opened_by: cart?.sale_opened_by || clerk?.id,
      items: newItems,
      transactions: cart?.transactions || [],
      state: cart?.state || null,
      customer_id: cart?.customer_id || null,
      layby_started_by: cart?.layby_started_by || null,
      date_layby_started: cart?.date_layby_started || null,
      weather: cart?.weather || weather,
      geo_latitude: cart?.geo_latitude || geolocation?.latitude,
      geo_longitude: cart?.geo_longitude || geolocation?.longitude,
    });
    setPage("sell");
    setView({ ...view, cart: true });
    saveLog(
      {
        log: `${getItemDisplayName(
          inventory?.filter((i: StockObject) => i?.id === hold?.item_id)[0]
        )} added to cart${cart?.id ? ` (sale #${cart?.id}) from hold` : ""}.`,
        clerk_id: clerk?.id,
      },
      logs,
      mutateLogs
    );
    setAlert({
      open: true,
      type: "success",
      message: `ITEM ADDED TO CART FROM HOLD`,
    });
  }
}
