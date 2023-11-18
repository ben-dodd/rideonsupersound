import { andList, priceDollarsString } from 'lib/utils'
import dayjs from 'dayjs'
import { GoogleBooksItem } from 'lib/types/googleBooks'
import { dateSimple } from 'lib/types/date'

interface googleProps {
  googleBooksItem: GoogleBooksItem
}

export default function GoogleBooksItemDisplay({ googleBooksItem }: googleProps) {
  const volumeInfo = googleBooksItem?.volumeInfo
  return (
    <div className="flex overflow-y-scroll h-dialog">
      <div className="w-1/2">
        <div className="w-32 pb-2">
          <img
            // className="object-cover"
            src={volumeInfo?.imageLinks?.thumbnail || `${process.env.NEXT_PUBLIC_RESOURCE_URL}img/default.png`}
            alt={volumeInfo?.title || 'Book cover art'}
          />
        </div>
        <div className="font-bold py-2">{volumeInfo?.title}</div>
        <div>{volumeInfo?.subtitle}</div>
        <div>{andList(volumeInfo?.authors)}</div>
        <div>{volumeInfo?.categories?.join(', ')}</div>
        <div>
          {volumeInfo?.publisher || ''}
          {volumeInfo?.publisher && volumeInfo?.pageCount ? ', ' : ''}
          {volumeInfo?.pageCount ? `${volumeInfo?.pageCount}pp.` : ''}
        </div>
        {volumeInfo?.publishedDate && <div>{dayjs(volumeInfo?.publishedDate).format(dateSimple)}</div>}
        <div style={{ marginBottom: 16, fontStyle: 'italic' }}>{volumeInfo?.description}</div>
        <div>{volumeInfo?.categories?.join(', ')}</div>
        <div>{`Print Type: ${volumeInfo?.printType || ''}`}</div>
        <div>{`Maturity Rating: ${volumeInfo?.maturityRating || ''}`}</div>
        <div>{`Language: ${volumeInfo?.language || ''}`}</div>
        {googleBooksItem?.saleInfo?.saleability !== 'NOT_FOR_SALE' && (
          <>
            <div>
              {`List Price: ${priceDollarsString(googleBooksItem?.saleInfo?.listPrice?.amount)}
    ${googleBooksItem?.saleInfo?.listPrice?.currencyCode}`}
            </div>
            <div>
              {`Retail Price: ${priceDollarsString(googleBooksItem?.saleInfo?.retailPrice?.amount)}
              ${googleBooksItem?.saleInfo?.retailPrice?.currencyCode}
              `}
            </div>
          </>
        )}
      </div>
    </div>
  )
}