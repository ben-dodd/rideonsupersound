import SyncIcon from '@mui/icons-material/Sync'
import { useEffect, useState } from 'react'
import { getGoogleBooksOptionsByItem } from 'lib/functions/googleBooks'
import GoogleBooksItem from './google-books-item'
import GoogleBooksOption from './google-books-option'
import { useRouter } from 'next/router'
import { updateStockItem, useStockItem } from 'lib/api/stock'
import { useSWRConfig } from 'swr'
import { parseJSON } from 'lib/utils'

export default function GoogleBooksPanel() {
  const router = useRouter()
  const { id } = router.query
  const { stockItem } = useStockItem(`${id}`)
  const { item = {} } = stockItem || {}
  const [googleBooksOptions, setGoogleBooksOptions] = useState([])
  const googleBooksItem = parseJSON(item?.googleBooksItem, null)
  const { mutate } = useSWRConfig()

  const handleGetGoogleBooksOptions = async () => {
    const options = await getGoogleBooksOptionsByItem(item)
    setGoogleBooksOptions(options)
  }

  useEffect(() => {
    if (!Boolean(item?.googleBooksItem) && (Boolean(item?.artist) || Boolean(item?.title)))
      handleGetGoogleBooksOptions()
  }, [])

  console.log(googleBooksOptions)
  console.log(googleBooksItem)

  return (
    <div className="flex flex-col h-inventory">
      <div className="flex justify-between px-2">
        <img
          src={`${process.env.NEXT_PUBLIC_RESOURCE_URL}img/google-books-logo.png`}
          alt="GoogleBooks Logo"
          width="100px"
          height="50px"
        />
        <button
          className="icon-text-button"
          onClick={() => {
            updateStockItem({ googleBooksItem: null }, id)
            mutate(`stock/${id}`)
            handleGetGoogleBooksOptions()
          }}
        >
          <SyncIcon /> Refresh GoogleBooks Search
        </button>
      </div>
      <div className="flex-1 overflow-y-auto pt-4 mx-4">
        {googleBooksItem ? (
          <GoogleBooksItem googleBooksItem={googleBooksItem} />
        ) : googleBooksOptions ? (
          <div>
            {googleBooksOptions.map((googleBooksOption: any, i: number) => (
              <GoogleBooksOption key={i} googleBooksOption={googleBooksOption} />
            ))}
          </div>
        ) : (
          <div />
        )}
      </div>
      <div />
    </div>
  )
}
