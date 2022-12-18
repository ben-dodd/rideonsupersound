import MiscItemIcon from '@mui/icons-material/DeviceUnknown'
import GiftCardsIcon from '@mui/icons-material/Redeem'
import SearchIcon from '@mui/icons-material/Search'
import Tooltip from '@mui/material/Tooltip'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'

export default function SellSearchBar({
  search,
  setSearch,
}: {
  search: string
  setSearch: Function
}) {
  const { openView } = useAppStore()
  return (
    <div className="h-search py-2 px-2 mr-2 mb-4 flex w-full">
      <div
        className={`flex flex-1 items-center ring-1 ring-gray-400 w-auto bg-gray-100 hover:bg-gray-200 ${
          search && 'bg-pink-200 hover:bg-pink-300'
        }`}
      >
        <div className="pl-3 pr-1">
          <SearchIcon />
        </div>
        <input
          className="w-full py-1 px-2 outline-none bg-transparent text-2xl"
          value={search || ''}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="SEARCH…"
        />
      </div>
      <div className="flex">
        <button
          className="icon-text-button"
          onClick={() => openView(ViewProps.miscItemDialog)}
        >
          <MiscItemIcon className="mr-1" />
          Misc. Item
        </button>
        <button
          className="icon-text-button"
          onClick={() => openView(ViewProps.giftCardDialog)}
        >
          <GiftCardsIcon className="mr-1" />
          Gift Card
        </button>
      </div>
    </div>
  )
}
