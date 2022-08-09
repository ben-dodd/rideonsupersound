import { clerkAtom } from '@lib/atoms'
import { saveSystemLog } from '@lib/db-functions'
import { StockObject } from '@lib/types'
import { useAtom } from 'jotai'
import { setDiscogsItemToStockItem } from '../lib/functions'
import { DiscogsItem } from '../lib/types'

interface discogsProps {
  discogsOption: DiscogsItem
  item: StockObject
  setItem: Function
  overrideItemDetails?: boolean
}

export default function DiscogsOption({
  discogsOption,
  item,
  setItem,
  overrideItemDetails = false,
}: discogsProps) {
  const [clerk] = useAtom(clerkAtom)
  const handleDiscogsOptionClick = async () => {
    saveSystemLog(`Discogs option clicked - ${discogsOption?.id}`, clerk?.id)
    setDiscogsItemToStockItem(discogsOption, item, overrideItemDetails).then(
      (item) => setItem(item)
    )
  }
  return (
    <div
      className="flex item-start cursor-pointer p-2 mb-8 hover:bg-gray-300"
      onClick={handleDiscogsOptionClick}
    >
      <div className="w-32">
        <div className="w-32 h-32 relative">
          <img
            className="object-cover absolute"
            src={
              discogsOption?.thumb ||
              `${process.env.NEXT_PUBLIC_RESOURCE_URL}img/default.png`
            }
            alt={discogsOption?.title || 'Album art'}
          />
        </div>
      </div>
      <div className="w-2/3 ml-6">
        <div className="font-bold">{discogsOption?.title || ''}</div>
        <div>{discogsOption?.format?.join(', ')}</div>
        <div>{discogsOption?.country || ''}</div>
        <div>{discogsOption?.year || ''}</div>
        {discogsOption?.barcode?.length > 0 && (
          <div>
            <div className="pt-2 pb-1 font-bold">Barcodes</div>
            <div className="text-sm">
              {discogsOption?.barcode?.map((barcode: string, i: number) => (
                <div key={i}>{barcode}</div>
              ))}
            </div>
          </div>
        )}
        {discogsOption?.identifiers?.length > 0 && (
          <div>
            <div className="pt-2 pb-1 font-bold">Identifiers</div>
            <div className="text-sm">
              {discogsOption?.identifiers?.map((id: any) => (
                <div key={id?.value}>
                  <b>{id?.type}:</b>
                  {` ${id?.value}${
                    id?.description ? ` (${id?.description})` : ''
                  }`}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
