import { priceCentsString } from 'lib/utils'

const GrandTotal = ({ grandTotal }) => {
  return (
    <div className="bg-gray-200 w-full text-right font-bold text-lg border-t-2 px-2 shadow-md">{`GRAND TOTAL ${priceCentsString(
      grandTotal,
    )}`}</div>
  )
}

export default GrandTotal
