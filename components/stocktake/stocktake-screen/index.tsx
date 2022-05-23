// Packages
import { useState } from "react";
import { useAtom } from "jotai";

// DB
import { useInventory, useStocktakesByTemplate } from "@/lib/swr-hooks";
import {
  viewAtom,
  clerkAtom,
  confirmModalAtom,
  loadedStocktakeAtom,
  loadedItemIdAtom,
} from "@/lib/atoms";
import { ModalButton } from "@/lib/types";

// Functions
import {
  processStocktake,
  saveStocktakeToDatabase,
  saveSystemLog,
  updateStocktakeInDatabase,
} from "@/lib/db-functions";

// Components
import ScreenContainer from "@/components/_components/container/screen";
import CountItems from "./count-items";
import CompleteStocktake from "./complete-stocktake";
import dayjs from "dayjs";
import InventoryItemScreen from "@/components/inventory/inventory-item-screen";

export default function StocktakeScreen() {
  // Atoms
  const [, setConfirmModal] = useAtom(confirmModalAtom);
  const [stocktake, setLoadedStocktake] = useAtom(loadedStocktakeAtom);
  const { inventory } = useInventory();
  const [loadedItemId] = useAtom(loadedItemIdAtom);
  const [view, setView] = useAtom(viewAtom);
  const [clerk] = useAtom(clerkAtom);
  const [step, setStep] = useState(0);
  const { stocktakes, isStocktakesLoading, mutateStocktakes } =
    useStocktakesByTemplate(stocktake?.stocktake_template_id);
  const [isLoading, setIsLoading] = useState(false);

  async function saveOrUpdateStocktake(st?) {
    const stocktakeToSave = st || stocktake;
    console.log(stocktakeToSave);
    if (!stocktakeToSave?.id) {
      setIsLoading(true);
      const id = await saveStocktakeToDatabase({
        ...stocktakeToSave,
        date_started: dayjs.utc().format(),
        started_by: clerk?.id,
      });
      setLoadedStocktake({ ...stocktakeToSave, id });
      mutateStocktakes(
        [...(stocktakes || []), { ...stocktakeToSave, id }],
        false
      );
      setIsLoading(false);
      saveSystemLog(`New stocktake saved`, clerk?.id);
    } else {
      updateStocktakeInDatabase(stocktakeToSave);
      mutateStocktakes(
        [
          ...(stocktakes || [])?.filter((s) => s?.id !== stocktakeToSave?.id),
          stocktakeToSave,
        ],
        false
      );
    }
  }

  // const debouncedSave = useCallback(debounce(saveOrUpdateStocktake, 5000), []);

  // useEffect(() => {
  //   const st = { ...stocktake };
  //   debouncedSave(st);
  // }, stocktake?.counted_items);

  const buttons: ModalButton[][] = [
    [
      {
        type: "cancel",
        onClick: () => {
          setView({ ...view, stocktakeScreen: false });
          setLoadedStocktake(null);
        },
        text: "CANCEL",
      },
      {
        type: "alt1",
        text: `SAVE AND CLOSE`,
        onClick: async () => {
          await saveOrUpdateStocktake();
          setView({ ...view, stocktakeScreen: false });
          setLoadedStocktake(null);
        },
      },
      {
        type: "ok",
        text: `REVIEW`,
        onClick: async () => {
          await saveOrUpdateStocktake();
          setStep(1);
        },
      },
    ],
    [
      {
        type: "cancel",
        onClick: () => {
          setView({ ...view, stocktakeScreen: false });
          setLoadedStocktake(null);
        },
        text: "CANCEL",
      },
      {
        type: "alt2",
        text: `BACK TO COUNTING`,
        onClick: async () => {
          await saveOrUpdateStocktake();
          setStep(0);
        },
      },
      {
        type: "alt1",
        text: `SAVE AND CLOSE`,
        onClick: async () => {
          await saveOrUpdateStocktake();
          setView({ ...view, stocktakeScreen: false });
          setLoadedStocktake(null);
        },
      },
      {
        type: "ok",
        text: `COMPLETE`,
        onClick: async () => {
          setConfirmModal({
            open: true,
            title: "Lock It In",
            styledMessage: (
              <span>Are you sure you want to process the stocktake?</span>
            ),
            yesText: "YES, I'M SURE",
            action: async () => {
              await saveOrUpdateStocktake();
              // processStocktake(stocktake, inventory, clerk);
              setView({ ...view, stocktakeScreen: false });
              setLoadedStocktake(null);
            },
          });
        },
      },
    ],
  ];

  return (
    <>
      <ScreenContainer
        loading={isStocktakesLoading}
        show={view?.stocktakeScreen}
        closeFunction={() => setView({ ...view, stocktakeScreen: false })}
        title={`${stocktake?.id ? "" : "NEW "}STOCK TAKE ${
          stocktake?.id ? `#${stocktake?.id}` : ""
        }`}
        buttons={buttons[step]}
        titleClass="bg-col2"
      >
        <div className="flex flex-col w-full">
          {step === 0 && (
            <div>
              <CountItems
                stocktake={stocktake}
                setStocktake={setLoadedStocktake}
              />
            </div>
          )}
          {step == 1 && (
            <div>
              <CompleteStocktake
                stocktake={stocktake}
                setStocktake={setLoadedStocktake}
              />
            </div>
          )}
        </div>
      </ScreenContainer>
      {loadedItemId?.stocktake && <InventoryItemScreen page={"stocktake"} />}
    </>
  );
}
