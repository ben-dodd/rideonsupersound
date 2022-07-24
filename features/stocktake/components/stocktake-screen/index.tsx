// Packages
import { useAtom } from 'jotai'
import { useState } from 'react'

// DB
import {
  clerkAtom,
  confirmModalAtom,
  loadedItemIdAtom,
  loadedStocktakeIdAtom,
  loadedStocktakeTemplateIdAtom,
  viewAtom,
} from '@/lib/atoms'
import {
  useInventory,
  useStocktakeItemsByStocktake,
  useStocktakesByTemplate,
  useStocktakeTemplates,
} from '@/lib/swr-hooks'
import { ModalButton, StockObject } from '@/lib/types'

// Functions
import {
  processStocktake,
  saveStocktakeItemToDatabase,
  updateStocktakeInDatabase,
  updateStocktakeItemInDatabase,
} from '@/lib/db-functions'

// Components
import ScreenContainer from '@/components/container/screen'
import InventoryItemScreen from '@/features/item-inventory/components/inventory-item-screen'
import CountItems from './count-items'
import ReviewItems from './review-items'

export default function StocktakeScreen() {
  // Atoms
  const [, setConfirmModal] = useAtom(confirmModalAtom)
  const [stocktakeId, setLoadedStocktakeId] = useAtom(loadedStocktakeIdAtom)
  const [stocktakeTemplateId] = useAtom(loadedStocktakeTemplateIdAtom)

  const { stocktakeItems, isStocktakeItemsLoading, mutateStocktakeItems } =
    useStocktakeItemsByStocktake(stocktakeId)
  const { stocktakes, isStocktakesLoading, mutateStocktakes } =
    useStocktakesByTemplate(stocktakeTemplateId)
  const { stocktakeTemplates } = useStocktakeTemplates()

  const stocktake = stocktakes?.filter(
    (stocktake) => stocktake?.id === stocktakeId
  )?.[0]
  const stocktakeTemplate = stocktakeTemplates?.filter(
    (stocktakeTemplate) => stocktakeTemplate?.id === stocktakeTemplateId
  )?.[0]

  const { inventory } = useInventory()
  const [loadedItemId] = useAtom(loadedItemIdAtom)

  const [view, setView] = useAtom(viewAtom)
  const [clerk] = useAtom(clerkAtom)
  const [step, setStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  async function saveOrUpdateStocktake(st?) {
    const stocktakeToSave = st || stocktake
    updateStocktakeInDatabase(stocktakeToSave)
    mutateStocktakes(
      stocktakes?.map((st) =>
        st?.id === stocktakeToSave?.id ? stocktakeToSave : st
      ),
      false
    )
  }

  const completed = Boolean(stocktake?.date_closed || stocktake?.date_cancelled)

  function addMissedItems() {
    const inventoryList = inventory?.filter(
      (i: StockObject) =>
        i?.quantity > 0 &&
        (stocktakeTemplate?.vendor_enabled
          ? stocktakeTemplate?.vendor_list?.includes(i?.vendor_id)
          : true) &&
        (stocktakeTemplate?.format_enabled
          ? stocktakeTemplate?.format_list?.includes(i?.format)
          : true) &&
        (stocktakeTemplate?.media_enabled
          ? stocktakeTemplate?.media_list?.includes(i?.media)
          : true) &&
        (stocktakeTemplate?.section_enabled
          ? stocktakeTemplate?.section_list?.includes(i?.section)
          : true)
    )

    // const idList = inventoryList?.map((inventoryItem) => inventoryItem?.id);
    const stockIdList = stocktakeItems?.map((si) => si?.stock_id)
    const missedItems = inventoryList
      ?.filter((inventoryItem) => !stockIdList?.includes(inventoryItem?.id))
      ?.map((inventoryItem) => ({
        id: `${stocktake?.id}-${inventoryItem?.id}`,
        stock_id: inventoryItem?.id,
        stocktake_id: stocktake?.id,
        quantity_counted: 0,
        quantity_recorded: inventoryItem?.quantity || 0,
        quantity_difference: 0 - (inventoryItem?.quantity || 0),
        review_decision: null,
      }))
    const checkedStocktakeItems = stocktakeItems?.map((si) => {
      if (
        inventoryList?.filter(
          (inventoryItem) => inventoryItem?.id === si?.stock_id
        )?.length > 0
      ) {
        return si
      } else {
        updateStocktakeItemInDatabase({ ...si, do_check_details: 1 })
        return { ...si, do_check_details: 1 }
      }
    })
    const newCountedItems = [...checkedStocktakeItems, ...missedItems]

    // ?.sort((a: StocktakeItemObject, b: StocktakeItemObject) => {
    //   if (a?.quantity_difference === 0 && b?.quantity_difference !== 0)
    //     return 1;
    //   if (b?.quantity_difference === 0 && a?.quantity_difference !== 0)
    //     return -1;
    //   return a?.quantity_difference - b?.quantity_difference;
    // });
    mutateStocktakeItems(newCountedItems, false)
    missedItems?.forEach((i) => saveStocktakeItemToDatabase(i))
  }

  const completedButtons: ModalButton[] = [
    {
      type: 'ok',
      text: `OK`,
      onClick: () => {
        setView({ ...view, stocktakeScreen: false })
        setLoadedStocktakeId(null)
      },
    },
  ]

  const buttons: ModalButton[][] = [
    [
      {
        type: 'cancel',
        onClick: () => {
          setView({ ...view, stocktakeScreen: false })
          setLoadedStocktakeId(null)
        },
        text: 'CANCEL',
      },
      {
        type: 'alt1',
        text: `SAVE AND CLOSE`,
        onClick: () => {
          saveOrUpdateStocktake()
          setView({ ...view, stocktakeScreen: false })
          setLoadedStocktakeId(null)
        },
      },
      {
        type: 'ok',
        text: `REVIEW`,
        onClick: () => {
          addMissedItems()
          saveOrUpdateStocktake()
          setStep(1)
        },
      },
    ],
    [
      {
        type: 'cancel',
        onClick: () => {
          setView({ ...view, stocktakeScreen: false })
          setLoadedStocktakeId(null)
        },
        text: 'CANCEL',
      },
      {
        type: 'alt2',
        text: `BACK TO COUNTING`,
        onClick: () => {
          saveOrUpdateStocktake()
          setStep(0)
        },
      },
      {
        type: 'alt1',
        text: `SAVE AND CLOSE`,
        onClick: async () => {
          saveOrUpdateStocktake()
          setView({ ...view, stocktakeScreen: false })
          setLoadedStocktakeId(null)
        },
      },
      {
        type: 'ok',
        text: `COMPLETE`,
        onClick: async () => {
          setConfirmModal({
            open: true,
            title: 'Lock It In',
            styledMessage: (
              <span>Are you sure you want to process the stocktake?</span>
            ),
            yesText: "YES, I'M SURE",
            action: () => {
              saveOrUpdateStocktake()
              processStocktake(
                stocktake,
                stocktakeTemplate,
                stocktakeItems,
                inventory,
                clerk
              )
              setView({ ...view, stocktakeScreen: false })
              setLoadedStocktakeId(null)
            },
          })
        },
      },
    ],
  ]

  return (
    <>
      <ScreenContainer
        loading={isStocktakesLoading || isStocktakeItemsLoading}
        show={view?.stocktakeScreen}
        closeFunction={
          completed
            ? () => {
                setView({ ...view, stocktakeScreen: false })
                setLoadedStocktakeId(null)
              }
            : async () => {
                setView({ ...view, stocktakeScreen: false })
                await saveOrUpdateStocktake(stocktake)
                setLoadedStocktakeId(null)
              }
        }
        title={`${stocktake?.id ? '' : 'NEW '}${
          stocktakeTemplate?.name
        } STOCK TAKE ${stocktake?.id ? `#${stocktake?.id}` : ''}`}
        buttons={completed ? completedButtons : buttons[step]}
        titleClass="bg-col1"
      >
        <div className="flex flex-col w-full">
          {step === 0 && !completed && (
            <div>
              <CountItems />
            </div>
          )}
          {(step == 1 || completed) && (
            <div>
              <ReviewItems />
            </div>
          )}
        </div>
      </ScreenContainer>
      {loadedItemId?.stocktake && <InventoryItemScreen page={'stocktake'} />}
    </>
  )
}
