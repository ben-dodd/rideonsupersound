import Loading from 'components/placeholders/loading'

export default function TableContainer({ loading, children }) {
  return loading ? <Loading /> : <div className="h-main w-board overflow-x-hidden bg-white">{children}</div>
}
