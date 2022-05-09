// Packages
import { useEffect, useState } from "react";
import { useAtom } from "jotai";

// DB
import { useInventory, useRegisterID, useStocktakes } from "@/lib/swr-hooks";
import {
  viewAtom,
  clerkAtom,
  receiveStockAtom,
  confirmModalAtom,
  loadedStocktakeIdAtom,
} from "@/lib/atoms";
import { ModalButton } from "@/lib/types";

// Functions
import {
  receiveStock,
  saveStocktakeToDatabase,
  saveSystemLog,
} from "@/lib/db-functions";

// Components
import Stepper from "@/components/_components/navigation/stepper";
import ScreenContainer from "@/components/_components/container/screen";
import CountItems from "./count-items";
import CompleteStocktake from "./complete-stocktake";
import SetupStocktake from "./setup-stocktake";

export default function StocktakeScreen() {
  // Atoms
  const [basket, setBasket] = useAtom(receiveStockAtom);
  const [, setConfirmModal] = useAtom(confirmModalAtom);
  const { inventory, mutateInventory } = useInventory();
  const [view, setView] = useAtom(viewAtom);
  const [clerk] = useAtom(clerkAtom);
  const [step, setStep] = useState(0);
  const [receivedStock, setReceivedStock] = useState(null);
  const { stocktakes, isStocktakesLoading } = useStocktakes();
  const [stocktake, setStocktake] = useState(null);
  const [loadedStocktakeId] = useAtom(loadedStocktakeIdAtom);

  useEffect(() => {
    setStep[0];
    setStocktake(
      stocktakes?.filter((s) => s?.id === loadedStocktakeId?.stocktake)?.[0] ||
        null
    );
  }, [loadedStocktakeId?.stocktake]);

  // SWR
  const { registerID } = useRegisterID();

  const buttons: ModalButton[][] = [
    [
      {
        type: "cancel",
        onClick: () => setView({ ...view, stocktakeScreen: false }),
        text: "CANCEL",
      },
      {
        type: "ok",
        text: "START STOCKTAKING",
        onClick: async () => {
          const id = await saveStocktakeToDatabase({ ...stocktake });
          saveSystemLog(`Stocktake setup - Set step 1`, clerk?.id);
          setStep(1);
        },
      },
    ],
    [
      {
        type: "cancel",
        onClick: () => {
          // setConfirmModal({
          //   open: true,
          //   title: "Reset Basket?",
          //   styledMessage: (
          //     <span>Are you sure you want to wipe all received items?</span>
          //   ),
          //   yesText: "YES, I'M SURE",
          //   action: () => {
          //     saveSystemLog(`Receive stock screen - Set step 0`, clerk?.id);
          //     setStep(0);
          //     setBasket({});
          //   },
          // });
        },
        text: "BACK",
      },
      {
        type: "ok",
        text: "CLOSE AND SAVE",
        // disabled: basket?.items?.length === 0,
        onClick: () => {
          saveSystemLog(`Receive stock screen - Set step 2`, clerk?.id);
          setStep(2);
        },
      },
      {
        type: "ok",
        text: "REVIEW",
        disabled: basket?.items?.length === 0,
        onClick: () => {
          saveSystemLog(`Receive stock screen - Set step 2`, clerk?.id);
          setStep(2);
        },
      },
    ],
    [
      {
        type: "ok",
        // disabled: isDisabled(),
        text: "DONE",
        onClick: () => {
          saveSystemLog(`Receive stock screen - DONE clicked`, clerk?.id);
          setBasket({});
          setView({ ...view, stocktakeScreen: false });
        },
      },
    ],
  ];

  // TODO make stepper receive
  // Step 1 - set up stocktake, add filters etc.
  // Step 2 - count items
  // Step 3 - review stocktake and complete

  return (
    <ScreenContainer
      show={view?.stocktakeScreen}
      closeFunction={() => setView({ ...view, stocktakeScreen: false })}
      title={`${stocktake?.id ? "" : "NEW "}STOCK TAKE ${
        stocktake?.id ? `#${stocktake?.id}` : ""
      }`}
      buttons={buttons[step]}
      titleClass="bg-col2"
    >
      <div className="flex flex-col w-full">
        <Stepper
          steps={["Setup Stocktake", "Count Items", "Complete Stocktake"]}
          value={step}
          onChange={setStep}
          disabled
          selectedBg="bg-col2"
          notSelectedBg="bg-gray-200"
          selectedText="text-col2-dark"
          notSelectedText="text-black"
          selectedTextHover="text-col2-dark"
          notSelectedTextHover="text-gray-800"
        />
        {step === 0 && (
          <div>
            <SetupStocktake stocktake={stocktake} setStocktake={setStocktake} />
          </div>
        )}
        {step === 1 && (
          <div>
            <CountItems stocktake={stocktake} setStocktake={setStocktake} />
          </div>
        )}
        {step == 4 && (
          <div>
            <CompleteStocktake
              stocktake={stocktake}
              setStocktake={setStocktake}
            />
          </div>
        )}
      </div>
    </ScreenContainer>
  );

  // function isDisabled() {
  //   return (
  //     !basket?.vendor_id ||
  //     basket?.items?.length === 0 ||
  //     basket?.items?.filter(
  //       (item) =>
  //         // !item?.item?.section ||
  //         item?.item?.is_new === null ||
  //         // (!item?.item?.is_new && !item?.item?.cond) ||
  //         !Number.isInteger(parseInt(`${item?.quantity}`)) ||
  //         !(
  //           (Number.isInteger(parseInt(`${item?.vendor_cut}`)) &&
  //             Number.isInteger(parseInt(`${item?.total_sell}`))) ||
  //           item?.item?.id
  //         )
  //     ).length > 0
  //   );
  // }
}
