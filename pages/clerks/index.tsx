
import Layout from 'components/layout'
import ClerksScreen from 'features/clerks'

function ClerksPage() {
  return (
    <div className={`flex relative overflow-x-hidden`}>
      <ClerksScreen />
    </div>
  )
}

ClerksPage.getLayout = (page) => <Layout>{page}</Layout>

export default ClerksPage