import { ExpandLess, ExpandMore } from '@mui/icons-material'
import { useState } from 'react'

const SectionPanel = ({ icon, title, children }) => {
  const [panelOpen, setPanelOpen] = useState(true)
  const togglePanel = () => setPanelOpen((panelOpen) => !panelOpen)
  return (
    <div className="rounded border mt-2">
      <div className="flex justify-between text-xl p-2 border-b bg-gray-100">
        <div className="flex">
          {icon || ''}
          <div className="ml-2">{title}</div>
        </div>
        <button onClick={togglePanel}>{panelOpen ? <ExpandLess /> : <ExpandMore />}</button>
      </div>
      <div className={`p-2 ${!panelOpen && ' hidden'}`}>{children}</div>
    </div>
  )
}

export default SectionPanel
