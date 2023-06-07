import { andList } from 'lib/utils'
import dayjs from 'dayjs'
import { GoogleBooksItem } from 'lib/types/googleBooks'
import { useRouter } from 'next/router'
import { useSWRConfig } from 'swr'
import { useClerk } from 'lib/api/clerk'
import { createStockItem, updateStockItem } from 'lib/api/stock'
import { setGoogleBooksItemToStockItem } from 'lib/functions/googleBooks'
import { dateSimple } from 'lib/types/date'

export default function GoogleBooksOption({
  googleBooksOption,
  overrideItemDetails = false,
  isNew = false,
  vendorId,
  setItem,
}: {
  googleBooksOption: GoogleBooksItem
  overrideItemDetails?: boolean
  isNew?: boolean
  vendorId?: number
  setItem?: Function
}) {
  const router = useRouter()
  const { id } = router.query
  const { mutate } = useSWRConfig()
  const { clerk } = useClerk()
  const handleGoogleBooksOptionClick = async () => {
    setGoogleBooksItemToStockItem(googleBooksOption, overrideItemDetails)
      .then(async (update) => {
        console.log(update)
        let newId = id
        if (isNew) {
          const newItem = await createStockItem({ ...update, vendorId }, clerk?.id)
          setItem(newItem)
          newId = newItem?.id
        } else {
          await updateStockItem(update, id)
        }
        console.log('New ID', newId)
        return newId
      })
      .then(() => mutate(`stock/${id}`))
  }
  const volumeInfo = googleBooksOption.volumeInfo
  return (
    <div className="flex item-start cursor-pointer p-2 mb-2 hover:bg-gray-300" onClick={handleGoogleBooksOptionClick}>
      <div className="flex w-32 h-32">
        <img
          src={volumeInfo?.imageLinks?.smallThumbnail || `${process.env.NEXT_PUBLIC_RESOURCE_URL}img/default.png`}
          alt={volumeInfo?.title || 'Book cover art'}
        />
      </div>
      <div className="w-2/3 ml-6">
        <div className="font-bold">
          {volumeInfo?.title || ''}
          {volumeInfo?.subtitle ? <i> {volumeInfo.subtitle}</i> : ''}
        </div>
        <div>{andList(volumeInfo?.authors || [])}</div>
        <div>
          <b>{volumeInfo?.publisher ? `${volumeInfo.publisher} ` : ''}</b>
          {volumeInfo?.printType || ''}
          <i>{volumeInfo?.pageCount ? ` ${volumeInfo?.pageCount}pp.` : ''}</i>
        </div>
        {volumeInfo?.publishedDate && <div>{dayjs(volumeInfo?.publishedDate).format(dateSimple)}</div>}
      </div>
    </div>
  )
}
