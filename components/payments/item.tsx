import dayjs from 'dayjs'

const PaymentItem = ({ pay }) => {
  return (
    <div
      key={`${pay?.id}`}
      className="flex py-2 text-xs border-b hover:bg-gradient-to-r from-white via-orange-200 to-white"
    >
      <div className="w-2/12 md:w-1/12 px-1">
        <div className="hidden md:inline">
          {dayjs(pay?.date).format('DD/MM/YYYY')}
        </div>
        <div className="md:hidden">{dayjs(pay?.date).format('DD/MM/YY')}</div>
      </div>
      <div className="w-1/6 px-1 pr-4 text-right">
        ${(pay?.amount / 100)?.toFixed(2)}
      </div>
      <div className="w-1/6 px-1 uppercase">{pay?.type}</div>
      <div className="w-4/12 md:w-5/12 px-1">{pay?.note}</div>
    </div>
  )
}

export default PaymentItem
