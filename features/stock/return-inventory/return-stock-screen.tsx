import { useState } from 'react'
import { ModalButton } from 'lib/types'
import TextField from 'components/inputs/text-field'
import Select from 'react-select'
import ScreenContainer from 'components/container/screen'
import DeleteIcon from '@mui/icons-material/Delete'
import { getImageSrc, getItemDisplayName, getItemSku, getItemSkuDisplayName } from 'lib/functions/displayInventory'
import { returnStock, useStockList } from 'lib/api/stock'
import { useVendors } from 'lib/api/vendor'
import { useCurrentRegisterId } from 'lib/api/register'
import { useClerk } from 'lib/api/clerk'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'
import { StockObject } from 'lib/types/stock'
import { VendorObject } from 'lib/types/vendor'

export default function ReturnStockScreen() {
  const { inventory, mutateInventory } = useStockList()
  // const { logs, mutateLogs } = useLogs()
  const { vendors } = useVendors()
  const { clerk } = useClerk()
  const { view, closeView, setAlert } = useAppStore()
  const { registerId } = useCurrentRegisterId()

  // State
  const [vendorWrapper, setVendorWrapper] = useState(null)
  const [returnItems, setReturnItems] = useState([])
  const [notes, setNotes] = useState('')

  const [submitting, setSubmitting] = useState(false)

  function closeFunction() {
    closeView(ViewProps.returnStockScreen)
    setVendorWrapper(null)
    setReturnItems([])
    setNotes('')
  }

  const buttons: ModalButton[] = [
    {
      type: 'cancel',
      onClick: closeFunction,
      text: 'CANCEL',
    },
    {
      type: 'ok',
      onClick: () => {
        setSubmitting(true)
        returnStock(vendorWrapper?.value, returnItems, notes, clerk, registerId, inventory, mutateInventory)
        setSubmitting(false)
        setAlert({
          open: true,
          type: 'success',
          message: `ITEMS RETURNED TO VENDOR`,
        })
        closeFunction()
      },
      loading: submitting,
      disabled:
        submitting ||
        !vendorWrapper?.value ||
        returnItems?.length === 0 ||
        returnItems?.filter(
          (returnItem: any) =>
            isNaN(returnItem?.quantity) ||
            inventory?.find((i: StockObject) => i?.id === parseInt(returnItem?.id))?.quantity <
              parseInt(`${returnItem?.quantity}`) ||
            returnItem?.quantity < 0,
        ).length > 0,
      text: 'RETURN STOCK',
    },
  ]

  console.log(returnItems)

  const returnOptions = inventory
    ?.filter(
      (item: StockObject) =>
        item?.vendorId === vendorWrapper?.value &&
        returnItems?.filter((i) => i?.id === item?.id)?.length === 0 &&
        item?.quantity > 0,
    )
    ?.map((item: StockObject) => ({
      value: item?.id,
      label: getItemSkuDisplayName(item),
    }))

  return (
    <ScreenContainer
      show={view?.returnStockScreen}
      closeFunction={closeFunction}
      title={'RETURN STOCK'}
      buttons={buttons}
      titleClass="bg-col2"
    >
      <div className="w-full">
        <div className="help-text">
          Select the vendor that you are returning stock to, then select the items and add how many of each they are
          taking.
        </div>
        <div className="flex mt-4">
          <div className="w-1/3">
            <div className="font-bold text-xl">Select Vendor</div>
            <Select
              fieldRequired
              // isDisabled={vendorWrapper?.value}
              value={vendorWrapper}
              onChange={(vendorObject: any) => {
                setVendorWrapper(vendorObject)
                setReturnItems([])
              }}
              options={vendors?.map((val: VendorObject) => ({
                value: val?.id,
                label: val?.name || '',
              }))}
            />
            <div className="font-bold text-xl mt-4">Add Items</div>
            <Select
              className="w-full text-xs"
              isDisabled={!vendorWrapper?.value}
              value={null}
              options={returnOptions}
              onChange={(item: any) =>
                setReturnItems([
                  {
                    id: item?.value,
                    quantity: inventory?.find((i: StockObject) => i?.id === item?.value)?.quantity || 1,
                  },
                  ...returnItems,
                ])
              }
              onInputChange={(newValue, actionMeta, prevInputValue) => {
                if (
                  actionMeta?.action === 'input-change' &&
                  returnOptions?.filter((opt) => newValue === `${('00000' + opt?.value || '').slice(-5)}`)?.length > 0
                ) {
                  let returnItem = inventory?.filter(
                    (i: StockObject) =>
                      i?.id ===
                      returnOptions?.find((opt) => newValue === `${('00000' + opt?.value || '').slice(-5)}`)?.[0]
                        ?.value,
                  )
                  setReturnItems([
                    {
                      id: returnItem?.id,
                      quantity: returnItem?.quantity || 1,
                    },
                    ...returnItems,
                  ])
                }
                // if () {
                //   addItemToCart();
                // }
              }}
            />
            <TextField
              inputLabel="Notes"
              value={notes}
              onChange={(e: any) => setNotes(e.target.value)}
              multiline
              rows={3}
            />
          </div>
          <div className="w-2/3 pl-8">
            {/* <div className="font-bold text-xl">Items to Return</div> */}
            {returnItems?.length > 0 ? (
              <div className="h-dialog">
                <div className="font-bold text-xl">{`RETURNING ${returnItems?.reduce(
                  (prev, returnItem) => (prev += parseInt(returnItem?.quantity)),
                  0,
                )} ITEMS`}</div>
                <div className="h-full overflow-y-scroll">
                  {returnItems?.map((returnItem: any, i: number) => {
                    const item = inventory?.find((i: StockObject) => i?.id === parseInt(returnItem?.id))
                    return (
                      <div className="flex justify-between my-2 border-b w-full" key={`${returnItem?.id}-${i}`}>
                        <div className="flex">
                          <div className="w-20">
                            <div className="w-20 h-20 relative">
                              <img
                                className="object-cover absolute"
                                // layout="fill"
                                // objectFit="cover"
                                src={getImageSrc(item)}
                                alt={item?.title || 'Stock image'}
                              />
                              {!item?.is_gift_card && !item?.is_misc_item && (
                                <div className="absolute w-20 h-8 bg-opacity-50 bg-black text-white text-sm flex justify-center items-center">
                                  {getItemSku(item)}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="ml-2">
                            {getItemDisplayName(item)}
                            <div
                              className={`mt-2 text-sm font-bold ${
                                item?.quantity <= 0 ? 'text-tertiary' : 'text-black'
                              }`}
                            >{`${item?.quantity || 0} in stock.`}</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-end">
                          <TextField
                            className="w-16 mr-6"
                            inputType="number"
                            error={!returnItem?.quantity}
                            max={item?.quantity || 0}
                            min={0}
                            valueNum={returnItem?.quantity}
                            onChange={(e: any) =>
                              returnItems?.map((i) =>
                                i?.id === returnItem?.id ? { ...returnItem, quantity: e.target.value } : returnItem,
                              )
                            }
                          />
                          <button
                            className="bg-gray-200 hover:bg-gray-300 p-1 w-10 h-10 rounded-full mr-8"
                            onClick={() => setReturnItems(returnItems?.filter((i) => i?.id !== returnItem?.id))}
                          >
                            <DeleteIcon />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : vendorWrapper?.value ? (
              <div>Select items from the drop-down menu.</div>
            ) : (
              <div>Select vendor to add items to return.</div>
            )}
          </div>
        </div>
      </div>
    </ScreenContainer>
  )
}
