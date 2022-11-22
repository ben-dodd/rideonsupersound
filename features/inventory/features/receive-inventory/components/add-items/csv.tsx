import { getItemDisplayName } from 'features/inventory/features/display-inventory/lib/functions'
import { receiveStockAtom } from 'lib/atoms'
import { ChevronRight } from '@mui/icons-material'
import { useAtom } from 'jotai'
import { useState } from 'react'
import { useCSVReader } from 'react-papaparse'
import { parseCSVItems } from '../../lib/functions'

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
        onUploadAccepted={(results: any) => setCSVItems(parseCSVItems(results))}
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
