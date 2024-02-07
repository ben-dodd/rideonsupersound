export default function Tab({ tab, selectedTab, children }) {
  if (tab === selectedTab) {
    return <div className="w-full">{children}</div>
  } else return null
}
