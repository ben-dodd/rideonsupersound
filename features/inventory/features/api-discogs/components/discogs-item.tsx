import { getUSDExchangeRate } from 'lib/api/external'
import { StockObject } from 'lib/types'
import { andList } from 'lib/utils'
import { useEffect, useState } from 'react'
import ReactPlayer from 'react-player'
import { DiscogsItem } from '../lib/types'

interface discogsProps {
  discogsItem: DiscogsItem
  item: StockObject
}

export default function DiscogsItemScreen({ discogsItem, item }: discogsProps) {
  // Set USD to NZD exchange rate (lowest prices is in USD)
  const [exchangeRate, setExchangeRate] = useState<number>(1)
  useEffect(() => {
    getUSDExchangeRate().then((exchangeRate) => setExchangeRate(exchangeRate))
  }, [])

  return (
    <div className="flex">
      <div className="w-1/2">
        <div className="text-xl">
          <div className="font-bold">
            {andList(discogsItem?.artists?.map((e: any) => e.name))}
          </div>
          <div className="font-bold italic">
            {`${discogsItem?.title}
            ${discogsItem?.year ? ` (${discogsItem?.year})` : ''}`}
          </div>
        </div>
        <div className="text-md">{discogsItem?.format?.join(', ')}</div>
        <div className="pr-1 italic">
          {`${discogsItem?.label[0] || ''}${
            discogsItem?.label && discogsItem?.country ? ', ' : ''
          }${discogsItem?.country || ''}`}
        </div>
        <div className="pt-4 text-sm">
          {discogsItem?.genres?.concat(discogsItem?.styles || []).join(', ')}
        </div>
        <div className="pt-2" />
        <div className="p-2">
          {discogsItem?.barcode?.length > 0 && (
            <div>
              <div className="font-bold">Barcodes</div>
              <div className="text-sm">
                {discogsItem?.barcode?.map((barcode: string, i: number) => (
                  <div key={i}>{barcode}</div>
                ))}
              </div>
            </div>
          )}

          {discogsItem?.identifiers?.length > 0 && (
            <div>
              <div className="pt-2 pb-1 font-bold">Identifiers</div>
              <div className="text-sm">
                {discogsItem?.identifiers?.map((id: any, i: number) => (
                  <div key={i}>
                    <b>{id?.type}:</b>
                    {` ${id?.value}${
                      id?.description ? ` (${id.description})` : ''
                    }`}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="pt-2" />
        <div className="p-2 bg-primary-light rounded">
          <div className="font-bold">Suggested Price</div>
          <div>
            {!item?.isNew && !item?.cond
              ? 'Set condition of item to get suggested price.'
              : discogsItem?.priceSuggestions &&
                discogsItem?.priceSuggestions[
                  item?.isNew ? 'Mint (M)' : item?.cond || 'Good (G)'
                ]?.value
              ? `$${parseFloat(
                  discogsItem?.priceSuggestions[
                    item?.isNew ? 'Mint (M)' : item?.cond || 'Good (G)'
                  ]?.value
                )?.toFixed(2)} NZD (${
                  item?.isNew ? 'Mint (M)' : item?.cond || 'Good (G)'
                } condition)`
              : 'No data'}
          </div>
        </div>
        <div className="p-2 bg-secondary-light rounded mt-2">
          <div className="font-bold">Lowest Price on Marketplace</div>
          <div>
            {discogsItem?.lowest_price
              ? `$${(discogsItem?.lowest_price * exchangeRate)?.toFixed(2)} NZD`
              : 'No Data'}
          </div>
        </div>
        <div className="p-2">
          {discogsItem?.tracklist?.map((track: any, i: number) => (
            <div className="flex justify-between" key={i}>
              <div>
                <b>{track?.position}</b> {track?.title}
              </div>
              <div>{track?.duration}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-1/2">
        {discogsItem?.videos?.map((vid: any, i: number) => (
          <ReactPlayer
            className="p-2"
            url={vid?.uri}
            key={i}
            controls={true}
            width={'100%'}
          />
        ))}
      </div>
    </div>
  )
}
