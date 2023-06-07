import dayjs from 'dayjs'
import { time } from 'lib/types/date'
import { SaleObject } from 'lib/types/sale'
import { priceCentsString } from 'lib/utils'

export default function ListItem({ sale }: { sale: SaleObject }) {
  return (
    <div className={`flex w-full mb-2`}>
      <div className="w-1/6">{dayjs(sale?.dateSaleOpened).format(time)}</div>
      <div className="w-3/6">{sale?.itemList}</div>
      <div className="w-1/3 text-right">{priceCentsString(sale?.totalPrice)}</div>
    </div>
  )
}
