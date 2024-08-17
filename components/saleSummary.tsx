const SaleSummary = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  totalTake,
  totalPaid,
}) => {
  return (
    <div className="mb-2 md:flex md:justify-between">
      <div className="flex items-start mb-2">
        <div className="font-bold mr-2">FROM</div>
        <input
          type="date"
          onChange={(e) => setStartDate(e.target.value)}
          value={startDate}
        />
        <div className="font-bold mx-2">TO</div>
        <input
          type="date"
          onChange={(e) => setEndDate(e.target.value)}
          value={endDate}
        />
      </div>
      <div className="w-full text-sm font-bold text-right md:w-2/5">
        <div className="w-full flex">
          <div className="p-2 w-3/4 whitespace-nowrap bg-gradient-to-r from-white to-gray-300 hover:to-red-300">
            TOTAL TAKE TO DATE
          </div>
          <div className="pl-2 py-2 w-1/12 text-left">$</div>
          <div className="py-2 w-2/12">{(totalTake / 100)?.toFixed(2)}</div>
        </div>
        <div className="w-full flex">
          <div className="p-2 w-3/4 whitespace-nowrap bg-gradient-to-r from-white to-gray-200 hover:to-orange-200">
            TOTAL PAID TO DATE
          </div>
          <div className="pl-2 py-2 w-1/12 text-left">$</div>
          <div className="py-2 w-2/12">{(totalPaid / 100)?.toFixed(2)}</div>
        </div>
        <div className="w-full flex">
          <div className="p-2 w-3/4 whitespace-nowrap bg-gradient-to-r from-white to-gray-100 hover:to-green-100">
            PAYMENT OWING ►
          </div>
          <div className="pl-2 py-2 w-1/12 text-left">$</div>
          <div className="py-2 w-2/12">
            {((totalTake - totalPaid) / 100)?.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SaleSummary
