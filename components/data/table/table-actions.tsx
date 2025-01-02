import { Edit, FilterAlt, ViewColumn } from '@mui/icons-material'
import { Tooltip } from '@mui/material'
import DropdownMenu from 'components/dropdown-menu'
import SearchInput from 'components/inputs/search-input'
import { ColumnSelect } from './columnSelect'
import { useState } from 'react'

const TableActions = ({
  table,
  searchable,
  searchValue,
  handleSearch,
  showFilters,
  openFilters,
  showEdit,
  saveEdit,
  columnSelectable = false,
}) => {
  const [doEdit, setDoEdit] = useState(false)
  const startEdit = () => setDoEdit(true)
  const cancelEdit = () => setDoEdit(false)

  return (
    <div className="px-2 flex justify-end items-center w-board space-x-2">
      {searchable && (
        <div className="w-1/4">
          <SearchInput searchValue={searchValue} handleSearch={handleSearch} />
        </div>
      )}
      {showFilters && (
        <div className="icon-button-small-black">
          <Tooltip title="Filter Results">
            <div onClick={openFilters}>
              <FilterAlt />
            </div>
          </Tooltip>
        </div>
      )}
      {showEdit && (
        <div className={`flex items-center ${doEdit ? 'ml-0 space-x-2' : '-ml-20'}`}>
          {!doEdit && (
            <div onClick={startEdit} className="icon-button-small-black cursor-pointer flex-shrink-0">
              <Edit />
            </div>
          )}
          {doEdit && (
            <div className="flex items-center space-x-2">
              <button onClick={cancelEdit} className="icon-text-button">
                Cancel
              </button>
              <button onClick={saveEdit} className="icon-text-button-final">
                Save
              </button>
            </div>
          )}
        </div>
      )}
      {columnSelectable && (
        <div className="px-2 h-full">
          <DropdownMenu icon={<ViewColumn />} dark customMenu={<ColumnSelect table={table} />} />
        </div>
      )}
      {/* <StockFilter stockList={stockList} setSettings={setSetting} filterSettings={filterSettings} /> */}
    </div>
  )
}

export default TableActions
