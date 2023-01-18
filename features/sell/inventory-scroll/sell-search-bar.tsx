import MiscItemIcon from '@mui/icons-material/DeviceUnknown'
import GiftCardsIcon from '@mui/icons-material/Redeem'
import SearchInput from 'components/inputs/search-input'
// import Tooltip from '@mui/material/Tooltip'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'
import debounce from 'lodash/debounce'

export default function SellSearchBar() {
  const { openView, sellSearchBar, setSellSearchBar, toggleSellSearchingOff } = useAppStore()
  const debounceSearch = debounce(() => {
    toggleSellSearchingOff()
  }, 1000) // delay of 1 seconds

  function handleSearch(e) {
    setSellSearchBar(e.target.value)
    debounceSearch()
  }

  return (
    <div className="h-header py-2 px-2 flex w-full">
      <SearchInput searchValue={sellSearchBar} handleSearch={handleSearch} />
      <div className="flex">
        <button className="icon-text-button" onClick={() => openView(ViewProps.miscItemDialog)}>
          <MiscItemIcon className="mr-1" />
          Misc. Item
        </button>
        <button className="icon-text-button" onClick={() => openView(ViewProps.giftCardDialog)}>
          <GiftCardsIcon className="mr-1" />
          Gift Card
        </button>
      </div>
    </div>
  )
}
