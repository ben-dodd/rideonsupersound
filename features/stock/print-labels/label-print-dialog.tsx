import { useState } from 'react'
import { ModalButton } from 'lib/types'
import { v4 as uuid } from 'uuid'

import Modal from 'components/modal'
import { logPrintLabels } from 'lib/functions/log'
import DeleteIcon from '@mui/icons-material/Delete'
import Select from 'react-select'
import dayjs from 'dayjs'
import { getImageSrc, getItemSkuDisplayName } from 'lib/functions/displayInventory'
import { getLabelPrinterCSV } from 'lib/functions/printLabels'
import { useAppStore } from 'lib/store'
import { useClerk } from 'lib/api/clerk'
import { useStockList } from 'lib/api/stock'
import { ViewProps } from 'lib/store/types'

export default function LabelPrintDialog() {
  const { view, closeView } = useAppStore()
  const { clerk } = useClerk()
  const { stockList } = useStockList()
  const [search, setSearch] = useState('')
  const [items, setItems] = useState([])

  function closeDialog() {
    setItems([])
    closeView(ViewProps.labelPrintDialog)
  }

  // Constants
  const buttons: ModalButton[] = [
    {
      type: 'cancel',
      onClick: closeDialog,
      text: 'CANCEL',
    },
    {
      type: 'ok',
      data: getLabelPrinterCSV(items),
      headers: ['SKU', 'ARTIST', 'TITLE', 'NEW/USED', 'SELL PRICE', 'SECTION', 'BARCODE'],
      fileName: `label-print-${dayjs().format('YYYY-MM-DD')}.csv`,
      text: 'PRINT LABELS',
      onClick: () => {
        logPrintLabels(clerk, 'label print dialog')
        closeDialog()
      },
    },
  ]

  function addItem(item) {
    setItems([...items, { ...item, key: uuid() }])
    setSearch('')
  }

  function deleteItem(item) {
    setItems([...items?.filter?.((i) => i?.key !== item?.key)])
  }

  return (
    <Modal
      open={view?.labelPrintDialog}
      closeFunction={closeDialog}
      title={'LABEL PRINT'}
      buttons={buttons}
      width={'max-w-dialog'}
    >
      <div className="h-dialog">
        <div className="help-text">
          Search items and add to the list. Then click print to download the CSV file for the label printer.
        </div>
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
                  returnOptions?.find((opt) => newValue === `${('00000' + opt?.value || '').slice(-5)}`)?.[0]?.value,
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
        <div>
          <div className="font-bold">SELECTED ITEMS</div>
          <div>
            {items?.map((item) => (
              <div
                key={item?.key}
                className="flex items-center justify-between hover:bg-gray-100 my-2 border-b border-black"
              >
                <div className="flex">
                  <div className="w-12 mr-2">
                    <img
                      className={`object-cover h-12 ${item?.quantity < 1 ? ' opacity-50' : ''}`}
                      src={getImageSrc(item)}
                      alt={item?.title || 'Stock image'}
                    />
                  </div>
                  <div>
                    <div className="font-bold">{getItemSkuDisplayName(item)}</div>
                    <div className="text-sm">{`${item?.section ? `${item.section} / ` : ''}${item?.format} [${
                      item?.is_new ? 'NEW' : item?.cond?.toUpperCase() || 'USED'
                    }]`}</div>
                    <div className="text-sm">{`Selling for ${item?.vendorName || '...'}`}</div>
                  </div>
                </div>
                <div>
                  <button className="py-2 text-tertiary hover:text-tertiary-dark" onClick={() => deleteItem(item)}>
                    <DeleteIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}
