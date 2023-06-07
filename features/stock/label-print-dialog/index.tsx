import { useMemo, useState } from 'react'
import { ModalButton } from 'lib/types'

import Modal from 'components/modal'
import Select from 'react-select'
import dayjs from 'dayjs'
import { getItemSkuDisplayName } from 'lib/functions/displayInventory'
import { getLabelPrinterCSV } from 'lib/functions/printLabels'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'
import { usePrintLabelStockList } from 'lib/api/stock'
import LabelPrintListItem from './list-item'
import { dateYMD } from 'lib/types/date'

export default function LabelPrintDialog() {
  const { view, closeView } = useAppStore()
  const { printLabelStockList, isPrintLabelStockListLoading } = usePrintLabelStockList()
  const [printItems, setPrintItems] = useState([])

  function closeDialog() {
    closeView(ViewProps.labelPrintDialog)
    setPrintItems([])
  }

  const explodeItems = () => {
    const csvItems = []
    printItems?.forEach((printItem) => {
      const stockItem = printLabelStockList?.find((stockListItem) => stockListItem?.id === printItem?.id)
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
      fileName: `label-print-${dayjs().format(dateYMD)}.csv`,
      text: 'PRINT LABELS',
      onClick: () => {
        closeDialog()
      },
    },
  ]

  const printOptions = useMemo(
    () =>
      printLabelStockList
        ?.filter((item) => !printItems?.map((opt) => opt?.id)?.includes(item?.id))
        ?.map((item) => ({
          value: item,
          label: getItemSkuDisplayName(item),
        })),
    [printLabelStockList, printItems],
  )

  const labelNumber = useMemo(
    () => printItems?.reduce((prev, returnItem) => (prev += parseInt(returnItem?.quantity)), 0),
    [printItems],
  )

  const handleAddNewItem = (item) => {
    setPrintItems([
      {
        id: item?.value?.id,
        item: item?.value,
        quantity: 1,
      },
      ...printItems,
    ])
  }

  const handleChangePrintQuantity = (id, quantity) => {
    setPrintItems(printItems?.map((printItem) => (printItem?.id === id ? { ...printItem, quantity } : printItem)))
  }

  const handleDeletePrintItem = (id) => {
    setPrintItems(printItems?.filter((i) => i?.id !== id))
  }

  return (
    <Modal
      open={view?.labelPrintDialog}
      closeFunction={closeDialog}
      title={'LABEL PRINT'}
      buttons={buttons}
      width={'max-w-dialog'}
      loading={isPrintLabelStockListLoading}
    >
      <div className="h-dialogsm">
        <div className="font-bold text-xl">Add Items</div>
        <Select
          className="w-full text-xs"
          value={null}
          options={printOptions}
          onChange={handleAddNewItem}
          onInputChange={(newValue, actionMeta) => {
            if (
              actionMeta?.action === 'input-change' &&
              printOptions?.filter((opt) => newValue === `${`00000${opt?.value}`.slice(-5)}`)?.length > 0
            ) {
              const item = printOptions?.filter((opt) => opt.id === Number(newValue))
              handleAddNewItem(item)
            }
          }}
        />
        <div className="help-text">
          Search items and add to the list. Then click print to download the CSV file for the label printer.
        </div>
        <div className="mt-4">
          {printItems?.length > 0 ? (
            <div className="h-dialog">
              <div className="font-bold text-xl">{`PRINTING ${labelNumber} LABEL${labelNumber === 1 ? '' : 'S'}`}</div>
              <div className="h-full overflow-y-scroll">
                {printItems?.map((printItem: any) => (
                  <LabelPrintListItem
                    key={printItem?.id}
                    printItem={printItem}
                    changePrintQuantity={(e) => handleChangePrintQuantity(printItem?.id, e.target.value)}
                    deletePrintItem={() => handleDeletePrintItem(printItem?.id)}
                  />
                ))}
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
