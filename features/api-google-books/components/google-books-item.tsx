import { andList } from '@/lib/utils'
import dayjs from 'dayjs'
import { GoogleBooksItem } from '../lib/types'

interface googleProps {
  googleBooksItem: GoogleBooksItem
}

export default function GoogleBooksItemDisplay({
  googleBooksItem,
}: googleProps) {
  const volumeInfo = googleBooksItem?.volumeInfo
  return (
    <div>
      <div className="w-32">
        <div className="w-32 h-32 relative">
          <img
            className="object-cover absolute"
            src={
              volumeInfo?.imageLinks?.thumbnail ||
              `${process.env.NEXT_PUBLIC_RESOURCE_URL}img/default.png`
            }
            alt={volumeInfo?.title || 'Book cover art'}
          />
        </div>
      </div>
      <div className="font-bold">{volumeInfo?.title}</div>
      <div>{volumeInfo?.subtitle}</div>
      <div>{andList(volumeInfo?.authors)}</div>
      <div>{volumeInfo?.categories?.join(', ')}</div>
      <div>
        {volumeInfo?.publisher || ''}
        {volumeInfo?.publisher && volumeInfo?.pageCount ? ', ' : ''}
        {volumeInfo?.pageCount ? `${volumeInfo?.pageCount}pp.` : ''}
      </div>
      {volumeInfo?.publishedDate && (
        <div>{dayjs(volumeInfo?.publishedDate).format('D MMMM YYYY')}</div>
      )}
      <div style={{ marginBottom: 16, fontStyle: 'italic' }}>
        {volumeInfo?.description}
      </div>
      <div>{volumeInfo?.categories?.join(', ')}</div>
      <div>{`Print Type: ${volumeInfo?.printType || ''}`}</div>
      <div>{`Maturity Rating: ${volumeInfo?.maturityRating || ''}`}</div>
      <div>{`Language: ${volumeInfo?.language || ''}`}</div>
      {googleBooksItem?.saleInfo?.saleability !== 'NOT_FOR_SALE' && (
        <>
          <div>
            {`List Price: $${googleBooksItem?.saleInfo?.listPrice?.amount || ''}
    ${googleBooksItem?.saleInfo?.listPrice?.currencyCode}`}
          </div>
          <div>
            {`Retail Price: $${
              googleBooksItem?.saleInfo?.retailPrice?.amount || ''
            }
              ${googleBooksItem?.saleInfo?.retailPrice?.currencyCode}
              `}
          </div>
        </>
      )}
    </div>
  )
}
