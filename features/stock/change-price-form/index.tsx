import TextField from 'components/inputs/text-field'
import { getPriceEdits } from 'lib/functions/stock'

export default function ChangePriceForm({ obj, setObj, className }: { obj; setObj; className?: string }) {
  const handleSetPrice = (e) => {
    // const value = parseFloat(e.target.value)
    // const textboxId = e.target.id
    // if (isNaN(value) || (textboxId === 'margin' && value >= 100)) {
    //   setObj({ ...obj, [textboxId]: e.target.value })
    //   // Handle invalid input here
    //   return ''
    // }
    let modifiedPrice = getPriceEdits(obj, e.target.id, e.target.value)
    setObj(modifiedPrice)
  }

  return (
    <div className={className || 'grid grid-cols-2 gap-4'}>
      <TextField
        id="totalSell"
        inputLabel="Total Sell"
        divClass="text-4xl"
        startAdornment="$"
        inputClass="text-center"
        value={obj?.totalSell || ''}
        error={obj?.totalSell && isNaN(parseFloat(obj?.totalSell))}
        onChange={handleSetPrice}
      />
      <TextField
        id="vendorCut"
        inputLabel="Vendor Cut"
        divClass="text-4xl w-full"
        startAdornment="$"
        inputClass="text-center"
        value={obj?.vendorCut || ''}
        error={obj?.vendorCut && isNaN(parseFloat(obj?.vendorCut))}
        onChange={handleSetPrice}
      />
      <TextField
        id="margin"
        inputLabel="Margin"
        divClass="text-4xl"
        endAdornment="%"
        inputClass="text-center"
        value={obj?.margin || ''}
        error={(obj?.margin && isNaN(parseFloat(obj?.margin))) || parseFloat(obj?.margin) > 100}
        onChange={handleSetPrice}
      />
      <TextField
        id="storeCut"
        inputLabel="Store Cut"
        divClass="text-4xl"
        startAdornment="$"
        inputClass="text-center"
        value={obj?.storeCut || ''}
        error={obj?.storeCut && isNaN(parseFloat(obj?.storeCut))}
        onChange={handleSetPrice}
      />
    </div>
  )
}
