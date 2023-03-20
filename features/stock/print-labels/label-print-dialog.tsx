import { useState } from 'react'
import { ModalButton } from 'lib/types'

import Modal from 'components/modal'
import DeleteIcon from '@mui/icons-material/Delete'
import Select from 'react-select'
import dayjs from 'dayjs'
import { getImageSrc, getItemDisplayName, getItemSku, getItemSkuDisplayName } from 'lib/functions/displayInventory'
import { getLabelPrinterCSV } from 'lib/functions/printLabels'
import { useAppStore } from 'lib/store'
import { useStockList } from 'lib/api/stock'
import { ViewProps } from 'lib/store/types'
import { StockItemSearchObject } from 'lib/types/stock'
import TextField from 'components/inputs/text-field'

export default function LabelPrintDialog() {
  const { view, closeView } = useAppStore()
  const { stockList } = useStockList()
  const [printItems, setPrintItems] = useState([])

  function closeDialog() {
    closeView(ViewProps.labelPrintDialog)
    setPrintItems([])
  }

  const explodeItems = () => {
    const csvItems = []
    printItems?.forEach((printItem) => {
      const stockItem = stockList?.find((stockListItem) => stockListItem?.id === printItem?.id)
      let quantityArray = [...Array(parseInt(`${printItem?.quantity || 1}`))]
      quantityArray.forEach(() => {
        csvItems.push(stockItem)
      })
    })
    return csvItems
  }

  const buttons: ModalButton[] = [
    {
      type: 'cancel',
      onClick: closeDialog,
      text: 'CANCEL',
    },
    {
      type: 'ok',
      data: getLabelPrinterCSV(explodeItems()),
      headers: ['SKU', 'ARTIST', 'TITLE', 'NEW/USED', 'SELL PRICE', 'SECTION', 'BARCODE'],
      fileName: `label-print-${dayjs().format('YYYY-MM-DD')}.csv`,
      text: 'PRINT LABELS',
      onClick: () => {
        closeDialog()
      },
    },
  ]

  const printOptions = stockList?.map((item: StockItemSearchObject) => ({
    value: item?.id,
    label: getItemSkuDisplayName(item),
  }))

  return (
    <Modal
      open={view?.labelPrintDialog}
      closeFunction={closeDialog}
      title={'LABEL PRINT'}
      buttons={buttons}
      width={'max-w-dialog'}
    >
      <div className="h-dialogsm">
        <div className="help-text">
          Search items and add to the list. Then click print to download the CSV file for the label printer.
        </div>
        <div className="font-bold text-xl mt-4">Add Items</div>

        <Select
          className="w-full text-xs"
          value={null}
          options={printOptions}
          onChange={(item: any) =>
            setPrintItems([
              {
                id: item?.value,
                quantity: 1,
              },
              ...printItems,
            ])
          }
          onInputChange={(newValue, actionMeta, prevInputValue) => {
            if (
              actionMeta?.action === 'input-change' &&
              printOptions?.filter((opt) => newValue === `${('00000' + opt?.value || '').slice(-5)}`)?.length > 0
            ) {
              let item = stockList?.filter(
                (i: StockItemSearchObject) =>
                  i?.id ===
                  printOptions?.find((opt) => newValue === `${('00000' + opt?.value || '').slice(-5)}`)?.[0]?.value,
              )
              setPrintItems([
                {
                  id: item?.id,
                  quantity: 1,
                },
                ...printItems,
              ])
            }
          }}
        />
        <div className="mt-4">
          {printItems?.length > 0 ? (
            <div className="h-dialog">
              <div className="font-bold text-xl">{`PRINTING ${printItems?.reduce(
                (prev, returnItem) => (prev += parseInt(returnItem?.quantity)),
                0,
              )} LABELS`}</div>
              <div className="h-full overflow-y-scroll">
                {printItems?.map((printItem: any, i: number) => {
                  const item: StockItemSearchObject = stockList?.find(
                    (i: StockItemSearchObject) => i?.id === parseInt(printItem?.id),
                  )
                  return (
                    <div className="flex justify-between my-2 border-b w-full" key={`${printItem?.id}-${i}`}>
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
                            className={`mt-2 text-sm font-bold ${item?.quantity <= 0 ? 'text-tertiary' : 'text-black'}`}
                          >{`${item?.quantity || 0} in stock.`}</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-end">
                        <TextField
                          className="w-16 mr-6"
                          inputType="number"
                          min={0}
                          valueNum={printItem?.quantity}
                          onChange={(e: any) => {
                            setPrintItems(
                              printItems?.map((printListItem) =>
                                printListItem?.id === printItem?.id
                                  ? { ...printItem, quantity: e.target.value }
                                  : printListItem,
                              ),
                            )
                          }}
                        />
                        <button
                          className="bg-gray-200 hover:bg-gray-300 p-1 w-10 h-10 rounded-full mr-8"
                          onClick={() => setPrintItems(printItems?.filter((i) => i?.id !== printItem?.id))}
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div>Select items from the drop-down menu.</div>
          )}
        </div>
      </div>
    </Modal>
  )
}
