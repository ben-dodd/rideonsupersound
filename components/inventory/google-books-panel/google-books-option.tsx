import { clerkAtom } from '@/lib/atoms'
import { andList } from '@/lib/data-functions'
import { saveSystemLog } from '@/lib/db-functions'
import { GoogleBooksItem, StockObject } from '@/lib/types'
import dayjs from 'dayjs'
import { useAtom } from 'jotai'
import Image from 'next/image'
export default function GoogleBooksOption({
  opt,
  item,
  setItem,
  override = false,
}: {
  opt: GoogleBooksItem
  item: StockObject
  setItem: Function
  override?: boolean
}) {
  const [clerk] = useAtom(clerkAtom)
  const handleGoogleBooksOptionClick = async () => {
    saveSystemLog(`Googlebooks option clicked - ${opt?.id}`, clerk?.id)
    if (override)
      item = {
        ...item,
        artist: opt?.volumeInfo?.authors?.join(', '),
        barcode: opt?.volumeInfo?.industryIdentifiers?.[0]?.identifier,
        country: opt?.saleInfo?.country,
        description: opt?.volumeInfo?.description,
        format: opt?.volumeInfo?.printType,
        media: 'Literature',
        section: opt?.volumeInfo?.mainCategory,
        genre: opt?.volumeInfo?.categories,
        title: opt?.volumeInfo?.title,
        release_year: opt?.volumeInfo?.publishedDate?.toString(),
      }
    setItem({
      ...item,
      image_url: opt?.volumeInfo?.imageLinks?.thumbnail || null,
      googleBooksItem: opt,
    })
  }
  return (
    <div
      className="flex item-start cursor-pointer p-2 mb-8 hover:bg-gray-300"
      onClick={handleGoogleBooksOptionClick}
    >
      <div className="w-32">
        <div className="w-32 h-32 relative">
          <img
            className="object-cover absolute"
            src={
              opt?.volumeInfo?.imageLinks?.smallThumbnail ||
              `${process.env.NEXT_PUBLIC_RESOURCE_URL}img/default.png`
            }
            alt={opt?.volumeInfo?.title || 'Book cover art'}
          />
          {/*<div className="absolute w-32 h-8 bg-opacity-50 bg-black text-white flex justify-center items-center">
        {getItemSku(item)}
      </div>*/}
        </div>
      </div>
      <div className="w-2/3 ml-6">
        <div className="font-bold">{opt?.volumeInfo?.title || ''}</div>
        <div>{andList(opt?.volumeInfo?.authors || [])}</div>
        <div>
          {opt?.volumeInfo?.publisher || ''}
          {opt?.volumeInfo?.pageCount
            ? `, ${opt?.volumeInfo?.pageCount}pp.`
            : ''}
        </div>
        {opt?.volumeInfo?.publishedDate && (
          <div>
            {dayjs(opt?.volumeInfo?.publishedDate).format('D MMMM YYYY')}
          </div>
        )}
      </div>
    </div>
  )
}
