import { useState } from 'react'
import { ModalButton } from 'lib/types'
import TextField from 'components/inputs/text-field'
import Select from 'react-select'
import DeleteIcon from '@mui/icons-material/Delete'
import { getImageSrc, getItemDisplayName, getItemSku, getItemSkuDisplayName } from 'lib/functions/displayInventory'
import { returnStock, useStockList } from 'lib/api/stock'
import { useVendors } from 'lib/api/vendor'
import { useCurrentRegisterId } from 'lib/api/register'
import { useClerk } from 'lib/api/clerk'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'
import { StockItemSearchObject } from 'lib/types/stock'
import { VendorObject } from 'lib/types/vendor'
import Modal from 'components/modal'

export default function ReturnStockScreen() {
  const { stockList } = useStockList()
  const { vendors } = useVendors()
  const { clerk } = useClerk()
  const { view, closeView, setAlert } = useAppStore()
  const { registerId } = useCurrentRegisterId()
  const [vendorWrapper, setVendorWrapper] = useState(null)
  const [returnItems, setReturnItems] = useState([])
  const [note, setNote] = useState('')

  const [submitting, setSubmitting] = useState(false)

  function closeDialog() {
    closeView(ViewProps.returnStockScreen)
    setVendorWrapper(null)
    setReturnItems([])
    setNote('')
  }

  const buttons: ModalButton[] = [
    {
      type: 'cancel',
      onClick: closeDialog,
      text: 'CANCEL',
    },
    {
      type: 'ok',
      onClick: async () => {
        setSubmitting(true)
        await returnStock({ clerkId: clerk?.id, registerId, vendorId: vendorWrapper?.value, items: returnItems, note })
        setSubmitting(false)
        setAlert({
          open: true,
          type: 'success',
          message: `ITEMS RETURNED TO VENDOR`,
        })
        closeDialog()
      },
      loading: submitting,
      disabled:
        submitting ||
        !vendorWrapper?.value ||
        returnItems?.length === 0 ||
        returnItems?.filter(
          (returnItem: any) =>
            isNaN(returnItem?.quantity) ||
            stockList?.find((i: StockItemSearchObject) => i?.id === parseInt(returnItem?.id))?.quantity <
              parseInt(`${returnItem?.quantity}`) ||
            returnItem?.quantity < 0,
        ).length > 0,
      text: 'RETURN STOCK',
    },
  ]

  const returnOptions = stockList
    ?.filter(
      (item: StockItemSearchObject) =>
        item?.vendorId === vendorWrapper?.value &&
        returnItems?.filter((i) => i?.id === item?.id)?.length === 0 &&
        item?.quantity > 0,
    )
    ?.map((item: StockItemSearchObject) => ({
      value: item?.id,
      label: getItemSkuDisplayName(item),
    }))

  return (
    <Modal
      open={view?.returnStockScreen}
      closeFunction={closeDialog}
      title={'RETURN STOCK'}
      buttons={buttons}
      width="max-w-dialog"
    >
      <div className="h-dialogsm">
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
                    quantity: stockList?.find((i: StockItemSearchObject) => i?.id === item?.value)?.quantity || 1,
                  },
                  ...returnItems,
                ])
              }
              onInputChange={(newValue, actionMeta, prevInputValue) => {
                if (
                  actionMeta?.action === 'input-change' &&
                  returnOptions?.filter((opt) => newValue === `${('00000' + opt?.value || '').slice(-5)}`)?.length > 0
                ) {
                  let returnItem = stockList?.filter(
                    (i: StockItemSearchObject) =>
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
              }}
            />
            <TextField
              inputLabel="Notes"
              value={note}
              onChange={(e: any) => setNote(e.target.value)}
              multiline
              rows={3}
            />
          </div>
          <div className="w-2/3 pl-8">
            {returnItems?.length > 0 ? (
              <div className="h-dialog">
                <div className="font-bold text-xl">{`RETURNING ${returnItems?.reduce(
                  (prev, returnItem) => (prev += parseInt(returnItem?.quantity)),
                  0,
                )} ITEMS`}</div>
                <div className="h-full overflow-y-scroll">
                  {returnItems?.map((returnItem: any, i: number) => {
                    const item: StockItemSearchObject = stockList?.find(
                      (i: StockItemSearchObject) => i?.id === parseInt(returnItem?.id),
                    )
                    return (
                      <div className="flex justify-between my-2 border-b w-full" key={`${returnItem?.id}-${i}`}>
                        <div className="flex">
                          <div className="w-20">
                            <div className="w-20 h-20 relative">
                              <img
                                className="object-cover absolute"
                                src={getImageSrc(item)}
                                alt={item?.title || 'Stock image'}
                              />
                              <div className="absolute w-20 h-8 bg-opacity-50 bg-black text-white text-sm flex justify-center items-center">
                                {getItemSku(item)}
                              </div>
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
                            onChange={(e: any) => {
                              setReturnItems(
                                returnItems?.map((returnListItem) =>
                                  returnListItem?.id === returnItem?.id
                                    ? { ...returnItem, quantity: e.target.value }
                                    : returnListItem,
                                ),
                              )
                            }}
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
    </Modal>
  )
}
