import { andList } from '@/lib/utils'
import dayjs from 'dayjs'

export default function GoogleBooksOption({
  googleBooksOption,
  handleGoogleBooksOptionClick,
}) {
  const volumeInfo = googleBooksOption.volumeInfo
  return (
    <div
      className="flex item-start cursor-pointer p-2 mb-2 hover:bg-gray-300"
      onClick={() => handleGoogleBooksOptionClick(googleBooksOption)}
    >
      <div className="flex w-32 h-32">
        <img
          src={
            volumeInfo?.imageLinks?.smallThumbnail ||
            `${process.env.NEXT_PUBLIC_RESOURCE_URL}img/default.png`
          }
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
        {volumeInfo?.publishedDate && (
          <div>{dayjs(volumeInfo?.publishedDate).format('D MMMM YYYY')}</div>
        )}
      </div>
    </div>
  )
}
