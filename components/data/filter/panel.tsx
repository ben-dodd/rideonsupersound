import { ExpandLess, ExpandMore } from '@mui/icons-material'
import { useState } from 'react'

const FilterPanel = ({ visible, children, collapsible = true, closedByDefault = false }) => {
  const [panelOpen, setPanelOpen] = useState(!closedByDefault)
  const togglePanel = () => setPanelOpen((panelOpen) => !panelOpen)
  return (
    <div className="rounded border mt-2">
      <div
        className={`flex justify-between text-xl p-2 border-b bg-gray-100 hover:border-gray-300 hover:shadow-sm select-none ${
          collapsible ? 'cursor-pointer' : ''
        }`}
      >
        {visible}
        {!collapsible ? (
          <div />
        ) : (
          <div onClick={collapsible ? togglePanel : null}>{panelOpen ? <ExpandLess /> : <ExpandMore />}</div>
        )}
      </div>
      <div className={`p-2 ${!panelOpen && collapsible && ' hidden'}`}>{children}</div>
    </div>
  )
}

export default FilterPanel
