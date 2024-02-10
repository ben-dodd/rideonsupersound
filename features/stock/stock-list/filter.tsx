import SelectInput from 'components/inputs/select-input'
import { arrayToReactSelect, getUniqueValues } from 'lib/utils'

const StockFilter = ({ stockList, setSettings, filterSettings }) => {
  const artists = getUniqueValues('artist', stockList)
  // console.log(artists?.sort())
  return (
    <div className="flex w-1/2 my-1 ml-2">
      <SelectInput
        // inputLabel="Artist"
        className="w-full mx-2"
        isMulti={true}
        isDisabled={!artists}
        isInitLoading={!artists}
        isClearable={true}
        options={arrayToReactSelect(artists || [])}
        object={filterSettings}
        dbField="artist"
        customEdit={(val) => setSettings('artist', val)}
      />
    </div>
  )
}

export default StockFilter
