import { getItemDisplayName } from 'lib/functions/displayInventory'
import { ChevronRight } from '@mui/icons-material'
import { useState } from 'react'
import { useCSVReader } from 'react-papaparse'
import { getDefaultReceiveItem, parseCSVItems } from 'lib/functions/receiveStock'
import { useAppStore } from 'lib/store'

export default function Csv() {
  const { CSVReader } = useCSVReader()
  const { batchReceiveSession, setBatchReceiveSession } = useAppStore()
  const [csvItems, setCSVItems] = useState([])
  const defaultItem = getDefaultReceiveItem(batchReceiveSession)
  const addItems = () => {
    setBatchReceiveSession({
      batchList: batchReceiveSession?.batchList ? [...batchReceiveSession?.batchList, ...csvItems] : csvItems,
    })
    setCSVItems([])
  }
  return (
    <div>
      <div className="mb-2">
        <ol>
          <li>
            <a
              className="link-blue mr-1"
              href="https://docs.google.com/spreadsheets/d/1xQSRFFkbYJBi-4-d2eDApVyUC3ym2we9Uh4nCumt_bI/edit?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
            >
              Click here
            </a>
            {'and add your items to the Google Sheet.'}
          </li>
          <li>
            {"Once you're done. Click"}
            <i className="ml-1">File | Download | Comma-separated values (*.csv)</i>
          </li>
          <li>Upload the CSV file using the button below.</li>
        </ol>
      </div>
      <CSVReader
        onUploadAccepted={(results: any) => setCSVItems(parseCSVItems(results, defaultItem))}
        config={{ header: true, skipEmptyLines: true }}
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
              <div className="flex border border-gray-500 grow items-center pl-2 italic mr-2">
                {acceptedFile && acceptedFile.name}
              </div>
              <button className="prominent-button" onClick={addItems} disabled={csvItems?.length === 0}>
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
          {csvItems?.map((csvItem, k) => (
            <div key={k}>{getItemDisplayName(csvItem?.item)}</div>
          ))}
        </div>
      )}
    </div>
  )
}
