import Stepper from 'components/navigation/stepper'
import { ModalButton } from 'lib/types'
import { useState } from 'react'
import SelectItems from './add-items'
import CheckDetails from './check-details'
import PrintLabel from './print-label'
import SelectVendor from './select-vendor'
import SetPriceAndQuantities from './set-price-and-quantities'
import { useAppStore } from 'lib/store'
import { useCurrentRegisterId } from 'lib/api/register'
import { ViewProps } from 'lib/store/types'
import { useClerk } from 'lib/api/clerk'
import { receiveStock } from 'lib/api/stock'
import Modal from 'components/modal'

export default function ReceiveStockDialog() {
  const { receiveBasket, resetReceiveBasket, view, openConfirm, closeView } = useAppStore()
  const { clerk } = useClerk()
  const [step, setStep] = useState(0)
  const [receivedStock, setReceivedStock] = useState(null)
  const [receiveLoading, setReceiveLoading] = useState(false)
  const { registerId } = useCurrentRegisterId()

  const buttons: ModalButton[][] = [
    [
      {
        type: 'cancel',
        onClick: () => closeView(ViewProps.receiveStockScreen),
        text: 'CANCEL',
      },
      {
        type: 'ok',
        text: 'NEXT',
        disabled: !receiveBasket?.vendorId,
        onClick: () => {
          setStep(1)
        },
      },
    ],
    [
      {
        type: 'cancel',
        onClick: () => {
          openConfirm({
            open: true,
            title: 'Reset Basket?',
            styledMessage: <span>Are you sure you want to wipe all received items?</span>,
            yesText: "YES, I'M SURE",
            action: () => {
              setStep(0)
              resetReceiveBasket()
            },
          })
        },
        text: 'RESET',
      },
      {
        type: 'ok',
        text: 'NEXT',
        disabled: receiveBasket?.items?.length === 0,
        onClick: () => {
          setStep(2)
        },
      },
    ],
    [
      {
        type: 'cancel',
        onClick: () => {
          setStep(1)
        },
        text: 'BACK',
      },
      {
        type: 'ok',
        text: 'NEXT',
        onClick: () => {
          setStep(3)
        },
      },
    ],
    [
      {
        type: 'cancel',
        disabled: receiveLoading,
        onClick: () => {
          setStep(2)
        },
        text: 'BACK',
      },
      {
        type: 'ok',
        disabled: isDisabled(),
        loading: receiveLoading,
        text: 'RECEIVE ITEMS',
        onClick: async () => {
          setReceiveLoading(true)
          const receivedStock = await receiveStock({
            ...receiveStock,
            clerkId: clerk?.id,
            registerId,
          })
          setReceivedStock(receivedStock)
          setReceiveLoading(false)
          setStep(4)
        },
      },
    ],
    [
      {
        type: 'ok',
        disabled: isDisabled(),
        text: 'DONE',
        onClick: () => {
          resetReceiveBasket()
          closeView(ViewProps.receiveStockScreen)
        },
      },
    ],
  ]

  // TODO make stepper receive
  // Step 1 - select vendor or create new
  // Step 2 - select items, either
  //    from vendor items
  //    from csv
  //    write into table
  //    barcode -> discogs / googlebooks
  // Step 3 - select discogs/googlebooks
  // Step 4 - enter PRICE
  // Step 5 - enter quantity
  // Step 6 - print labels

  return (
    <Modal
      open={view?.receiveStockScreen}
      closeFunction={() => closeView(ViewProps.receiveStockScreen)}
      title={'RECEIVE STOCK'}
      buttons={buttons[step]}
      width="max-w-dialog"
    >
      <div className="flex flex-col w-full h-dialog">
        <Stepper
          steps={['Select vendor', 'Add items', 'Check details', 'Set price and quantities', 'Print labels']}
          value={step}
          onChange={setStep}
          // disabled
          selectedBg="bg-col2"
          notSelectedBg="bg-gray-200"
          selectedText="text-col2-dark"
          notSelectedText="text-black"
          selectedTextHover="text-col2-dark"
          notSelectedTextHover="text-gray-800"
        />
        {step === 0 && (
          <div>
            <SelectVendor />
          </div>
        )}
        {step === 1 && (
          <div>
            <SelectItems />
          </div>
        )}
        {step == 2 && (
          <div>
            <CheckDetails />
          </div>
        )}
        {step == 3 && (
          <div>
            <SetPriceAndQuantities />
          </div>
        )}
        {step == 4 && (
          <div>
            <PrintLabel receivedStock={receivedStock} />
          </div>
        )}
      </div>
    </Modal>
  )

  function isDisabled() {
    return (
      !receiveBasket?.vendorId ||
      receiveBasket?.items?.length === 0 ||
      receiveBasket?.items?.filter(
        (item) =>
          // !item?.item?.section ||
          item?.item?.isNew === null ||
          // (!item?.item?.is_new && !item?.item?.cond) ||
          !Number.isInteger(parseInt(`${item?.quantity}`)) ||
          !(
            (Number.isInteger(parseInt(`${item?.vendorCut}`)) && Number.isInteger(parseInt(`${item?.totalSell}`))) ||
            item?.item?.id
          ),
      ).length > 0
    )
  }
}
