import dayjs from 'dayjs'
import { useRouter } from 'next/router'

const StockMovementItem = ({ sm }) => {
  const router = useRouter()
  return (
    <div className="list-item-compact text-sm">
      <div className="w-1/12">
        <div className={`w-8`}>
          <img className="object-cover w-full aspect-ratio-square" src={sm?.imageSrc} alt={'Stock item image'} />
        </div>
      </div>
      <div className="font-bold pr-4 text-pink-600 w-2/12">{dayjs(sm?.dateMoved).format('YYYY-MM-DD h:mma')}</div>
      <div className="font-bold w-16 text-blue-800 w-1/12">{sm?.clerkName}</div>
      <div className="uppercase pr-4 w-1/12">{sm?.act}</div>
      <div className="font-bold pr-4 w-1/12">{sm?.quantity} x</div>
      <div className="w-6/12">
        <span className="link-blue" onClick={() => router.push(`/stock/${sm?.stockId}`)}>
          {sm?.itemDisplayName}
        </span>
      </div>
    </div>
  )
}

export default StockMovementItem
