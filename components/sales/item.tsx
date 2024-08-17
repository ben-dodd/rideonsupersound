import dayjs from 'dayjs'

const SalesItem = ({ sale, stockItem }) => {
  return (
    <div
      key={`${sale?.sale_id}-${sale?.item_id}`}
      className="flex py-2 text-xs border-b hover:bg-gradient-to-r from-white via-orange-200 to-white"
    >
      <div className="w-3/12 px-1 md:w-1/12">
        <div className="hidden md:inline">
          {dayjs(sale?.date_sale_closed).format('DD/MM/YYYY')}
        </div>
        <div className="md:hidden">
          {dayjs(sale?.date_sale_closed).format('DD/MM/YY')}
        </div>
      </div>
      <div className="w-1/12 px-1 hidden md:inline">{stockItem?.quantity}</div>
      <div className="w-1/12 px-1">{stockItem?.format}</div>
      <div className="w-2/12 px-1">{stockItem?.artist}</div>
      <div className="w-2/12 md:w-3/12 px-1">{`${stockItem?.title}${
        sale?.is_refunded ? ' [REFUNDED]' : ''
      }`}</div>
      <div
        className={`w-2/12 md:w-1/12 px-1 text-right${
          sale?.is_refunded ? ' line-through' : ''
        }`}
      >
        ${(sale?.total_sell / 100)?.toFixed(2)}
      </div>
      <div
        className={`w-1/12 px-1 text-right hidden md:inline${
          sale?.is_refunded ? ' line-through' : ''
        }`}
      >
        ${((sale?.total_sell - sale?.vendor_cut) / 100)?.toFixed(2)}
      </div>
      <div
        className={`w-2/12 md:w-1/12 px-1 text-right${
          sale?.is_refunded ? ' line-through' : ''
        }`}
      >
        ${(sale?.vendor_cut / 100)?.toFixed(2)}
      </div>
    </div>
  )
}

export default SalesItem
