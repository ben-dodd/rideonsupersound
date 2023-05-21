import { Delete } from '@mui/icons-material'
import TextField from 'components/inputs/text-field'
import { getImageSrc, getItemDisplayName, getItemSku } from 'lib/functions/displayInventory'

const LabelPrintListItem = ({ printItem, changePrintQuantity, deletePrintItem }) => {
  const { item = {} } = printItem || {}
  console.log(printItem)
  return (
    <div className="flex justify-between my-2 border-b w-full">
      <div className="flex">
        <div className="w-20">
          <div className="w-20 h-20 relative">
            <img className="object-cover absolute" src={getImageSrc(item)} alt={item?.title || 'Stock image'} />
            <div className="absolute w-20 h-8 bg-opacity-50 bg-black text-white text-sm flex justify-center items-center">
              {getItemSku(item)}
            </div>
          </div>
        </div>
        <div className="ml-2">
          {getItemDisplayName(item)}
          <div className={`mt-2 text-sm font-bold ${item?.quantity <= 0 ? 'text-tertiary' : 'text-black'}`}>{`${
            item?.quantity || 0
          } in stock.`}</div>
        </div>
      </div>
      <div className="flex items-center justify-end">
        <TextField
          className="w-16 mr-6"
          inputType="number"
          min={0}
          valueNum={printItem?.quantity}
          onChange={changePrintQuantity}
        />
        <button className="bg-gray-200 hover:bg-gray-300 p-1 w-10 h-10 rounded-full mr-8" onClick={deletePrintItem}>
          <Delete />
        </button>
      </div>
    </div>
  )
}

export default LabelPrintListItem
