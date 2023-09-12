import { ExpandLess, ExpandMore } from '@mui/icons-material'
import { useState } from 'react'

const SectionPanel = ({ icon, title, children, collapsible = true, closedByDefault = false }) => {
  const [panelOpen, setPanelOpen] = useState(!closedByDefault)
  const togglePanel = () => setPanelOpen((panelOpen) => !panelOpen)
  return (
    <div className="rounded border mt-2">
      <div
        className={`flex justify-between text-xl p-2 border-b bg-gray-100 hover:border-gray-300 hover:shadow-sm select-none ${
          collapsible ? 'cursor-pointer' : ''
        }`}
        onClick={collapsible ? togglePanel : null}
      >
        <div className="flex">
          {icon || ''}
          <div className="ml-2">{title}</div>
        </div>
        {!collapsible ? <div /> : panelOpen ? <ExpandLess /> : <ExpandMore />}
      </div>
      <div className={`p-2 ${!panelOpen && collapsible && ' hidden'}`}>{children}</div>
    </div>
  )
}

export default SectionPanel
