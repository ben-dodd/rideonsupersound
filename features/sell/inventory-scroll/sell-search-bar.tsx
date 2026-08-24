import MiscItemIcon from '@mui/icons-material/DeviceUnknown'
import GiftCardsIcon from '@mui/icons-material/Redeem'
import SearchInput from 'components/inputs/search-input'
import { useAppStore } from 'lib/store'
import { Pages, ViewProps } from 'lib/store/types'
import debounce from 'lodash/debounce'
import { useRef } from 'react'

const SCAN_GAP_THRESHOLD_MS = 50 // tune based on testing with your actual scanner

export default function SellSearchBar() {
  const {
    openView,
    pages: {
      sellPage: { searchBar },
    },
    setSearchBar,
    setPage,
  } = useAppStore()

  const keystrokeTimestamps = useRef<number[]>([])
  const previousLength = useRef(0)

  const debounceSearch = debounce(() => {
    setPage(Pages.sellPage, { isSearching: false })
  }, 1000)

function handleSearch(e) {
  const value = e.target.value
  const now = Date.now()
  const delta = value.length - previousLength.current

  if (value.length === 0 || delta < 0) {
    // Cleared or shortened (backspace) - reset burst tracking
    keystrokeTimestamps.current = [now]
  } else if (delta > 1) {
    // Multiple characters appeared in one event - paste, or a scanner
    // whose keystrokes got batched into a single onChange. Treat as fast input.
    keystrokeTimestamps.current = [now, now, now]
  } else {
    keystrokeTimestamps.current.push(now)
  }
  previousLength.current = value.length

  const gaps = keystrokeTimestamps.current
    .slice(1)
    .map((t, i) => t - keystrokeTimestamps.current[i])

  const isScanInput = delta > 1 || (gaps.length >= 2 && gaps.every((gap) => gap < SCAN_GAP_THRESHOLD_MS))

  setSearchBar(Pages.sellPage, value)
  setPage(Pages.sellPage, { isScanInput })
  debounceSearch()
}

  return (
    <div className="h-headerlg py-2 px-2 flex w-full">
      <SearchInput searchValue={searchBar} handleSearch={handleSearch} />
      <div className="flex">
        <button className="icon-text-button" onClick={() => openView(ViewProps.miscItemDialog)}>
          <MiscItemIcon className="mr-1" />
          Misc. Item
        </button>
        <button className="icon-text-button" onClick={() => openView(ViewProps.giftCardDialog)}>
          <GiftCardsIcon className="mr-1" />
          Gift Voucher
        </button>
      </div>
    </div>
  )
}