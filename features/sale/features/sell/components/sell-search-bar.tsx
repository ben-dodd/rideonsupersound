import { sellSearchBarAtom, viewAtom } from 'lib/atoms'
import MiscItemIcon from '@mui/icons-material/DeviceUnknown'
import GiftCardsIcon from '@mui/icons-material/Redeem'
import SearchIcon from '@mui/icons-material/Search'
import Tooltip from '@mui/material/Tooltip'
import { useAtom } from 'jotai'

export default function SellSearchBar() {
  const [search, setSearch] = useAtom(sellSearchBarAtom)
  const [view, setView] = useAtom(viewAtom)
  // REVIEW add clear icon to search bar

  return (
    <div className="h-search py-2 px-2 mr-2 mb-4 flex">
      <Tooltip title="Search by artist, title, SKU, genre, and many more. To add a Misc. Item or a Gift Card, just type that in.">
        <div
          className={`flex items-center ring-1 ring-gray-400 w-auto bg-gray-100 hover:bg-gray-200 ${
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
      </Tooltip>
      <button
        className="icon-text-button"
        onClick={() => setView({ ...view, miscItemDialog: true })}
      >
        <MiscItemIcon className="mr-1" />
        Misc. Item
      </button>
      <button
        className="icon-text-button"
        onClick={() => setView({ ...view, giftCardDialog: true })}
      >
        <GiftCardsIcon className="mr-1" />
        Gift Card
      </button>
    </div>
  )
}
