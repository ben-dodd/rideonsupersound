import dayjs from 'dayjs'
import { SaleObject } from 'lib/types'

type ListItemProps = {
  sale: SaleObject
}

export default function ListItem({ sale }: ListItemProps) {
  return (
    <div className={`flex w-full mb-2`}>
      <div className="w-1/6">
        {dayjs(sale?.date_sale_opened).format('h:mm A')}
      </div>
      <div className="w-3/6">{sale?.item_list}</div>
      <div className="w-1/3 text-right">{`$${(sale?.total_price / 100)?.toFixed(
        2
      )}`}</div>
    </div>
  )
}
