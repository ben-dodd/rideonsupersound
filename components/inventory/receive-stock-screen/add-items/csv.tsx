import { receiveStockAtom } from '@/lib/atoms'
import { getItemDisplayName } from '@/lib/data-functions'
import { ChevronRight } from '@mui/icons-material'
import { useAtom } from 'jotai'
import { useState } from 'react'
import { useCSVReader } from 'react-papaparse'
import { v4 as uuid } from 'uuid'

export default function Csv() {
  const { CSVReader } = useCSVReader()
  const [basket, setBasket] = useAtom(receiveStockAtom)
  const [csvItems, setCSVItems] = useState([])
  const addItems = () => {
    setBasket({
      ...basket,
      items: basket?.items ? [...basket?.items, ...csvItems] : csvItems,
    })
  }
  const parseCSVItems = (results: any) => {
    let parsedItems = []
    for (let i = 0; i < results?.data?.length; i++) {
      let d = results?.data[i]
      if (!d?.Artist && !d?.Title) break
      parsedItems.push({
        key: uuid(),
        quantity: d?.Quantity ? parseInt(d?.Quantity) : 1,
        total_sell: d['Sale Price']
          ? `${parseFloat(d['Sale Price']?.replace(/\$|["],/g, ''))}`
          : null,
        vendor_cut: d['Vendor Cut']
          ? `${parseFloat(d['Vendor Cut']?.replace(/\$|["],/g, ''))}`
          : null,
        item: {
          artist: d?.Artist,
          barcode: d?.Barcode,
          colour: d?.Colour,
          cond: d?.Condition,
          country: d?.Country,
          format: d?.Format,
          genre: d?.Genre,
          is_new: d['Is New?'] === 'TRUE' ? true : false,
          note: d?.Notes,
          section: d?.Section,
          size: d?.Size,
          title: d?.Title,
          media: d?.Type,
        },
      })
    }
    setCSVItems(parsedItems)
  }
  return (
    <div>
      <div className="mb-2">
        <ol>
          <li>
            <a
              className="underline"
              href="https://docs.google.com/spreadsheets/d/1xQSRFFkbYJBi-4-d2eDApVyUC3ym2we9Uh4nCumt_bI/edit?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
            >
              Click here
            </a>{' '}
            and add your items to the Google Sheet.
          </li>
          <li>
            Once you're done. Click{' '}
            <i>File | Download | Comma-separated values (*.csv)</i>
          </li>
          <li>Upload the CSV file using the button below.</li>
        </ol>
      </div>
      <CSVReader
        onUploadAccepted={(results: any) => {
          parseCSVItems(results)
        }}
        config={{ header: true }}
      >
        {({ getRootProps, acceptedFile, ProgressBar }: any) => (
          <>
            <div className="flex mb-2">
              <button
                className="bg-col2-dark hover:bg-col2 disabled:bg-gray-200 p-2 rounded mr-2"
                type="button"
                {...getRootProps()}
              >
                Browse File
              </button>
              <div className="flex border border-gray-500 grow items-center pl-2 italic">
                {acceptedFile && acceptedFile.name}
              </div>
              <button
                className="bg-col2-dark hover:bg-col2 disabled:bg-gray-200 p-2 rounded ml-2"
                onClick={addItems}
                disabled={!acceptedFile}
              >
                Add Items <ChevronRight />
              </button>
            </div>
            <ProgressBar className="bg-red-500" />
          </>
        )}
      </CSVReader>
      {csvItems?.length > 0 && (
        <div>
          <div className="font-bold">{`${csvItems?.length} New Items`}</div>
          {csvItems?.map((item, k) => (
            <div key={k}>{getItemDisplayName(item?.item)}</div>
          ))}
        </div>
      )}
    </div>
  )
}
