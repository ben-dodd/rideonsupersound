import CollapsiblePanel from './collapsible-panel'

const SectionPanel = ({ icon, title, children, collapsible = true, closedByDefault = false }) => {
  return (
    <CollapsiblePanel
      visible={
        <div className="flex">
          {icon || ''}
          <div className="ml-2">{title}</div>
        </div>
      }
      collapsible={collapsible}
      closedByDefault={closedByDefault}
    >
      {children}
    </CollapsiblePanel>
  )
}

export default SectionPanel
