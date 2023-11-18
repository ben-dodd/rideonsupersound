import { arrayToReactSelect, getUniqueValues } from 'lib/utils'
import Select from 'react-select'

const StockFilter = ({ stockList, setSettings, filterSettings }) => {
  const artists = getUniqueValues('artist', stockList)
  console.log(artists?.sort())
  return (
    <div className="flex w-1/2 my-1 ml-2">
      <Select
        className="w-full mx-2"
        style={{ menu: { zIndex: 5000, position: 'absolute' } }}
        classNamePrefix="react-select mt-0"
        isMulti={true}
        isDisabled={!artists}
        isLoading={!artists}
        isClearable={true}
        options={arrayToReactSelect(artists || [])}
        value={filterSettings?.artist}
        onChange={(e) => setSettings('artist', e)}
      />
    </div>
  )
}

export default StockFilter
