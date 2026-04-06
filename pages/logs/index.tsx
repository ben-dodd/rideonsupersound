
import Layout from 'components/layout'
import LogsScreen from 'features/log'

function LogPage() {
  return (
    <div className={`flex relative overflow-x-hidden`}>
      <LogsScreen />
    </div>
  )
}

LogPage.getLayout = (page) => <Layout>{page}</Layout>

export default LogPage
