import { Search } from '@mui/icons-material'

const SearchInput = ({ searchValue, handleSearch }) => {
  return (
    <div
      className={`flex flex-1 my-1 items-center ring-1 ring-gray-400 w-auto bg-gray-100 hover:bg-gray-200 ${
        searchValue && 'bg-pink-200 hover:bg-pink-300'
      }`}
    >
      <div className="pl-3 pr-1">
        <Search />
      </div>
      <input
        className="w-full py-1 px-2 outline-none bg-transparent text-2xl"
        value={searchValue || ''}
        onChange={handleSearch}
        placeholder="SEARCH…"
      />
    </div>
  )
}

export default SearchInput
