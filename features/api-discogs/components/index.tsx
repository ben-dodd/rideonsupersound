import { clerkAtom } from '@/lib/atoms'
import { saveSystemLog } from '@/lib/db-functions'
import { StockObject } from '@/lib/types'
import SyncIcon from '@mui/icons-material/Sync'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { getDiscogsOptions } from '../lib/functions'
import DiscogsItem from './discogs-item'
import DiscogsOption from './discogs-option'

interface inventoryProps {
  item: StockObject
  setItem: Function
  disabled?: boolean
}

export default function DiscogsPanel({
  item,
  setItem,
  disabled,
}: inventoryProps) {
  // State
  const [discogsOptions, setDiscogsOptions] = useState(null)
  const [clerk] = useAtom(clerkAtom)

  // Constants
  const discogsItem = item?.discogsItem || null

  // Load
  useEffect(() => {
    if (
      !Boolean(item?.discogsItem) &&
      (Boolean(item?.artist) || Boolean(item?.title) || Boolean(item?.barcode))
    )
      handleGetDiscogsOptions()
  }, [])

  const handleGetDiscogsOptions = async () => {
    const options = await getDiscogsOptions(item)
    setDiscogsOptions(options)
  }

  return (
    <div className="flex flex-col h-inventory">
      <div className="flex justify-between px-2">
        <img
          src={`${process.env.NEXT_PUBLIC_RESOURCE_URL}img/discogs-logo.png`}
          alt="Discogs Logo"
          width="100px"
          height="50px"
        />
        <button
          className="icon-text-button"
          disabled={disabled}
          onClick={() => {
            saveSystemLog('Discogs Panel - sync clicked.', clerk?.id)
            setItem({ ...item, discogsItem: null })
            handleGetDiscogsOptions()
          }}
        >
          <SyncIcon /> Refresh Discogs Search
        </button>
      </div>
      <div className="flex-1 overflow-y-auto pt-4 mx-4">
        {discogsItem ? (
          <DiscogsItem discogsItem={discogsItem} item={item} />
        ) : discogsOptions ? (
          discogsOptions.length > 0 ? (
            <div>
              {discogsOptions.map((discogsOption: any, i: number) => (
                <DiscogsOption
                  key={i}
                  discogsOption={discogsOption}
                  item={item}
                  setItem={setItem}
                />
              ))}
            </div>
          ) : (
            <div className="text-xl p-6">
              No items found on Discogs...
              <br />
              Check the title and artist name.
            </div>
          )
        ) : (
          <div className="text-xl p-6">
            To search item on Discogs, fill in the title, artist, and/or barcode
            and click the "Refresh Discogs Search" button.
          </div>
        )}
      </div>
      <div />
    </div>
  )
}
// REVIEW make discogs list more searchable
