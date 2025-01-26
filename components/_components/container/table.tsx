export default function TableContainer({ loading, children }) {
  return loading ? (
    <div className="loading-screen">
      <div className="loading-icon" />
    </div>
  ) : (
    <div className="h-menu w-board overflow-x-hidden bg-white">{children}</div>
  )
}
