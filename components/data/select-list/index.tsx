import { useEffect, useState } from 'react'
import SelectRow from './select-row'
import { getArrayOfNumbersBetweenTwoNumbers } from 'lib/utils'
import { getItemSku } from 'lib/functions/displayInventory'
// TODO - implement sort columns
// TODO - implement filters
// TODO - edit button

interface SelectListProps {
  data: any[]
  selected: number[]
  setSelected?: (selected: number[]) => void
  dblClickCallback?: (id: number) => void
  isLoading?: boolean
  isError?: boolean
}

const SelectList = ({
  data,
  selected,
  setSelected,
  dblClickCallback,
  isLoading = false,
  isError = false,
}: SelectListProps) => {
  const [lastSelected, setLastSelected] = useState(null)
  const [thisSelected, thisSetSelected] = useState(selected) // add option to have controlled by other component

  useEffect(() => {
    setSelected(thisSelected)
  }, [thisSelected])

  useEffect(() => {
    thisSetSelected(selected)
  }, [selected])

  const handleRowClick = (evt: any, id: number) => {
    evt.preventDefault()
    let newSelection = []
    if (evt.shiftKey && lastSelected !== null && !selected.includes(id)) {
      // Select all rows from last clicked row to the clicked one
      // Get array of rows
      newSelection = getArrayOfNumbersBetweenTwoNumbers(id, lastSelected)
    } else {
      newSelection = [id]
    }
    if (evt.metaKey || evt.altKey) {
      // If cmd or alt key held, don't unselect others
      newSelection = [...newSelection, ...selected]
    }
    if (selected.includes(id)) newSelection = newSelection.filter((selectId) => selectId !== id)
    setSelected(newSelection)
    if (!evt.shiftKey) setLastSelected(id)
  }

  return (
    <div className="shadow-inner overflow-y-scroll h-full w-full overflow-x-hidden whitespace-nowrap text-ellipsis border border-gray-400">
      {isLoading
        ? 'Loading...'
        : data?.length > 0 && (
            <div>
              {data.map((row: any, i) => (
                <SelectRow
                  key={i}
                  text={`[${getItemSku(row)}] ${row.artist} - ${row.title}`}
                  id={row.id}
                  isSelected={selected.includes(row.id)}
                  onClick={handleRowClick}
                  dblClickCallback={dblClickCallback}
                />
              ))}
            </div>
          )}
    </div>
  )
}

export default SelectList
