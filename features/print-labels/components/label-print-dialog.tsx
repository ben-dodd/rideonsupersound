// Packages
import { useAtom } from 'jotai'
import { useState } from 'react'

// DB
import { clerkAtom, viewAtom } from 'lib/atoms'
import { useLogs, useStockDisplay, useVendors } from 'lib/swr-hooks'
import { ModalButton, StockObject } from 'lib/types'

// Functions
import {
  filterInventory,
  getImageSrc,
  getItemSkuDisplayName,
} from 'lib/data-functions'
import { saveLog } from 'lib/db-functions'
import { v4 as uuid } from 'uuid'

// Components
import Modal from '@/components/modal'
import DeleteIcon from '@mui/icons-material/Delete'
import SearchIcon from '@mui/icons-material/Search'
import dayjs from 'dayjs'
import { getLabelPrinterCSV } from '../lib/functions'

export default function LabelPrintDialog() {
  // Atoms
  const [view, setView] = useAtom(viewAtom)
  const [clerk] = useAtom(clerkAtom)

  // SWR
  const { stockDisplay } = useStockDisplay()
  const { vendors } = useVendors()
  const { logs, mutateLogs } = useLogs()

  // State
  const [search, setSearch] = useState('')
  const [items, setItems] = useState([])

  function closeDialog() {
    setItems([])
    setView({ ...view, labelPrintDialog: false })
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
      headers: [
        'SKU',
        'ARTIST',
        'TITLE',
        'NEW/USED',
        'SELL PRICE',
        'SECTION',
        'BARCODE',
      ],
      fileName: `label-print-${dayjs().format('YYYY-MM-DD')}.csv`,
      text: 'PRINT LABELS',
      onClick: () => {
        saveLog(
          {
            log: 'Labels printed from label print dialog.',
            clerk_id: clerk?.id,
          },
          logs,
          mutateLogs
        )
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
          Search items and add to the list. Then click print to download the CSV
          file for the label printer.
        </div>
        <div className="grid grid-cols-2 gap-10 pt-2">
          <div>
            <div
              className={`flex items-center ring-1 ring-gray-400 w-auto bg-gray-100 hover:bg-gray-200 ${
                search && 'bg-pink-200 hover:bg-pink-300'
              }`}
            >
              <div className="pl-3 pr-1">
                <SearchIcon />
              </div>
              <input
                autoFocus
                className="w-full py-1 px-2 outline-none bg-transparent text-2xl"
                value={search || ''}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="SEARCH…"
              />
            </div>
            <div className="overflow-y-scroll pt-2">
              {filterInventory({ inventory: stockDisplay, search })?.map(
                (item: StockObject) => {
                  if (search === `${('00000' + item?.id || '').slice(-5)}`) {
                    addItem(item)
                  }
                  const vendor = vendors?.filter(
                    (v) => v?.id === item?.vendor_id
                  )?.[0]
                  return (
                    <div
                      className="hover:bg-gray-100 cursor-pointer py-2 px-2 border-b border-black flex"
                      onClick={() => addItem(item)}
                      key={item?.id}
                    >
                      <div className="w-12 mr-2">
                        <img
                          className={`object-cover h-12 ${
                            item?.quantity < 1 ? ' opacity-50' : ''
                          }`}
                          src={getImageSrc(item)}
                          alt={item?.title || 'Inventory image'}
                        />
                      </div>
                      <div>
                        <div className="font-bold">
                          {getItemSkuDisplayName(item)}
                        </div>
                        <div className="text-sm">{`${
                          item?.section ? `${item.section} / ` : ''
                        }${item?.format} [${
                          item?.is_new
                            ? 'NEW'
                            : item?.cond?.toUpperCase() || 'USED'
                        }]`}</div>
                        <div className="text-sm">
                          {`${vendor ? `Selling for ${vendor?.name}` : ''}`}
                        </div>
                      </div>
                    </div>
                  )
                }
              )}
            </div>
          </div>
          <div>
            <div className="font-bold">SELECTED ITEMS</div>
            <div>
              {items?.map((item) => {
                const vendor = vendors?.filter(
                  (v) => v?.id === item?.vendor_id
                )?.[0]
                return (
                  <div
                    key={item?.key}
                    className="flex items-center justify-between hover:bg-gray-100 my-2 border-b border-black"
                  >
                    <div className="flex">
                      <div className="w-12 mr-2">
                        <img
                          className={`object-cover h-12 ${
                            item?.quantity < 1 ? ' opacity-50' : ''
                          }`}
                          src={getImageSrc(item)}
                          alt={item?.title || 'Inventory image'}
                        />
                      </div>
                      <div>
                        <div className="font-bold">
                          {getItemSkuDisplayName(item)}
                        </div>
                        <div className="text-sm">{`${
                          item?.section ? `${item.section} / ` : ''
                        }${item?.format} [${
                          item?.is_new
                            ? 'NEW'
                            : item?.cond?.toUpperCase() || 'USED'
                        }]`}</div>
                        <div className="text-sm">
                          {`${vendor ? `Selling for ${vendor?.name}` : ''}`}
                        </div>
                      </div>
                    </div>
                    <div>
                      <button
                        className="py-2 text-tertiary hover:text-tertiary-dark"
                        onClick={() => deleteItem(item)}
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
