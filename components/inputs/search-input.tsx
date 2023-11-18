import { Cancel, Search } from '@mui/icons-material'

const SearchInput = ({ searchValue, handleSearch }) => {
  return (
    <div
      className={`flex flex-1 my-1 justify-between items-center ring-1 ring-gray-400 w-auto bg-gray-100 hover:bg-gray-200 ${
        searchValue && 'bg-blue-100 hover:bg-blue-200'
      }`}
    >
      <div className="flex items-center flex-1">
        <div className="pl-3 pr-1">
          <Search />
        </div>
        <input
          className="w-full py-1 px-2 outline-none bg-transparent text-xl"
          value={searchValue || ''}
          onChange={handleSearch}
          placeholder="Search..."
        />
      </div>
      <div className="text-xs mr-2">
        <button onClick={() => handleSearch({ target: { value: '' } })}>
          <Cancel />
        </button>
      </div>
    </div>
  )
}

export default SearchInput
