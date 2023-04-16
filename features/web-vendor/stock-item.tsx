import { getImageSrc, getItemSku } from 'lib/functions/displayInventory'
import { priceCentsString } from 'lib/utils'
import { useRouter } from 'next/router'

export default function StockItem({ stockItem, size = 'lg' }) {
  const router = useRouter()
  const { item = {}, price = {}, quantities = {} } = stockItem || {}
  return (
    <div className={`flex w-full mb-2 pr-2 text-black ${quantities?.inStock < 1 ? 'bg-pink-100' : 'bg-gray-200'}`}>
      <div className={`${size === 'sm' ? 'w-20' : size === 'md' ? 'w-24' : 'w-32'}`}>
        <img
          className={`object-cover ${size === 'sm' ? 'h-20' : size === 'md' ? 'h-24' : 'h-32'} ${
            quantities?.inStock < 1 ? ' opacity-50' : ''
          }`}
          src={getImageSrc(item)}
          alt={item?.title || 'Stock image'}
        />
        <div
          className={`font-bold text-center bg-black text-white ${
            size === 'sm' ? 'w-20 text-xs' : size === 'md' ? 'w-24 text-sm' : 'w-32 text-lg'
          }`}
        >
          {getItemSku(item)}
        </div>
      </div>
      <div className="flex flex-col justify-between pl-2 w-full">
        <div>
          <div className="flex justify-between border-b items-center border-gray-400">
            <div>
              <div className="font-bold text-md link-blue" onClick={() => router.push(`/stock/${item?.id}`)}>{`${
                item?.title || 'Untitled'
              }`}</div>
              <div className="text-md">{`${item?.artist || 'Untitled'}`}</div>
            </div>
          </div>
          <div className="text-sm text-green-800">{`${item?.genre ? `${item.genre} / ` : ''}${item?.format} [${
            item?.isNew ? 'NEW' : item?.cond?.toUpperCase() || 'USED'
          }]`}</div>
        </div>

        <div className="flex justify-between items-end">
          <div className={`text-md ${quantities?.inStock < 1 && 'text-red-500'}`}>{`${quantities?.inStock} in stock${
            quantities?.hold > 0 ? `, ${quantities?.hold} on hold` : ''
          }${quantities?.layby > 0 ? `, ${quantities?.layby} on layby` : ''}`}</div>
          <div className="text-xl pr-2">{priceCentsString(price?.totalSell)}</div>
        </div>
      </div>
    </div>
  )
}
