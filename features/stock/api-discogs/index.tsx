import SyncIcon from '@mui/icons-material/Sync'
import { useEffect, useState } from 'react'
import { getDiscogsOptions } from 'lib/functions/discogs'
import DiscogsItem from './discogs-item'
import DiscogsOption from './discogs-option'
import { useRouter } from 'next/router'
import { updateStockItem, useStockItem } from 'lib/api/stock'
import { useSWRConfig } from 'swr'
import { parseJSON } from 'lib/utils'
import Loading from 'components/placeholders/loading'

export default function DiscogsPanel() {
  const router = useRouter()
  const { id } = router.query
  const { stockItem } = useStockItem(`${id}`)
  const { item = {} } = stockItem || {}
  const [discogsOptions, setDiscogsOptions] = useState(null)
  const discogsItem = parseJSON(item?.discogsItem, null)
  const [isLoading, setIsLoading] = useState(false)
  const { mutate } = useSWRConfig()

  const handleGetDiscogsOptions = () => {
    setIsLoading(true)
    getDiscogsOptions(item).then((options) => {
      setIsLoading(false)
      setDiscogsOptions(options)
    })
  }

  useEffect(() => {
    if (!Boolean(item?.discogsItem) && (Boolean(item?.artist) || Boolean(item?.title) || Boolean(item?.barcode)))
      handleGetDiscogsOptions()
  }, [])

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
          onClick={() => {
            updateStockItem({ discogsItem: null }, id)
            mutate(`stock/${id}`)
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
                <DiscogsOption key={i} discogsOption={discogsOption} />
              ))}
            </div>
          ) : isLoading ? (
            <div className="w-12">
              <Loading size="sm" />
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
            {
              "To search item on Discogs, fill in the title, artist, and/or barcode and click the 'Refresh Discogs Search' button."
            }
          </div>
        )}
      </div>
      <div />
    </div>
  )
}
// REVIEW make discogs list more searchable
