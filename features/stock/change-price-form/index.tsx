import TextField from 'components/inputs/text-field'
import { getProfitMargin } from 'lib/functions/pay'

export default function ChangePriceForm({ obj, setObj }) {
  const handleSetPrice = (e) => {
    const value = parseFloat(e.target.value)
    const textboxId = e.target.id
    if (isNaN(value) || (textboxId === 'margin' && value >= 100)) {
      setObj({ ...obj, [textboxId]: e.target.value })
      // Handle invalid input here
      return
    }
    let modifiedPrice = { ...obj }

    switch (textboxId) {
      case 'totalSell':
        modifiedPrice.totalSell = e.target.value
        modifiedPrice.storeCut = (value - parseFloat(obj?.vendorCut)).toFixed(2)
        modifiedPrice.margin = getProfitMargin(modifiedPrice)?.toFixed(1)
        setObj(modifiedPrice)
        break
      case 'vendorCut':
        modifiedPrice.vendorCut = e.target.value
        modifiedPrice.storeCut = (parseFloat(obj?.totalSell) - value).toFixed(2)
        modifiedPrice.margin = getProfitMargin(modifiedPrice)?.toFixed(1)
        setObj(modifiedPrice)
        break
      case 'margin':
        modifiedPrice.margin = e.target.value
        modifiedPrice.totalSell = Math.round(parseFloat(obj?.vendorCut) / (1 - value / 100))?.toFixed(2)
        modifiedPrice.storeCut = (parseFloat(modifiedPrice?.totalSell) - parseFloat(modifiedPrice?.vendorCut)).toFixed(
          2,
        )
        setObj(modifiedPrice)
        break
      case 'storeCut':
        modifiedPrice.storeCut = e.target.value
        modifiedPrice.totalSell = (parseFloat(obj?.vendorCut) + value).toFixed(2)
        modifiedPrice.margin = getProfitMargin(modifiedPrice).toFixed(1)
        setObj(modifiedPrice)
        break
      default:
        // Handle unknown textboxId here
        break
    }
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <TextField
        id="totalSell"
        inputLabel="Total Sell"
        divClass="text-4xl"
        startAdornment="$"
        inputClass="text-center"
        value={obj?.totalSell}
        error={obj?.totalSell !== '' && isNaN(parseFloat(obj?.totalSell))}
        onChange={handleSetPrice}
      />
      <TextField
        id="vendorCut"
        inputLabel="Vendor Cut"
        divClass="text-4xl w-full"
        startAdornment="$"
        inputClass="text-center"
        value={obj?.vendorCut}
        error={obj?.vendorCut !== '' && isNaN(parseFloat(obj?.vendorCut))}
        onChange={handleSetPrice}
      />
      <TextField
        id="margin"
        inputLabel="Margin"
        divClass="text-4xl"
        endAdornment="%"
        inputClass="text-center"
        value={obj?.margin}
        error={(obj?.margin !== '' && isNaN(parseFloat(obj?.margin))) || parseFloat(obj?.margin) >= 100}
        onChange={handleSetPrice}
      />
      <TextField
        id="storeCut"
        inputLabel="Store Cut"
        divClass="text-4xl"
        startAdornment="$"
        inputClass="text-center"
        value={obj?.storeCut}
        error={obj?.storeCut !== '' && isNaN(parseFloat(obj?.storeCut))}
        onChange={handleSetPrice}
      />
    </div>
  )
}
